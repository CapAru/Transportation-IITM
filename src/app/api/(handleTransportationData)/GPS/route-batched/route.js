export async function POST(req) {
    const body = await req.json();
    const coords = body.coordinates || [];

    // Simply return the coordinates as-is without any processing
    return Response.json({
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: coords,
        },
    });
}
