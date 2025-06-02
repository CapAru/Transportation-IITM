import { BounceLoading } from "respinner";

export default function LoaderComponent() {
    return (
        <div className="flex items-center justify-center h-screen">
            <BounceLoading
                size={100}
                color="#3b82f6"
                speed={1.5}
                className="animate-bounce"
            />
        </div>
    );
}