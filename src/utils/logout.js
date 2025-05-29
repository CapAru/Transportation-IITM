const handleLogout = async () => {
    try {
        const res = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("Logout failed");
        }

        // Redirect to login page after successful logout
        window.location.href = "/login";
    } catch (err) {
        console.error("Error during logout:", err);
        alert("An error occurred while logging out.");
    }
};
export default handleLogout;