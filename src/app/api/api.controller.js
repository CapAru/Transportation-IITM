export async function postHello(req) {
    const body = await req.json();
    return ({
        message: `Hello ${body.name}`,
    });
}
