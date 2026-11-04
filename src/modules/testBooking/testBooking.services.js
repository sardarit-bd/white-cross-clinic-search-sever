import mongoose from "mongoose";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import Test from "../tests/tests.model.js";
import { TestBooking, GENDERS } from "./testBooking.model.js";
import { sendBookingEmails } from "../../utils/sendEmail.js";

// ---------- Booking rules (change only here) ----------
const CLINIC_TIMEZONE = "Europe/London";
const FIRST_SLOT = "09:00";
const LAST_SLOT = "16:40";
const SLOT_INTERVAL_MINUTES = 20;
const BOOKING_WINDOW_DAYS = 30;
const AFTERNOON_STARTS_AT = "12:00";
// -------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTimeString = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}`;

const ALL_SLOTS = (() => {
  const slots = [];
  for (
    let m = toMinutes(FIRST_SLOT);
    m <= toMinutes(LAST_SLOT);
    m += SLOT_INTERVAL_MINUTES
  ) {
    slots.push(toTimeString(m));
  }
  return slots;
})();

const getClinicNow = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CLINIC_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type).value;

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
};

const isValidDateString = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
};

const addDays = (value, days) => {
  const d = new Date(`${value}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const clean = (value) => (typeof value === "string" ? value.trim() : "");

const getBookableDates = () => {
  const now = getClinicNow();
  // If today's last slot has passed, start from tomorrow
  const start = now.minutes >= toMinutes(LAST_SLOT) ? 1 : 0;
  return Array.from({ length: BOOKING_WINDOW_DAYS + 1 }, (_, i) =>
    addDays(now.date, start + i)
  );
};

const assertBookableDate = (date) => {
  if (!isValidDateString(date)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A valid date (YYYY-MM-DD) is required"
    );
  }
  if (!getBookableDates().includes(date)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This date is not available for booking"
    );
  }
};

const getAvailableSlots = async (date) => {
  assertBookableDate(date);

  const taken = await TestBooking.find({ date, status: "confirmed" }).select(
    "time"
  );
  const takenSet = new Set(taken.map((b) => b.time));
  const now = getClinicNow();

  const free = ALL_SLOTS.filter(
    (time) =>
      !takenSet.has(time) &&
      !(date === now.date && toMinutes(time) <= now.minutes)
  );

  return {
    date,
    morning: free.filter((t) => toMinutes(t) < toMinutes(AFTERNOON_STARTS_AT)),
    afternoon: free.filter(
      (t) => toMinutes(t) >= toMinutes(AFTERNOON_STARTS_AT)
    ),
  };
};

const createBooking = async (payload = {}) => {
  const testSlug = clean(payload.testSlug);
  const date = clean(payload.date);
  const time = clean(payload.time);
  const firstName = clean(payload.firstName);
  const lastName = clean(payload.lastName);
  const dateOfBirth = clean(payload.dateOfBirth);
  const gender = clean(payload.gender);
  const phone = clean(payload.phone);
  const email = clean(payload.email).toLowerCase();

  if (
    !testSlug ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !gender ||
    !email
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please fill in all required fields"
    );
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please enter a valid email");
  }
  if (!GENDERS.includes(gender)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please select a valid gender");
  }

  const now = getClinicNow();
  if (!isValidDateString(dateOfBirth) || dateOfBirth > now.date) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please enter a valid date of birth"
    );
  }

  assertBookableDate(date);
  if (!ALL_SLOTS.includes(time)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid time slot");
  }
  if (date === now.date && toMinutes(time) <= now.minutes) {
    throw new AppError(httpStatus.BAD_REQUEST, "This time has already passed");
  }

  const test = await Test.findOne({ slug: testSlug });
  if (!test) {
    throw new AppError(httpStatus.NOT_FOUND, "Test not found");
  }

  const _id = new mongoose.Types.ObjectId();
  const bookingRef = `WCC-${_id.toString().slice(-6).toUpperCase()}`;

  let booking;
  try {
    booking = await TestBooking.create({
      _id,
      bookingRef,
      test: test._id,
      testTitle: test.title,
      testSlug: test.slug,
      price: test.price ?? null,
      phlebotomyFee: test.phlebotomyFee ?? null,
      date,
      time,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Sorry, this time slot has just been taken. Please choose another time."
      );
    }
    throw error;
  }

  // An email problem must not undo a confirmed booking
  try {
    await sendBookingEmails(booking.toObject());
  } catch (error) {
    console.error("Booking email error:", error);
  }

  return {
    bookingRef,
    testTitle: booking.testTitle,
    date: booking.date,
    time: booking.time,
    email: booking.email,
  };
};

export const TestBookingServices = {
  getBookableDates,
  getAvailableSlots,
  createBooking,
};