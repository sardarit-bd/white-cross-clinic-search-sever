import express from 'express';
import { Role } from '../auth/auth.model.js';
import { checkAuth } from '../../middlewares/checkAuth.js';
import { paymentController } from './payment.controller.js';


const router = express.Router();

// Create checkout session (requires auth)
router.post(
    '/create-checkout',
    checkAuth(...Object.values(Role)),
    paymentController.createCheckout
);

// Verify payment (requires auth)
router.post(
    '/verify',
    checkAuth(...Object.values(Role)),
    paymentController.verifyPayment
);

// Get payment history
router.get('/history', checkAuth(...Object.values(Role)), paymentController.getPaymentHistory);
router.get('/my-history', checkAuth(Role.OWNER, Role.SUPER_ADMIN, Role.TENANT), paymentController.getMyPaymentHistory);


// Request refund
router.post('/refund', checkAuth(Role.OWNER, Role.SUPER_ADMIN, Role.TENANT), paymentController.requestRefund);

// Get refund details
// router.get('/refunds/:refundId', checkAuth(Role.OWNER, Role.SUPER_ADMIN, Role.TENANT), paymentController.getRefundDetails);
// router.get('/:id', checkAuth(Role.OWNER, Role.SUPER_ADMIN, Role.TENANT), paymentController.getPaymentDetails);

export const PaymentRoutes = router;
