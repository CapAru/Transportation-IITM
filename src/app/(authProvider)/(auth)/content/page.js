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
            href={`/content/${item.shortName}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-2xl m-2 w-full md:w-1/3 text-center"
        >
            <h2 className="text-2xl">{item.shortName}</h2>
            <p className="text-base text-gray-300">{item.fullName}</p>
        </Link>
    ));

    return (
        <div>
            <h1>Contents</h1>
            <div className="flex flex-col gap-2 items-center w-full px-5">
                {buttonElements}
            </div>
        </div>
    );
}
