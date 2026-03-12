import nodemailer from "nodemailer";
import {
  errorThrow,
  generateOtp,
  template,
  qrTemplate,
  set,
  emitter,
} from "../../index.js";
import { account, password } from "../../../Config/config.service.js";

export async function sendOtp(receiver) {
  const otp = await generateOtp();
  const payload = { otp, attempts: 0 };

  await set(`OTP:${receiver}`, JSON.stringify(payload), 600);

  const html = template
    .replace("{{OTP}}", otp)
    .replace("{{TIME}}", new Date().toLocaleString())
    .replace("{{EMAIL}}", receiver);

  emitter.emit("sendOtp", { receiver, html });
}

export async function sendTempPassword(receiver, tempPassword) {
  const payload = tempPassword;
  const html = template
    .replace("{{OTP}}", payload)
    .replace("{{TIME}}", new Date().toLocaleString())
    .replace("{{EMAIL}}", receiver);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: account, pass: password },
    });

    await transporter.sendMail({
      from: `"Sarahah App" <${account}>`,
      to: receiver,
      subject: "Your Temporary Password ",
      html,
    });
  } catch (err) {
    errorThrow(500, "Failed to send email.");
  }
}

export async function sendQrCode(userEmail, qrcode, secret) {

  const base64Data = qrcode.split(",")[1]; 
  const imageBuffer = Buffer.from(base64Data, "base64");

  const html = qrTemplate
    .replace("{{QRCODE}}", "cid:unique_qrcode_id") 
    .replace("{{SECRET}}", secret)
    .replace("{{TIME}}", new Date().toLocaleString())
    .replace("{{EMAIL}}", userEmail);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: account, pass: password },
  });

  await transporter.sendMail({
    from: `"Sarahah App" <${account}>`,
    to: userEmail,
    subject: "Set Up Two-Factor Authentication",
    html,
    attachments: [
      {
        filename: "qrcode.png",
        content: imageBuffer,
        cid: "unique_qrcode_id", 
        contentDisposition: "inline",
      },
    ],
  });
}

export async function sendResetLink(receiver, link) {
  const html = `
    <p>Hello,</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p><a href="${link}">${link}</a></p>
    <p>This link will expire in one hour and can only be used once.</p>
    <p>If you didn't request it, please ignore this email.</p>
    <p>Regards,<br/>Sarahah App Team</p>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: account, pass: password },
    });

    await transporter.sendMail({
      from: `\"Sarahah App\" <${account}>`,
      to: receiver,
      subject: "Reset your password",
      html,
    });
  } catch (err) {
    errorThrow(500, "Failed to send email.");
  }
}
