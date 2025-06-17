export default function SensorDataPage({ params }) {
    const { sensor_id } = params;

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6">Sensor Data</h1>
            <p className="text-lg mb-4">You are viewing details for sensor: {sensor_id}</p>
            {/* Additional sensor details can be added here */}
        </div>
    );
}