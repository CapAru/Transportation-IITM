import SensorMap from "@/components/SensorMap";
import SensorList from "@/components/SensorList";
import rsuSensors from "@/data/rsuMapCoordinates";

export const metadata = {
    title: "RSU Data",
    description: "Explore Road-side Unit (RSU) data and sensor locations.",
};

export default function RSUPage() {
    return (
        <div className="px-3 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                Road-side Unit (RSU) Data
            </h1>
            <div className="flex flex-col lg:flex-row lg:justify-evenly gap-4 lg:gap-6">
                <div className="w-full lg:w-auto">
                    <SensorMap sensors={rsuSensors} name="RSU" />
                </div>
                <div className="w-full lg:w-auto">
                    <SensorList sensors={rsuSensors} name="RSU" />
                </div>
            </div>
        </div>
    );
}
