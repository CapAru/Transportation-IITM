"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdLocationPin } from "react-icons/md";
import { TbArrowBadgeUpFilled } from "react-icons/tb";
import ReactDOMServer from "react-dom/server";

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

const GPSMap = ({ mapData }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]); // Track all markers
    const routeLayersRef = useRef([]); // Track route polylines
    const legendRef = useRef(null); // Track speed legend

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
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                // Clear all layers before removing the map
                markersRef.current.forEach((marker) => {
                    mapInstanceRef.current.removeLayer(marker);
                });
                routeLayersRef.current.forEach((layer) => {
                    mapInstanceRef.current.removeLayer(layer);
                });
                markersRef.current = [];
                routeLayersRef.current = [];

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
            // Clear existing markers
            markersRef.current.forEach((marker) => {
                mapInstanceRef.current.removeLayer(marker);
            });
            markersRef.current = [];

            // Clear existing route polylines
            routeLayersRef.current.forEach((layer) => {
                mapInstanceRef.current.removeLayer(layer);
            });
            routeLayersRef.current = [];

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
                    parseFloat(point.speed) || 0, // Include speed data
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
                "Plotting raw GPS coordinates with speed (after filtering):",
                pathCoordinates.length
            );

            if (pathCoordinates.length > 1) {
                // Calculate speed range for gradient
                const speeds = pathCoordinates.map((coord) => coord[2]);
                const minSpeed = Math.min(...speeds);
                const maxSpeed = Math.max(...speeds);

                console.log(
                    `Speed range: ${minSpeed.toFixed(2)} - ${maxSpeed.toFixed(
                        2
                    )}`
                );

                // Function to get color based on speed (Red = slow, Yellow = medium, Green = fast)
                const getSpeedColor = (speed) => {
                    if (maxSpeed === minSpeed) return "#ffff00"; // All same speed, use yellow

                    // Normalize speed from 0 (slowest) to 1 (fastest)
                    const normalized =
                        (speed - minSpeed) / (maxSpeed - minSpeed);

                    if (normalized <= 0.5) {
                        // Red to Yellow (0 to 0.5) - slow to medium speeds
                        const r = 255;
                        const g = Math.round(255 * (normalized * 2));
                        const b = 0;
                        return `rgb(${r}, ${g}, ${b})`;
                    } else {
                        // Yellow to Green (0.5 to 1) - medium to fast speeds
                        const r = Math.round(255 * (2 - normalized * 2));
                        const g = 255;
                        const b = 0;
                        return `rgb(${r}, ${g}, ${b})`;
                    }
                };

                // Create colored segments for speed visualization with direction arrows
                for (let i = 0; i < pathCoordinates.length - 1; i++) {
                    const currentPoint = pathCoordinates[i];
                    const nextPoint = pathCoordinates[i + 1];

                    // Use average speed of the two points for the segment
                    const segmentSpeed = (currentPoint[2] + nextPoint[2]) / 2;
                    const segmentColor = getSpeedColor(segmentSpeed);

                    // Create a small polyline segment
                    const segment = L.polyline(
                        [
                            [currentPoint[0], currentPoint[1]],
                            [nextPoint[0], nextPoint[1]],
                        ],
                        {
                            color: segmentColor,
                            weight: 5,
                            opacity: 0.9,
                        }
                    ).addTo(mapInstanceRef.current);

                    // Add direction arrow for every 5th segment to avoid clutter
                    if (i % 5 === 0) {
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

                        // Track the arrow marker for cleanup
                        markersRef.current.push(arrowMarker);
                    }

                    // Add popup with speed info on hover
                    segment.bindTooltip(
                        `Speed: ${segmentSpeed.toFixed(2)} km/h<br>` +
                            `Range: ${minSpeed.toFixed(2)} - ${maxSpeed.toFixed(
                                2
                            )} km/h`,
                        {
                            sticky: true,
                            direction: "top",
                        }
                    );

                    // Track the segment for cleanup
                    routeLayersRef.current.push(segment);
                }

                // Add speed legend
                const legend = L.control({ position: "bottomright" });
                legend.onAdd = function (map) {
                    const div = L.DomUtil.create("div", "speed-legend");
                    div.innerHTML = `
                        <div style="background: white; padding: 10px; border-radius: 5px; border: 2px solid #ccc; font-size: 12px;">
                            <h4 style="margin: 0 0 5px 0;">Speed Legend</h4>
                            <div style="display: flex; align-items: center; margin: 2px 0;">
                                <div style="width: 20px; height: 3px; background: #ff0000; margin-right: 5px;"></div>
                                <span>Slow (${minSpeed.toFixed(1)} km/h)</span>
                            </div>
                            <div style="display: flex; align-items: center; margin: 2px 0;">
                                <div style="width: 20px; height: 3px; background: #ffff00; margin-right: 5px;"></div>
                                <span>Medium</span>
                            </div>
                            <div style="display: flex; align-items: center; margin: 2px 0;">
                                <div style="width: 20px; height: 3px; background: #00ff00; margin-right: 5px;"></div>
                                <span>Fast (${maxSpeed.toFixed(1)} km/h)</span>
                            </div>
                        </div>
                    `;
                    return div;
                };
                legend.addTo(mapInstanceRef.current);
                legendRef.current = legend;

                // Fit map to the route bounds using first and last coordinates
                const boundsCoords = pathCoordinates.map((coord) => [
                    coord[0],
                    coord[1],
                ]);
                const bounds = L.latLngBounds(boundsCoords);
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

                markersRef.current.push(startMarker, endMarker);

                console.log(
                    `Raw GPS route visualization complete. Points: ${pathCoordinates.length}`
                );
            } else {
                console.warn("Not enough valid coordinates to create a route");
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
