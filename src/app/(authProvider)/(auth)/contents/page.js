"use client";

import Link from "next/link";

export default function Contents() {
    const data = [
        {
            index: 1,
            fullName: "Global Positioning System",
            shortName: "GPS",
            description:
                "A satellite-based navigation system that provides location and time information anywhere on Earth.",
        },
        {
            index: 2,
            fullName: "Wireless Fidelity",
            shortName: "Wi-Fi",
            description:
                "A technology that allows electronic devices to connect to a wireless local area network (WLAN), typically using radio waves.",
        },
        {
            index: 3,
            fullName: "Road-side Unit",
            shortName: "RSU",
            description:
                "A fixed communication device installed along roadsides to facilitate communication between vehicles and infrastructure.",
        },
        {
            index: 4,
            fullName: "On-Board Unit",
            shortName: "OBU",
            description:
                "A communication device installed in vehicles to enable interaction with roadside units and other vehicles.",
        },
    ];

    const buttonElements = data.map((item, index) => (
        <Link
            key={index}
            href={`/contents/${item.shortName}`}
            className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full border border-blue-400/20"
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2 group-hover:scale-105 transition-transform duration-200">
                    {item.shortName}
                </h2>
                <p className="text-lg text-blue-100 mb-3 font-medium">
                    {item.fullName}
                </p>
                <p className="text-sm text-blue-50 leading-relaxed opacity-90">
                    {item.description}
                </p>
                <div className="mt-4 inline-flex items-center text-blue-100 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">View Datasets</span>
                    <svg
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </Link>
    ));

    return (
        <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Available Data
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
                    {buttonElements}
                </div>
            </div>
        </div>
    );
}
