
export const metadata = {
    title: 'Access Denied',
    description: 'You do not have permission to view this page.',
};

export default function RootLayout({ children }) {
    return (
        <div>{children}</div>
    );
}