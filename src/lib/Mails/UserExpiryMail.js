import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
    console.error(
        "Email credentials are missing. Set EMAIL_USER and EMAIL_PASS environment variables."
    );
}

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

// Function to format date according to user's timezone
function formatExpiryDate(date, timezone = "Asia/Kolkata") {
    try {
        const options = {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(date);

        const year = parts.find(part => part.type === 'year').value;
        const month = parts.find(part => part.type === 'month').value;
        const day = parts.find(part => part.type === 'day').value;
        const hour = parts.find(part => part.type === 'hour').value;
        const minute = parts.find(part => part.type === 'minute').value;
        const dayPeriod = parts.find(part => part.type === 'dayPeriod').value;

        // Get timezone abbreviation
        const timezoneAbbr =
            new Intl.DateTimeFormat("en", {
                timeZone: timezone,
                timeZoneName: "short",
            })
                .formatToParts(date)
                .find((part) => part.type === "timeZoneName")?.value ||
            timezone;

        return `${day}-${month}-${year} ${hour}:${minute} ${dayPeriod} (${timezoneAbbr})`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return date.toLocaleDateString();
    }
}

export async function sendUserExpiryMail(user, userTimezone = null) {
    try {
        console.log(user)
        if (!user || !user.email || !user.validity) {
            console.error("Missing required user information for expiry email");
            return {
                success: false,
                message: "Missing required user information",
            };
        }

        const validityDate = new Date(user.validity);
        const timezone = userTimezone || "Asia/Kolkata";
        const formattedExpiryDate = formatExpiryDate(validityDate, timezone);

        const mailOptions = {
            from: `"Transportation System" <${EMAIL_USER}>`,
            to: user.email,
            subject: "Account Expired - Transportation System",
            text: `Hello ${user.name},\n\nYour Transportation System account has expired on ${formattedExpiryDate}.\n\nYour account access has been deactivated. If you need to access the system again, please submit a new request through our registration process.\n\nBest regards,\nTransportation System Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; color: #333;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #dc3545; margin: 0;">Account Expired</h1>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.5;">Hello ${user.name},</p>
                    
                    <p style="font-size: 16px; line-height: 1.5;">
                        Your Transportation System account has expired on 
                        <strong style="color: #dc3545;">${formattedExpiryDate}</strong>.
                    </p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                            <strong>Account Status:</strong> Deactivated<br>
                            <strong>Access:</strong> Suspended
                        </p>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.5;">
                        If you need to access the system again, please submit a new request through our registration process.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
                    
                    <p style="font-size: 14px; color: #6c757d; margin: 0;">
                        Best regards,<br>
                        Transportation System Team
                    </p>
                </div>
            `,
        };

        try {
            await transporter.verify();
            const info = await transporter.sendMail(mailOptions);
            console.log("User expiry email sent successfully:", info.response);
            return { success: true, message: "Expiry email sent successfully" };
        } catch (error) {
            console.error("Error sending user expiry email:", error);
            return {
                success: false,
                message: `Failed to send expiry email: ${error.message}`,
                error,
            };
        }
    } catch (setupError) {
        console.error("Error setting up expiry email:", setupError);
        return {
            success: false,
            message: `Failed to prepare expiry email: ${setupError.message}`,
            error: setupError,
        };
    }
}
