"use client"
export default function RootLayout({ children }) {
    return (
        <div>
            <style jsx global>{`
                /* Override AWS Amplify styles to preserve Tailwind classes */
                .text-xl {
                    font-size: 1.25rem !important;
                    line-height: 1.75rem !important;
                }
                .text-2xl {
                    font-size: 1.5rem !important;
                    line-height: 2rem !important;
                }
                .text-base {
                    font-size: 1rem !important;
                    line-height: 1.5rem !important;
                }
                .font-bold {
                    font-weight: 700 !important;
                }
                .font-medium {
                    font-weight: 500 !important;
                }

                /* Toast animations */
                @keyframes slideInFromTop {
                    0% {
                        transform: translateX(-50%) translateY(-100%);
                        opacity: 0;
                    }
                    100% {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes shrinkProgress {
                    0% {
                        width: 100%;
                    }
                    100% {
                        width: 0%;
                    }
                }
            `}</style>
            {children}
        </div>
    );
}