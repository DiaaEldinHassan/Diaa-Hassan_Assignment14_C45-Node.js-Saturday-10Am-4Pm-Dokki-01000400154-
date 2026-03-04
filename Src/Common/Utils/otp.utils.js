import crypto from "node:crypto";

export async function generateOtp() {
    let otp = crypto.randomInt(0,1000000).toString().padEnd(6,0);
    return otp;
}