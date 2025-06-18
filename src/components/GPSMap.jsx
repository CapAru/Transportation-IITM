"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdLocationPin } from "react-icons/md";
import ReactDOMServer from "react-dom/server";

const GPSMap = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [mapData, setMapData] = React.useState([]);
    const pathLayerRef = useRef(null);

    useEffect(() => {
        // Initialize map only once
        async function initializeMap() {
            try {
                const data = await fetch("/api/GPS", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!data.ok) {
                    console.error("Failed to fetch GPS data");
                    return;
                }
                const fetchedData = await data.json();
                setMapData(fetchedData);
            } catch (error) {
                console.error("Error fetching GPS data:", error);
            }
        }
        initializeMap();

        if (!mapInstanceRef.current) {
            // Initialize the map
            mapInstanceRef.current = L.map(mapRef.current).setView(
                [13.0827, 80.2707],
                11
            );

            // Add OpenStreetMap tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 20,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapInstanceRef.current);
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Separate useEffect to handle mapData changes
    useEffect(() => {
        console.log("Data fetched:", mapData);

        if (mapData.length > 0 && mapInstanceRef.current) {
            // Clear existing path if any
            if (pathLayerRef.current) {
                mapInstanceRef.current.removeLayer(pathLayerRef.current);
            }

            // Sort data by timestamp if available, otherwise use array order
            // const sortedData = [...mapData].sort((a, b) => {
            //     if (a.time && b.time) {
            //         return new Date(a.time) - new Date(b.time);
            //     }
            //     return 0; // Keep original order if no timestamp
            // });

            // Create array of coordinates for the path with better filtering
            const pathCoordinates = mapData
                .filter((point) => {
                    // More robust coordinate validation
                    const lat = parseFloat(point.latitude);
                    const lng = parseFloat(point.longitude);
                    return (
                        !isNaN(lat) &&
                        !isNaN(lng) &&
                        lat >= 10 &&
                        lat <= 15 && // Filter for latitudes between 10 and 15
                        lng >= 75 &&
                        lng <= 85
                    );
                })
                .map((point) => [
                    parseFloat(point.latitude),
                    parseFloat(point.longitude),
                ])
                // Remove duplicate consecutive coordinates
                .filter((coord, index, arr) => {
                    if (index === 0) return true;
                    const prev = arr[index - 1];
                    return (
                        Math.abs(coord[0] - prev[0]) > 0 ||
                        Math.abs(coord[1] - prev[1]) > 0
                    );
                });

            console.log("Filtered coordinates:", pathCoordinates);

            if (pathCoordinates.length > 1) {
                // Create polyline to trace the path
                const polyline = L.polyline(pathCoordinates, {
                    color: "blue",
                    weight: 4,
                    opacity: 0.8,
                    smoothFactor: 1,
                }).addTo(mapInstanceRef.current);

                pathLayerRef.current = polyline;

                // Add start and end markers only
                const startCoord = pathCoordinates[0];
                const endCoord = pathCoordinates[pathCoordinates.length - 1];

                // Start marker (green)
                const startIcon = L.divIcon({
                    html: ReactDOMServer.renderToString(
                        <MdLocationPin className="text-green-600 bg-transparent text-4xl" />
                    ),
                    className: "start-marker",
                    iconSize: [32, 32],
                    iconAnchor: [16, 32], // Bottom center of the icon
                    popupAnchor: [0, -32], // Popup appears above the marker
                });

                // End marker (red)
                const endIcon = L.divIcon({
                    html: ReactDOMServer.renderToString(
                        <MdLocationPin className="text-red-600 bg-transparent text-4xl" />
                    ),
                    className: "end-marker",
                    iconSize: [32, 32],
                    iconAnchor: [16, 32], // Bottom center of the icon
                    popupAnchor: [0, -32], // Popup appears above the marker
                });

                L.marker(startCoord, { icon: startIcon })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(
                        `Start Point<br>Lat: ${startCoord[0]}<br>Lng: ${startCoord[1]}`
                    );

                L.marker(endCoord, { icon: endIcon })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(
                        `End Point<br>Lat: ${endCoord[0]}<br>Lng: ${endCoord[1]}`
                    );

                // Fit map bounds to show the entire path
                mapInstanceRef.current.fitBounds(polyline.getBounds(), {
                    padding: [20, 20],
                });
            } else {
                console.warn("Not enough valid coordinates to create a path");
            }
        }
    }, [mapData]);

    return (
        <div
            ref={mapRef}
            style={{
                height: `calc(100vh - 250px)`,
                width: "800px",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
        />
    );
};

export default GPSMap;
