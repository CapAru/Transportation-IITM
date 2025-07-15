"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdLocationPin } from "react-icons/md";
import { TbArrowBadgeUpFilled } from "react-icons/tb";
import { HiMiniSignal } from "react-icons/hi2";
import ReactDOMServer from "react-dom/server";
import rsuMap from "@/data/rsuMapCoordinates";

// Add custom CSS for direction arrows
const arrowStyles = `
    .direction-arrow {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }
    .direction-arrow div {
        margin: 0 !important;
        padding: 0 !important;
    }
`;

// Inject styles into document head
if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = arrowStyles;
    document.head.appendChild(styleSheet);
}

const OBUMap = ({ mapData, showDirections = true }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const rsuMarkersRef = useRef([]); // Track RSU markers separately
    const routeMarkersRef = useRef([]); // Track route markers (start/end)
    const routeLayersRef = useRef([]); // Track route polylines
    const legendRef = useRef(null); // Track speed legend
    const arrowMarkersRef = useRef([]); // Track direction arrows separately

    useEffect(() => {
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

            // Add RSU markers to the map
            rsuMap.forEach((rsu) => {
                const rsuIcon = L.divIcon({
                    html: ReactDOMServer.renderToString(
                        <HiMiniSignal className="bg-violet-800 text-2xl text-white rounded-full p-1 border-2 border-white" />
                    ),
                    className: "rsu-marker",
                });

                const rsuMarker = L.marker([rsu.lat, rsu.long], {
                    icon: rsuIcon,
                }).addTo(mapInstanceRef.current);

                rsuMarker.bindPopup(
                    `<strong>RSU ${rsu.id}</strong><br>${rsu.name}<br>Lat: ${rsu.lat}<br>Lng: ${rsu.long}`
                );

                // Track RSU markers separately for permanent display
                rsuMarkersRef.current.push(rsuMarker);
            });
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                // Clear all layers before removing the map
                rsuMarkersRef.current.forEach((marker) => {
                    mapInstanceRef.current.removeLayer(marker);
                });
                routeMarkersRef.current.forEach((marker) => {
                    mapInstanceRef.current.removeLayer(marker);
                });
                routeLayersRef.current.forEach((layer) => {
                    mapInstanceRef.current.removeLayer(layer);
                });
                rsuMarkersRef.current = [];
                routeMarkersRef.current = [];
                routeLayersRef.current = [];
                arrowMarkersRef.current = [];

                // Remove existing legend if it exists
                if (legendRef.current) {
                    mapInstanceRef.current.removeControl(legendRef.current);
                    legendRef.current = null;
                }

                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Separate useEffect to handle mapData changes
    useEffect(() => {
        console.log("Data received:", mapData);

        if (mapData && mapData.length > 0 && mapInstanceRef.current) {
            // Clear existing route markers (but keep RSU markers)
            routeMarkersRef.current.forEach((marker) => {
                mapInstanceRef.current.removeLayer(marker);
            });
            routeMarkersRef.current = [];

            // Clear existing route polylines
            routeLayersRef.current.forEach((layer) => {
                mapInstanceRef.current.removeLayer(layer);
            });
            routeLayersRef.current = [];

            // Clear existing arrow markers
            arrowMarkersRef.current.forEach((marker) => {
                mapInstanceRef.current.removeLayer(marker);
            });
            arrowMarkersRef.current = [];

            // Remove existing legend if it exists
            if (legendRef.current) {
                mapInstanceRef.current.removeControl(legendRef.current);
                legendRef.current = null;
            }

            // Haversine distance calculation function
            const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
                const R = 6371; // Earth's radius in kilometers
                const dLat = ((lat2 - lat1) * Math.PI) / 180;
                const dLon = ((lon2 - lon1) * Math.PI) / 180;
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos((lat1 * Math.PI) / 180) *
                        Math.cos((lat2 * Math.PI) / 180) *
                        Math.sin(dLon / 2) *
                        Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c; // Distance in kilometers
            };

            // Create array of coordinates for the path
            const pathCoordinates = mapData
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
                })
                // Filter out points that are more than 2km apart from previous point
                .filter((coord, index, arr) => {
                    if (index === 0) return true;
                    const prev = arr[index - 1];
                    const distance = calculateHaversineDistance(
                        prev[0],
                        prev[1],
                        coord[0],
                        coord[1]
                    );
                    if (distance > 2) {
                        console.log(
                            `Filtered out point at distance: ${distance.toFixed(
                                2
                            )} km`
                        );
                        return false;
                    }
                    return true;
                });

            console.log(
                "Plotting raw OBU coordinates (after filtering):",
                pathCoordinates.length
            );

            if (pathCoordinates.length > 1) {
                // Create a simple green polyline for the entire route
                const routePolyline = L.polyline(
                    pathCoordinates.map((coord) => [coord[0], coord[1]]),
                    {
                        color: "#00AA00", // Simple green color
                        weight: 4,
                        opacity: 0.8,
                    }
                ).addTo(mapInstanceRef.current);

                // Track the polyline for cleanup
                routeLayersRef.current.push(routePolyline);

                // Create direction arrows for every 5th segment to avoid clutter
                for (let i = 0; i < pathCoordinates.length - 1; i += 5) {
                    if (showDirections) {
                        const currentPoint = pathCoordinates[i];
                        const nextPoint = pathCoordinates[i + 1];

                        // Calculate midpoint of the segment
                        const midLat = (currentPoint[0] + nextPoint[0]) / 2;
                        const midLng = (currentPoint[1] + nextPoint[1]) / 2;

                        // Calculate bearing (direction) from current to next point
                        const lat1 = (currentPoint[0] * Math.PI) / 180;
                        const lat2 = (nextPoint[0] * Math.PI) / 180;
                        const deltaLng =
                            ((nextPoint[1] - currentPoint[1]) * Math.PI) / 180;

                        const y = Math.sin(deltaLng) * Math.cos(lat2);
                        const x =
                            Math.cos(lat1) * Math.sin(lat2) -
                            Math.sin(lat1) *
                                Math.cos(lat2) *
                                Math.cos(deltaLng);
                        let bearing = (Math.atan2(y, x) * 180) / Math.PI;

                        // Normalize bearing to 0-360 degrees
                        bearing = (bearing + 360) % 360;

                        // Create arrow marker with proper centering
                        const arrowIcon = L.divIcon({
                            html: ReactDOMServer.renderToString(
                                <div
                                    style={{
                                        transform: `rotate(${bearing}deg)`,
                                        color: "blue",
                                        fontSize: "14px",
                                        textShadow:
                                            "1px 1px 2px rgba(0,0,0,0.5)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        height: "100%",
                                        lineHeight: 1,
                                    }}
                                >
                                    <TbArrowBadgeUpFilled />
                                </div>
                            ),
                            className: "direction-arrow",
                            iconSize: [14, 14],
                            iconAnchor: [7, 7], // Center the icon
                        });

                        const arrowMarker = L.marker([midLat, midLng], {
                            icon: arrowIcon,
                            interactive: false, // Make arrow non-interactive
                        }).addTo(mapInstanceRef.current);

                        // Track the arrow marker separately for show/hide functionality
                        arrowMarkersRef.current.push(arrowMarker);
                    }
                }

                // Fit map to the route bounds
                const bounds = L.latLngBounds(
                    pathCoordinates.map((coord) => [coord[0], coord[1]])
                );
                mapInstanceRef.current.fitBounds(bounds);

                // Add start and end markers
                const startCoord = pathCoordinates[0];
                const endCoord = pathCoordinates[pathCoordinates.length - 1];

                const startIcon = L.divIcon({
                    html: ReactDOMServer.renderToString(
                        <MdLocationPin className="text-green-600 bg-transparent text-4xl" />
                    ),
                    className: "start-marker",
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                });

                const endIcon = L.divIcon({
                    html: ReactDOMServer.renderToString(
                        <MdLocationPin className="text-red-600 bg-transparent text-4xl" />
                    ),
                    className: "end-marker",
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                });

                const startMarker = L.marker(startCoord, {
                    icon: startIcon,
                })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(
                        `Start Point<br>Lat: ${startCoord[0]}<br>Lng: ${startCoord[1]}`
                    );

                const endMarker = L.marker(endCoord, { icon: endIcon })
                    .addTo(mapInstanceRef.current)
                    .bindPopup(
                        `End Point<br>Lat: ${endCoord[0]}<br>Lng: ${endCoord[1]}`
                    );

                routeMarkersRef.current.push(startMarker, endMarker);

                console.log(
                    `Raw OBU route visualization complete. Points: ${pathCoordinates.length}`
                );
            } else {
                console.warn("Not enough valid coordinates to create a route");
            }
        }
    }, [mapData]);

    // Separate useEffect to handle direction arrows visibility
    useEffect(() => {
        if (mapInstanceRef.current && arrowMarkersRef.current.length > 0) {
            arrowMarkersRef.current.forEach((marker) => {
                try {
                    // Always try to remove first to ensure clean state
                    mapInstanceRef.current.removeLayer(marker);
                } catch (e) {
                    // Ignore errors if marker wasn't on map
                }

                // Add back if showDirections is true
                if (showDirections) {
                    try {
                        mapInstanceRef.current.addLayer(marker);
                    } catch (e) {
                        console.warn("Failed to add arrow marker:", e);
                    }
                }
            });
        }
    }, [showDirections]);

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

export default OBUMap;
