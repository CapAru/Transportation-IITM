"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdChevronRight } from "react-icons/md";
import sensors from "@/data/wifiMapCoordinates";

export default function ContentBreadcrumb() {
    const path = usePathname();
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        const parts = path.split("/").filter((part) => part);
        setMenu(parts);
    }, [path]);

    const capitalizeFirst = (str) => {
        if (str.length === 0) return str;
        if (str.charAt(0) === str.charAt(0).toUpperCase()) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const getDisplayText = (dir) => {
        if (/^\d/.test(dir)) {
            const sensor = sensors.find(
                (s) => s.id === dir || s.id.includes(dir)
            );
            return sensor ? sensor.name : capitalizeFirst(dir);
        }
        return capitalizeFirst(dir);
    };

    const breadcrumbs = [];
    let currentPath = "";

    // Add Home link
    breadcrumbs.push(
        <li key="home">
            <Link href="/contents" className="hover:text-blue-600">
                Contents
            </Link>
        </li>
    );

    // Add separators and links for each path segment
    menu.forEach((dir, index) => {
        currentPath += `/${dir}`;

        if (dir === "contents") {
            return;
        }
        breadcrumbs.push(
            <li key={`separator-${index}`}>
                <MdChevronRight className="text-gray-400 mx-1" />
            </li>
        );

        if (index === menu.length - 1) {
            // Last item (current page) - no link
            breadcrumbs.push(
                <li
                    key={dir}
                    className="text-gray-800 font-medium"
                    aria-current="page"
                >
                    {getDisplayText(dir)}
                </li>
            );
        } else {
            // Intermediate items - with links
            breadcrumbs.push(
                <li key={dir}>
                    <Link href={currentPath} className="hover:text-blue-600">
                        {getDisplayText(dir)}
                    </Link>
                </li>
            );
        }
    });

    return (
        <nav className="py-4 px-6" aria-label="breadcrumb">
            <ul className="flex items-center text-lg text-gray-600">
                {breadcrumbs}
            </ul>
        </nav>
    );
}
