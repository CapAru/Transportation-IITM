"use client"

import ContentBreadcrumb from "@/components/contentBreadcrumb";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ContentLayout({ children }) {
    const path = usePathname();
    return (
        <div>
            {path != "/contents" && <ContentBreadcrumb />}
            {children}
        </div>
    );
}
