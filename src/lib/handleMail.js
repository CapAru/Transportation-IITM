import nodemailer from "nodemailer";

// Validate environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Check if credentials exist
if (!EMAIL_USER || !EMAIL_PASS) {
    console.error(
        "Email credentials are missing. Set EMAIL_USER and EMAIL_PASS environment variables."
    );
}

// Create transporter with more secure settings
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: true,
    },
});

export async function sendPasswordMail(user, password) {
    try {
        // Validate required input
        if (!user || !user.email || !password) {
            console.error("Missing required fields:", {
                user,
                hasPassword: !!password,
            });
            return {
                success: false,
                message: "Missing required user information or password",
            };
        }

        // Check if email credentials exist before trying to send
        if (!EMAIL_USER || !EMAIL_PASS) {
            console.error("Cannot send email: Missing email credentials");
            return {
                success: false,
                message: "Email service not configured. Contact administrator.",
                error: new Error("Email credentials not configured"),
            };
        }

        const mailOptions = {
            from: `"Transportation System" <${EMAIL_USER}>`,
            to: user.email,
            subject: "Your Account Has Been Approved",
            text: `Hello ${user.name},\n\nYour account has been approved. You can now log in using the following credentials:\n\nEmail: ${user.email}\nPassword: ${password}\n\nPlease change your password after logging in for security reasons.\n\nThank you!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2a4365;">Your Account Has Been Approved</h2>
                    <p>Hello ${user.name},</p>
                    <p>Your account has been approved. You can now log in using the following credentials:</p>
                    <div style="background-color: #f0f4f8; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>
                    <p style="color: #e53e3e; font-weight: bold;">Please change your password after logging in for security reasons.</p>
                    <p>Thank you!</p>
                </div>
            `,
        };

        try {
            // Verify connection configuration before sending
            await transporter.verify();

            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);
            return { success: true, message: "Email sent successfully" };
        } catch (error) {
            console.error("Error sending email:", error);
            return {
                success: false,
                message: `Failed to send email: ${error.message}`,
                error,
            };
        }
    } catch (setupError) {
        console.error("Error setting up email:", setupError);
        return {
            success: false,
            message: `Failed to prepare email: ${setupError.message}`,
            error: setupError,
        };
    }
}
