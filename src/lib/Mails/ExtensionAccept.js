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

// Function to send acceptance email
export default async function sendExtensionAcceptanceEmail(
    email,
    name,
    extensionDate
) {
    try {
        const mailOptions = {
            from: `"Transportation System" <${EMAIL_USER}>`,
            to: email,
            subject: "Extension Request Approved - Transportation System",
            text: `Dear ${name},\n\nGreat news! Your extension request has been approved.\n\nNew Validity Date: ${new Date(
                extensionDate
            ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}\n\nYour transportation access has been successfully extended. You can now continue using the transportation services until the new validity date.\n\nThank you for your patience during the review process.\n\nBest regards,\nTransportation System Team\nIIT Madras`,

            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Extension Request Approved</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center;">
                            <div style="background-color: rgba(255, 255, 255, 0.2); display: inline-block; padding: 12px; border-radius: 50%; margin-bottom: 15px;">
                                <div style="font-size: 32px;">✅</div>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                                Extension Request Approved
                            </h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">
                                Transportation System - IIT Madras
                            </p>
                        </div>

                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                            <p style="color: #374151; font-size: 18px; margin: 0 0 25px 0; line-height: 1.6;">
                                Dear <strong style="color: #1f2937;">${name}</strong>,
                            </p>
                            
                            <p style="color: #4b5563; font-size: 16px; margin: 0 0 30px 0; line-height: 1.7;">
                                Great news! Your extension request has been <strong style="color: #059669;">approved</strong>. 
                                Your transportation access has been successfully extended.
                            </p>

                            <!-- Validity Date Box -->
                            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
                                <h2 style="color: #065f46; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                                    🗓️ New Validity Date
                                </h2>
                                <p style="color: #059669; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                                    ${new Date(
                                        extensionDate
                                    ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            <p style="color: #4b5563; font-size: 16px; margin: 30px 0 0 0; line-height: 1.7;">
                                You can now continue using the transportation services until the new validity date. 
                                Thank you for your patience during the review process.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 16px; margin: 0 0 5px 0; line-height: 1.6;">
                                Best regards,
                            </p>
                            <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                                Transportation System Team
                            </p>
                            <p style="color: #9ca3af; font-size: 14px; margin: 0; font-style: italic;">
                                Indian Institute of Technology Madras
                            </p>
                            
                            <!-- Divider -->
                            <div style="height: 1px; background-color: #e5e7eb; margin: 20px 0;"></div>
                            
                            <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center; line-height: 1.5;">
                                This is an automated message. Please do not reply to this email.<br>
                                For any queries, please contact the Transportation System Team.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        if (!info || !info.accepted || info.accepted.length === 0) {
            throw new Error("Email not sent successfully");
        }

        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending extension acceptance email:", error);
        throw new Error("Failed to send extension acceptance email");
    }
}
