import SensorMap from "@/components/SensorMap";
import SensorList from "@/components/SensorList";
import rsuSensors from "@/data/rsuMapCoordinates";
export default function RSUPage() {

    return (
        <div className="px-6">
            <h1 className="text-2xl font-bold mb-6">
                Road-side Unit (RSU) Data
            </h1>
            <div className="flex justify-evenly">
                <SensorMap sensors={rsuSensors} name="RSU" />
                <SensorList sensors={rsuSensors} name="RSU" />
            </div>
        </div>
    );
}