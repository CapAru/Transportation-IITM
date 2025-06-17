import Link from "next/link";
import { MdChevronRight } from "react-icons/md";
import ContentBreadcrumb from "@/components/ContentBreadcrumb";

export default function ContentLayout({ children }) {
    return (
        <div>
            <ContentBreadcrumb />
            {children}
        </div>
    );
}
