"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";

const WifiMap = ({ sensors }) => {
    const router = useRouter();

    useEffect(() => {
        // Avoid initializing multiple times
        const existingMap = document.getElementById("map");
        if (!existingMap) return;

        const map = L.map("map").setView([12.9716, 77.5946], 13); // Change to your city center

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "Map data © OpenStreetMap contributors",
        }).addTo(map);

        sensors.forEach((sensor) => {
            const marker = L.marker([sensor.lat, sensor.long]).addTo(map);
            marker.bindPopup(`Sensor: ${sensor.id}`);
            marker.on("click", () => router.push(`/wifi/${sensor.id}`));
        });

        return () => {
            map.remove();
        };
    }, [sensors, router]);

    return <div id="map" style={{ height: "600px", width: "100%" }} />;
};

export default WifiMap;
