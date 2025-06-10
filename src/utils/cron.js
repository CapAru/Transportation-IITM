import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();
cron.schedule("* * * * *", async () => {
    const baseUrl = process.env.LOCAL_API_URL || "http://localhost:3000";
    try {
        const res = await fetch(
            `${baseUrl}/api/remove-expired-user`,
            {
                method: "POST",
                headers: {
                    "x-cron-secret": process.env.CRON_SECRET,
                },
            }
        );
        const data = await res.json();
        console.log("[CRON] Removed expired users:", data);
    } catch (err) {
        console.error("[CRON] Error running cron job:", err);
    }
});
