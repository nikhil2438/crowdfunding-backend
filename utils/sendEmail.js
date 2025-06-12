// 
// utils/sendUserEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nikhilsingh675naman@gmail.com",
    pass: "xllsmezvbzukvzdk",
  },

  tls: {
    rejectUnauthorized: false,  
  },
});

const sendUserEmail = async (to, name, status) => {
  try {
    const subject =
      status === "approved"
        ? "🎉 Your Fundraiser is Approved"
        : "⚠️ Your Fundraiser was Rejected";

    const html = `
      <h2>Hello ${name},</h2>
      <p>Your fundraiser request has been <strong>${status.toUpperCase()}</strong>.</p>
      <p>Thank you for contributing to a good cause.</p>
      <br />
      <p>🙏 Maa Siddheshwari Charity Trust</p>
    `;

    const mailOptions = {
      from: "nikhilsingh675naman@gmail.com",
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} regarding status: ${status}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendUserEmail;
