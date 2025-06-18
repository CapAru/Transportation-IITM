"use client";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { FaWifi } from "react-icons/fa6";
import { HiMiniSignal } from "react-icons/hi2";
import ReactDOMServer from "react-dom/server";

const SensorMap = ({ sensors, name }) => {
    const router = useRouter();
    useEffect(() => {
        const mapContainer = document.getElementById("map");
        console.log("Map container:", mapContainer);
        if (!mapContainer) return;

        const map = L.map(mapContainer, { attributionControl: false }); // Disable default attribution control

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "", // Remove default attribution
        }).addTo(map);
        // Add custom attribution for OpenStreetMap contributors
        L.control
            .attribution({
                prefix: false, // Remove Leaflet prefix
            })
            .addAttribution("© OpenStreetMap contributors")
            .addTo(map);

        const bounds = []; // Array to store all marker locations
        const sensorIcon =
            name === "Wi-Fi" ? (
                <FaWifi className="bg-blue-800 text-2xl text-white rounded-full p-1 border-2 border-white" />
            ) : (
                <HiMiniSignal className="bg-violet-800 text-2xl text-white rounded-full p-1 border-2 border-white" />
            ); // Choose icon based on name
        sensors.forEach((sensor) => {
            const customIcon = L.divIcon({
                html: ReactDOMServer.renderToString(sensorIcon),
                className: "custom-marker",
            });

            const marker = L.marker([sensor.lat, sensor.long], {
                icon: customIcon,
            }).addTo(map);

            bounds.push([sensor.lat, sensor.long]); // Add marker location to bounds

            marker.bindPopup(`Sensor: ${sensor.name}`, {
                closeButton: false,
            });
            marker.on("mouseover", () => marker.openPopup());
            marker.on("mouseout", () => marker.closePopup());
            marker.on("click", () =>
                router.push(`/contents/${name}/${sensor.id}`)
            );
        });
        // Automatically fit the map to show all markers
        if (bounds.length > 0) {
            map.fitBounds(bounds);
        }
        return () => {
            map.remove();
        };
    }, [sensors, name, router]);

    return (
        <div id="map" style={{ height: `calc(100vh-250px)`, width: "800px" }} />
    );
};

export default SensorMap;
