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

// Function to format date according to user's timezone
function formatDateByTimezone(date, timezone = "Asia/Kolkata") {
    try {
        // Create date in the specified timezone
        const dateInTimezone = new Date(
            date.toLocaleString("en-US", { timeZone: timezone })
        );

        const year = dateInTimezone.getFullYear();
        const month = String(dateInTimezone.getMonth() + 1).padStart(2, "0");
        const day = String(dateInTimezone.getDate()).padStart(2, "0");
        const formattedDate = `${day}-${month}-${year}`;

        // Get hours in 12 hour format
        const hours = dateInTimezone.getHours() % 12 || 12;
        const ampm = dateInTimezone.getHours() >= 12 ? "PM" : "AM";
        const minutes = dateInTimezone.getMinutes().toString().padStart(2, "0");

        // Get timezone abbreviation
        const timezoneAbbr =
            new Intl.DateTimeFormat("en", {
                timeZone: timezone,
                timeZoneName: "short",
            })
                .formatToParts(date)
                .find((part) => part.type === "timeZoneName")?.value ||
            timezone;

        return `${formattedDate} ${hours}:${minutes} ${ampm} (${timezoneAbbr})`;
    } catch (error) {
        console.error("Error formatting date:", error);
        // Fallback to UTC if timezone conversion fails
        return date.toUTCString();
    }
}

export async function sendPasswordMail(user, password, validityDate, userTimezone = null) {
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

        const validity = validityDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        let timezone = userTimezone;

        if (!timezone) {
            timezone = "Asia/Kolkata"; // Default to IST
        }

        const expiryDate = formatDateByTimezone(validity, timezone);

        const mailOptions = {
            from: `"Transportation System" <${EMAIL_USER}>`,
            to: user.email,
            subject: "Account Approved - Transportation System",
            text: `Hello ${user.name},\n\nYour account has been approved for the Transportation System.\n\nLogin Details:\nEmail: ${user.email}\nPassword: ${password}\n\nAccount valid until: ${expiryDate}\n\nBest regards,\nTransportation System Team`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; margin-bottom: 20px;">Account Approved</h2>
                    <p>Hello ${user.name},</p>
                    <p>Your account has been approved for the Transportation System.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #555;">Login Details</h3>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>
                    
                    <p><strong>Account valid until:</strong> ${expiryDate}</p>
                    
                    <p>Best regards,<br>Transportation System Team</p>
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
