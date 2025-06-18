import Link from "next/link";

export default function SensorList({ sensors, name }) {
    return (
        <div className="py-4 px-6 h-[calc(100vh-250px)] overflow-y-auto border border-gray-300 rounded-lg">
            <ul> 
                {sensors.map((sensor) => (
                    <li key={sensor.id} className="my-2">
                        <Link
                            href={`/content/${name}/${sensor.id}`}
                            className="text-blue-600 hover:underline"
                        >
                            {sensor.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}