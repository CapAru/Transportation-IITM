import SensorList from "@/components/SensorList";
import SensorMap from "@/components/SensorMap";
import sensors from "@/data/wifiMapCoordinates";

export const metadata = {
    title: "Wi-Fi Data",
    description: "Explore Wi-Fi data and sensor locations.",
};

export default function WiFiPage() {
    return (
        <div className="px-6">
            <h1 className="text-3xl font-bold mb-4">Wireless Fidelity (Wi-Fi) Data</h1>
            <div className="flex justify-evenly">
                <SensorMap sensors={sensors} name="Wi-Fi"/>
                <SensorList sensors={sensors} name="Wi-Fi"/>
            </div>
        </div>
    );
}