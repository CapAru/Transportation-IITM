"use client";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { FaWifi } from "react-icons/fa6"; // Import React Icon
import ReactDOMServer from "react-dom/server"; // Import ReactDOMServer

const WifiMap = ({ sensors }) => {
    const router = useRouter();

    useEffect(() => {
        const mapContainer = document.getElementById("map");
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

        sensors.forEach((sensor) => {
            const customIcon = L.divIcon({
                html: ReactDOMServer.renderToString(
                    <FaWifi className="bg-blue-800 text-2xl text-white rounded-full p-1 border-2 border-white" />
                ),
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
            marker.on("click", () => router.push(`/content/Wi-Fi/${sensor.id}`));
        });

        // Automatically fit the map to show all markers
        if (bounds.length > 0) {
            map.fitBounds(bounds);
        }

        return () => {
            map.remove();
        };
    }, [sensors, router]);

    return (
        <div id="map" style={{ height: `calc(100vh-250px)`, width: "800px" }} />
    );
};

export default WifiMap;
