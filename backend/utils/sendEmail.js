import nodemailer from "nodemailer";

/**
 * Sends a premium verification email to the user.
 * Falls back to console log with instructions if SMTP environment variables are missing.
 */
const sendEmail = async ({ to, subject, code }) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.log("\n=====================================================================");
        console.log("[SMTP WARNING] EMAIL_USER or EMAIL_PASS not configured in .env file.");
        console.log(`[OTP SIMULATOR] Resilient Roots Reset Code for ${to} is: ${code}`);
        console.log("To receive real emails, add the following to your root .env file:");
        console.log("EMAIL_USER=your_gmail@gmail.com");
        console.log("EMAIL_PASS=your_gmail_app_password");
        console.log("=====================================================================\n");
        return { simulated: true };
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    const htmlContent = `
        <div style="background-color: #020617; color: #f1f5f9; font-family: sans-serif; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #10b981;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
                    Resilient <span style="color: #10b981; font-style: italic;">Roots</span>
                </h1>
                <p style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin-top: 5px;">
                    Digital Agricultural Support
                </p>
            </div>
            
            <div style="background-color: #0f172a; padding: 30px; border-radius: 12px; border: 1px solid #334155; text-align: center;">
                <h2 style="color: #ffffff; font-size: 20px; margin-top: 0; font-weight: 800;">Password Reset Request</h2>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                    We received a request to reset your password. Use the verification code below to proceed with setting up a new credential:
                </p>
                
                <div style="margin: 30px 0; background-color: #020617; border: 1px dashed #10b981; padding: 15px 30px; border-radius: 8px; display: inline-block;">
                    <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #10b981; font-family: monospace;">
                        ${code}
                    </span>
                </div>
                
                <p style="color: #94a3b8; font-size: 11px; line-height: 1.6;">
                    This verification code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.
                </p>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #475569; font-size: 9px; text-transform: uppercase; letter-spacing: 4px;">
                © 2026 Resilient Roots AI • Lab Team
            </div>
        </div>
    `;

    const mailOptions = {
        from: `"Resilient Roots Support" <${emailUser}>`,
        to,
        subject,
        text: `Your Resilient Roots verification code is: ${code}`,
        html: htmlContent
    };

    return await transporter.sendMail(mailOptions);
};

export default sendEmail;
