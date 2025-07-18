import SensorList from "@/components/SensorList";
import SensorMap from "@/components/SensorMap";
import sensors from "@/data/wifiMapCoordinates";

export const metadata = {
    title: "Wi-Fi Data",
    description: "Explore Wi-Fi data and sensor locations.",
};

export default function WiFiPage() {
    return (
        <div className="px-3 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                Wireless Fidelity (Wi-Fi) Data
            </h1>
            <div className="flex flex-col xl:flex-row xl:justify-evenly gap-4 xl:gap-6">
                <div className="w-full xl:w-auto">
                    <SensorMap sensors={sensors} name="Wi-Fi" />
                </div>
                <div className="w-full xl:w-auto">
                    <SensorList sensors={sensors} name="Wi-Fi" />
                </div>
            </div>
        </div>
    );
}
