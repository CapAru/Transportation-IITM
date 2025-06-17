import WifiList from "@/components/WifiList";
import WifiMap from "@/components/WifiMap";
import sensors from "@/data/wifiMapCoordinates"; // Adjust the path as necessary

export default function WiFiPage() {
    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6">Wireless Fidelity (Wi-Fi) Data</h1>
            <div className="flex justify-evenly">
                <WifiMap sensors={sensors} />
                <WifiList sensors={sensors}/>
            </div>
        </div>
    );
}