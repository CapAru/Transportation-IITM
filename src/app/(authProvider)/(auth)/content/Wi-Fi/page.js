import SensorList from "@/components/SensorList";
import SensorMap from "@/components/SensorMap";
import sensors from "@/data/wifiMapCoordinates"; // Adjust the path as necessary

export default function WiFiPage() {
    return (
        <div className="px-6">
            <h1 className="text-2xl font-bold mb-4">Wireless Fidelity (Wi-Fi) Data</h1>
            <div className="flex justify-evenly">
                <SensorMap sensors={sensors} name="Wi-Fi"/>
                <SensorList sensors={sensors} name="Wi-Fi"/>
            </div>
        </div>
    );
}