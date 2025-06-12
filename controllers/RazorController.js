const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const PaymentModel = require("../Models/Payment");
const donationModel = require("../Models/donation");
const mongoose = require("mongoose");

const invoice = require("../Certificates/GenerateCertificate");
console.log(invoice);

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: "INR",
      receipt: "donation_rcpt_" + Date.now(),
    };
    const order = await instance.orders.create(options);

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    FullName,
    ContactNumber,
    Email,
    address,
    category,
    Language,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_SECRET || "wfGM2AxXvRPUnrdEsVA62WyP"
    )
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed. Signature mismatch!",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  let isCommitted = false;

  try {
    const payment = await PaymentModel.create(
      [
        {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount,
          currency: "INR",
          paymentStatus: "Success",
        },
      ],
      { session }
    );

    const donation = await donationModel.create(
      [
        {
          FullName,
          ContactNumber,
          Email,
          address,
          category,
          Language,
          amount,
          donation: payment[0]._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    // session.endSession();
    isCommitted = true;

    invoice(
      donation[0].FullName,
      donation[0].amount,
      donation[0].createdAt,
      donation[0].address
    );

    res.status(200).json({
      success: true,
      message: "Payment verified and donation saved successfully!",
      donation: donation[0],
    });
  } catch (err) {
    if (!isCommitted) {
      try {
        await session.abortTransaction();
      } catch (abortErr) {
        console.error("Abort failed:", abortErr.message);
      }
    }

    console.error("Transaction error:", err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong during transaction.",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};
