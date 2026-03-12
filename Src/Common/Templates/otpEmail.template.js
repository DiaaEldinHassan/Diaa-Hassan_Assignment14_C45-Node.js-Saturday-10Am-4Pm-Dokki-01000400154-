export const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your OTP Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f3f0;font-family:Georgia,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3f0;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#1a1a1a,#555);"></td>
          </tr>

          <tr>
            <td style="padding:40px 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="width:36px;height:36px;background:#1a1a1a;border-radius:8px;display:inline-block;line-height:36px;text-align:center;">
                      <span style="color:#fff;font-family:monospace;font-size:14px;font-weight:600;">S</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;">Verification</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:#f0eeeb;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 48px 0;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1a1a1a;letter-spacing:-0.02em;">
                Here's your code
              </p>
              <p style="margin:0 0 32px;font-size:14px;color:#888;line-height:1.7;">
                Use the code below to verify <strong style="color:#555;">{{EMAIL}}</strong>. It expires in <strong style="color:#555;">10 minutes</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:#f9f8f6;border-radius:12px;padding:28px 24px;border:1px solid #ece9e3;">
                    <span style="font-family:monospace;font-size:40px;font-weight:700;color:#1a1a1a;letter-spacing:0.25em;">{{OTP}}</span>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td style="background:#fefcf8;border-left:3px solid #d4b896;border-radius:0 8px 8px 0;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#8a7560;line-height:1.6;">
                      If you didn't request this, you can safely ignore this email. Never share this code with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 48px 44px;">
              <div style="height:1px;background:#f0eeeb;margin-bottom:28px;"></div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td><p style="margin:0;font-size:12px;color:#bbb;">Sent at {{TIME}}</p></td>
                  <td align="right"><p style="margin:0;font-size:12px;color:#bbb;">Sarahah App</p></td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

export const qrTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>2FA Setup</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f3f0;font-family:Georgia,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3f0;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#1a1a1a,#555);"></td>
          </tr>

          <tr>
            <td style="padding:40px 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="width:36px;height:36px;background:#1a1a1a;border-radius:8px;display:inline-block;line-height:36px;text-align:center;">
                      <span style="color:#fff;font-family:monospace;font-size:14px;font-weight:600;">S</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size:11px;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;">2FA Setup</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:#f0eeeb;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 48px 0;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1a1a1a;letter-spacing:-0.02em;">
                Set up Two-Factor Authentication
              </p>
              <p style="margin:0 0 32px;font-size:14px;color:#888;line-height:1.7;">
                Scan the QR code below with your authenticator app to secure
                <strong style="color:#555;">{{EMAIL}}</strong>.
                Then enter the <strong style="color:#555;">setup key</strong> if your app asks for it manually.
              </p>

              <!-- QR Code -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:#f9f8f6;border-radius:12px;padding:32px 24px;border:1px solid #ece9e3;">
                    <img src="{{QRCODE}}" alt="QR Code" width="180" height="180"
                      style="display:block;border-radius:8px;" />
                    <p style="margin:16px 0 0;font-size:12px;color:#aaa;letter-spacing:0.05em;">
                      Scan with Google Authenticator, Authy, or any TOTP app
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Manual Setup Key -->
              <p style="margin:28px 0 10px;font-size:13px;color:#888;">Can't scan? Enter this key manually:</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:#f9f8f6;border-radius:12px;padding:20px 24px;border:1px solid #ece9e3;">
                    <span style="font-family:monospace;font-size:20px;font-weight:700;color:#1a1a1a;letter-spacing:0.25em;">{{SECRET}}</span>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="background:#fefcf8;border-left:3px solid #d4b896;border-radius:0 8px 8px 0;padding:14px 18px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#8a7560;">How to set up:</p>
                    <p style="margin:0;font-size:13px;color:#8a7560;line-height:1.8;">
                      1. Open your authenticator app<br/>
                      2. Tap <strong>Add account</strong> → <strong>Scan QR code</strong><br/>
                      3. Scan the code above<br/>
                      4. Enter the 6-digit code shown in the app to confirm
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="background:#fff8f8;border-left:3px solid #e8a0a0;border-radius:0 8px 8px 0;padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#b06060;line-height:1.6;">
                      If you didn't request this, your account may be at risk.
                      Please change your password immediately.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="padding:40px 48px 44px;">
              <div style="height:1px;background:#f0eeeb;margin-bottom:28px;"></div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td><p style="margin:0;font-size:12px;color:#bbb;">Sent at {{TIME}}</p></td>
                  <td align="right"><p style="margin:0;font-size:12px;color:#bbb;">Sarahah App</p></td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;