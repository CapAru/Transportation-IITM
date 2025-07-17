import Link from "next/link";

export default function SensorList({ sensors, name }) {
    return (
        <div className="py-4 px-4 md:px-6 h-[400px] md:h-[500px] lg:h-[calc(100vh-250px)] w-full lg:w-auto overflow-y-auto border border-gray-300 rounded-lg">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">
                {name} Sensors
            </h3>
            <ul className="space-y-1 md:space-y-2">
                {sensors.map((sensor) => (
                    <li key={sensor.id} className="my-1 md:my-2">
                        <Link
                            href={`/contents/${name}/${sensor.id}`}
                            className="text-blue-600 hover:underline text-sm md:text-base hover:text-blue-800 transition-colors block py-1"
                        >
                            {sensor.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
