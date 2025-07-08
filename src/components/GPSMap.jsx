"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MdLocationPin } from "react-icons/md";
import ReactDOMServer from "react-dom/server";

// Dynamic import for routing machine to avoid SSR issues
let LRM = null;
if (typeof window !== "undefined") {
    require("leaflet-routing-machine");
    LRM = L.Routing;
}

const GPSMap = ({ mapData }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const routingControlRef = useRef(null);
    const markersRef = useRef([]); // Track all markers

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
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Separate useEffect to handle mapData changes
    useEffect(() => {
        console.log("Data received:", mapData);

        if (mapData && mapData.length > 0 && mapInstanceRef.current && LRM) {
            // Clear existing routing control if any
            if (routingControlRef.current) {
                mapInstanceRef.current.removeControl(routingControlRef.current);
            }

            // Clear existing markers
            markersRef.current.forEach((marker) => {
                mapInstanceRef.current.removeLayer(marker);
            });
            markersRef.current = [];

            // Create array of coordinates for the path with better filtering
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
                });

            console.log("Filtered coordinates:", pathCoordinates);

            if (pathCoordinates.length > 1) {
                // Sample waypoints for routing (to avoid too many API calls)
                const waypoints = [];

                // Always include start point
                waypoints.push(
                    L.latLng(pathCoordinates[0][0], pathCoordinates[0][1])
                );

                // Add intermediate waypoints (sample every 10th point or based on distance)
                const step = Math.max(
                    1,
                    Math.floor(pathCoordinates.length / 10)
                );
                for (let i = step; i < pathCoordinates.length - 1; i += step) {
                    waypoints.push(
                        L.latLng(pathCoordinates[i][0], pathCoordinates[i][1])
                    );
                }

                // Always include end point
                waypoints.push(
                    L.latLng(
                        pathCoordinates[pathCoordinates.length - 1][0],
                        pathCoordinates[pathCoordinates.length - 1][1]
                    )
                );

                // Create routing control
                const routingControl = LRM.control({
                    waypoints: waypoints,
                    routeWhileDragging: false,
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                    showAlternatives: false,
                    show: false,
                    createMarker: function () {
                        return null;
                    }, // Hide all default markers
                    lineOptions: {
                        styles: [
                            {
                                color: "blue",
                                weight: 6,
                                opacity: 0.8,
                            },
                        ],
                    },
                    router: LRM.osrmv1({
                        serviceUrl: "https://router.project-osrm.org/route/v1",
                    }),
                }).addTo(mapInstanceRef.current);

                routingControlRef.current = routingControl;

                // Hide the routing control container
                const routingContainer = document.querySelector(
                    ".leaflet-routing-container"
                );
                if (routingContainer) {
                    routingContainer.style.display = "none";
                }

                // Add custom start and end markers after routing
                routingControl.on("routesfound", function (e) {
                    const routes = e.routes;
                    console.log("Route found:", routes[0]);

                    // Add custom markers for start and end points
                    const startCoord = pathCoordinates[0];
                    const endCoord =
                        pathCoordinates[pathCoordinates.length - 1];

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

                    // You can add additional logic here, like displaying route info
                    const route = routes[0];
                    console.log(
                        `Distance: ${(
                            route.summary.totalDistance / 1000
                        ).toFixed(2)} km`
                    );
                    console.log(
                        `Duration: ${Math.round(
                            route.summary.totalTime / 60
                        )} minutes`
                    );
                });

                routingControl.on("routingerror", function (e) {
                    console.error("Routing error:", e.error);
                    // Fallback to simple polyline if routing fails
                    const polyline = L.polyline(pathCoordinates, {
                        color: "red",
                        weight: 4,
                        opacity: 0.8,
                        dashArray: "5, 5",
                    }).addTo(mapInstanceRef.current);

                    // Add simple markers as fallback
                    const startCoord = pathCoordinates[0];
                    const endCoord =
                        pathCoordinates[pathCoordinates.length - 1];

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
                            `Start Point (Fallback)<br>Lat: ${startCoord[0]}<br>Lng: ${startCoord[1]}`
                        );

                    const endMarker = L.marker(endCoord, { icon: endIcon })
                        .addTo(mapInstanceRef.current)
                        .bindPopup(
                            `End Point (Fallback)<br>Lat: ${endCoord[0]}<br>Lng: ${endCoord[1]}`
                        );

                    markersRef.current.push(startMarker, endMarker);
                });
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
