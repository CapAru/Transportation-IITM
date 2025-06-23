export const metadata = {
    title: "User Profile",
    description: "User profile page for managing account settings and preferences.",
};
export default function ProfileLayout({ children }) {
    return (
        <div>
            {children}
        </div>
    );
}