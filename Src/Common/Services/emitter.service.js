import { EventEmitter } from "events";
import nodemailer from "nodemailer";
import { del } from "../../index.js";
import { account, password } from "../../../Config/config.service.js";

export const emitter = new EventEmitter();

emitter.on("sendOtp", async ({ receiver, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: account, pass: password },
    });

    await transporter.sendMail({
      from: `"Sarahah App" <${account}>`,
      to: receiver,
      subject: "Your OTP Code",
      html,                  
    });

    emitter.emit("otpSent", { receiver });
    console.log(`[OTP] ✅ Email sent to ${receiver}`);

  } catch (error) {
    await del(`OTP:${receiver}`);
    emitter.emit("otpFailed", { receiver, error });
    console.error(`[OTP] ❌ Failed for ${receiver}:`, error.message);
  }
});

emitter.on("otpSent",   ({ receiver }) => console.log(`[OTP] Delivered to ${receiver}`));
emitter.on("otpFailed", ({ receiver, error }) => console.error(`[OTP] Failed for ${receiver}:`, error.message));

