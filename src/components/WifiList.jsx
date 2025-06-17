export default function WifiList({ sensors }) {
    return (
        <div className="py-4 px-6 h-[500px] overflow-y-auto border border-gray-300 rounded-lg">
            <ul> 
                {sensors.map((sensor) => (
                    <li key={sensor.id} className="my-2">
                        <a
                            href={`/content/Wi-Fi/${sensor.id}`}
                            className="text-blue-600 hover:underline"
                        >
                            {sensor.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}