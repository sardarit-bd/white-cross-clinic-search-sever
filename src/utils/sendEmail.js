import nodemailer from "nodemailer";
import { envVars } from "../config/env.js";

const transporter = nodemailer.createTransport({
    service: envVars.EMAIL_SERVICE,
    auth: {
        user: envVars.EMAIL_USERNAME,
        pass: envVars.EMAIL_PASSWORD,
    },
});

const generateEmailTemplate = (title, message, extra = "") => {
    return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f8f9fa;">
    
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #005f99; margin: 0;">${title}</h2>
    </div>

    <p style="font-size: 15px; color: #333; line-height: 1.6;">
      ${message}
    </p>

    ${extra}

    <br><br>
    <p style="font-size: 13px; color: #666;">
      Best regards,<br>
      <strong>White Cross Clinic Team</strong><br>
    </p>
  </div>
  `;
};




export const sendResetPasswordEmail = async (email, resetUrl) => {
    try {
        const subject = "Password Reset Request";
        const message = `
      We received a request to reset the password for your 
      <strong>White Cross Clinic</strong> account.

      <br><br>
      Click the button below to reset your password. This link will expire in 
      <strong>15 minutes</strong> for security reasons.
    `;

        const button = `
      <div style="margin-top: 20px;">
        <a href="${resetUrl}" target="_blank" 
          style="display: inline-block; padding: 12px 20px; background: #005F99; color: #fff;
          text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
      </div>

      <p style="margin-top: 10px; font-size: 13px; color: #777;">
        If the button doesn't work, you can use this link:<br>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>

      <p style="margin-top: 20px; font-size: 13px; color: #444;">
        If you did not request a password reset, please ignore this email.
      </p>
    `;

        const mailOptions = {
            from: `"${"White Cross Clinic"}" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject,
            html: generateEmailTemplate(subject, message, button),
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Password reset email error:", error);
        throw new Error("Failed to send password reset email");
    }
};


const generateEmailMsg = (msg, phone, name, email) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      
      <h2 style="color:#0b7dda;">New Message from Website</h2>

      <p>You have received a new message from the contact form.</p>

      <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Name:</td>
          <td style="padding: 8px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Email:</td>
          <td style="padding: 8px;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Phone:</td>
          <td style="padding: 8px;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Message:</td>
          <td style="padding: 8px;">${msg}</td>
        </tr>
      </table>

      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        This email was sent from your website contact form.
      </p>

    </div>
  `;
};
export const sendEmail = async (payload) => {
  const {name, email, phone, msg} = payload
    try {
        const subject = "Email From White Cross Clinic Contact Form";

        const mailOptions = {
            from: `"${"White Cross Clinic"}" <${email}>`,
            to: process.env.EMAIL_USERNAME,
            subject,
            html: generateEmailMsg(msg, phone, name, email),
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Email Sending:", error);
        throw new Error("Failed to send password reset email");
    }
};