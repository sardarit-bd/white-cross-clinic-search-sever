import { catchAsync } from "../../utils/catchAsync.js";
import { DoctorAppointment } from "../schedule/doctorAppointment.model.js";
import Payment from "./payment.model.js";
import { stripeService } from "./payment.services.js";

// Create checkout session for featured listing
const createCheckout = catchAsync(async (req, res) => {
  const { appointmentId } = req.body;

  // Verify property belongs to user
  const appointment = await DoctorAppointment.findById(appointmentId)

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment is not found'
    });
  }

  // Create Stripe checkout session
  const session = await stripeService.createCheckoutSession(appointment, req.user);

  // Save payment record in database
  const payment = await Payment.create({
    sessionId: session.id,
    amount: appointment.price,
    currency: 'usd',
    user: req.user.userId,
    appointment: appointmentId,
    status: 'pending',
  });

  res.status(200).json({
    success: true,
    message: 'Checkout session created',
    data: {
      sessionId: session.id,
      url: session.url,
      paymentId: payment._id
    }
  });
});


// Verify payment after success
const verifyPayment = catchAsync(async (req, res) => {
  const { sessionId } = req.body;

  const session = await stripeService.verifyPayment(sessionId);

  if (!session) {
    return res.status(400).json({
      success: false,
      message: 'Invalid session'
    });
  }

  // Find payment record
  const payment = await Payment.findOne({ sessionId });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment record not found'
    });
  }

  if (session.payment_status === 'paid') {
    // Update payment record
    payment.status = 'paid';
    payment.paidAt = new Date();
    payment.paymentIntentId = session.payment_intent;
    payment.cardLast4 = session.payment_intent?.charges?.data[0]?.payment_method_details?.card?.last4;
    payment.cardBrand = session.payment_intent?.charges?.data[0]?.payment_method_details?.card?.brand;
    await payment.save();

    // Update property to featured

    const appointmentId = session.metadata.appointmentId;

    await DoctorAppointment.findByIdAndUpdate(appointmentId, {
      confirmed: true
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified. Property is now featured!',
      data: {
        paymentId: payment._id,
        appointmentId,
        paymentStatus: 'paid'
      }
    });
  } else if (session.payment_status === 'unpaid' || session.payment_status === 'canceled') {
    payment.status = 'failed';
    await payment.save();

    return res.status(400).json({
      success: false,
      message: 'Payment failed or canceled'
    });
  }

  res.status(400).json({
    success: false,
    message: 'Payment not completed'
  });
});


// Get payment history
const getPaymentHistory = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, paymentType, startDate, endDate } = req.query;

  // Apply filters
  if (status) query.status = status;

  // Date range filter
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find()
      .populate('appointment', 'name email phone')
      .populate('user', "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Payment.countDocuments()
  ]);

  // Calculate total spent
  const totalSpent = await Payment.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(200).json({
    success: true,
    message: 'Payment history retrieved',
    data: {
      payments,
      summary: {
        totalPayments: total,
        totalSpent: totalSpent[0]?.total || 0,
        successfulPayments: await Payment.countDocuments({ status: 'paid' }),
        refundedPayments: await Payment.countDocuments({ status: 'refunded' })
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

const getMyPaymentHistory = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, startDate, endDate } = req.query;

  const query = { user: req.user.userId };

  // Apply filters
  if (status) query.status = status;

  // Date range filter
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('appointment', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Payment.countDocuments(query)
  ]);

  // Calculate total spent
  const totalSpent = await Payment.aggregate([
    { $match: { ...query, status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(200).json({
    success: true,
    message: 'Payment history retrieved',
    data: {
      payments,
      summary: {
        totalPayments: total,
        totalSpent: totalSpent[0]?.total || 0,
        successfulPayments: await Payment.countDocuments({ ...query, status: 'paid' }),
        refundedPayments: await Payment.countDocuments({ ...query, status: 'refunded' })
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});


// Request refund
const requestRefund = catchAsync(async (req, res) => {
  const { paymentId, reason, refundAmount } = req.body;

  // Find payment
  const payment = await Payment.findOne({
    _id: paymentId,
    user: req.user.userId
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  // Check if payment is eligible for refund
  if (payment.status !== 'paid') {
    return res.status(400).json({
      success: false,
      message: 'Only paid payments can be refunded'
    });
  }

  if (!payment.paymentIntentId) {
    return res.status(400).json({
      success: false,
      message: 'Payment intent not found'
    });
  }

  // Calculate refund amount
  const amountToRefund = refundAmount || payment.amount;
  const availableForRefund = payment.amount - payment.totalRefunded;

  if (amountToRefund > availableForRefund) {
    return res.status(400).json({
      success: false,
      message: `Maximum refund amount available is $${availableForRefund}`
    });
  }

  try {
    // Create refund in Stripe
    const refund = await stripeService.createRefund(
      payment.paymentIntentId,
      amountToRefund,
      reason
    );

    // Update payment record
    payment.refunds.push({
      refundId: refund.id,
      amount: amountToRefund,
      reason: reason || 'Customer request',
      status: refund.status
    });

    payment.totalRefunded += amountToRefund;

    // Update payment status
    if (payment.totalRefunded >= payment.amount) {
      payment.status = 'refunded';
      payment.refundedAt = new Date();

      // Remove featured status from property
      if (payment.appointment) {
        await DoctorAppointment.findByIdAndUpdate(payment.appointment, {
          confirmed: false
        });
      }
    } else if (payment.totalRefunded > 0) {
      payment.status = 'partially_refunded';
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Refund requested successfully',
      data: {
        refundId: refund.id,
        refundAmount: amountToRefund,
        refundStatus: refund.status,
        paymentStatus: payment.status,
        remainingBalance: payment.amount - payment.totalRefunded
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Refund failed: ${error.message}`
    });
  }
});

// Get refund details
// const getRefundDetails = catchAsync(async (req, res) => {
//   const { refundId } = req.params;

//   const payment = await Payment.findOne({
//     'refunds.refundId': refundId,
//     user: req.user.userId
//   });

//   if (!payment) {
//     return res.status(404).json({
//       success: false,
//       message: 'Refund not found'
//     });
//   }


//   const stripeRefund = await stripeService.getRefund(refundId);


//   const refund = payment.refunds.find(r => r.refundId === refundId);

//   res.status(200).json({
//     success: true,
//     message: 'Refund details retrieved',
//     data: {
//       refund,
//       stripeRefund: {
//         id: stripeRefund?.id,
//         amount: stripeRefund?.amount ? stripeRefund.amount / 100 : null,
//         status: stripeRefund?.status,
//         currency: stripeRefund?.currency,
//         reason: stripeRefund?.reason
//       },
//       payment: {
//         id: payment._id,
//         amount: payment.amount,
//         totalRefunded: payment.totalRefunded
//       }
//     }
//   });
// });

export const paymentController = {
  createCheckout,
  verifyPayment,
  getPaymentHistory,
  requestRefund,
  getMyPaymentHistory
}