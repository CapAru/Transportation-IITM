export async function postHello(req) {
    const body = await req.json();
    return ({
        message: `Hello ${body.name}`,
    });
}

export async function createUser(req) {
    const body = await req.json();
    // Here you would typically hash the password and save the user to a database
    // For demonstration, we are just returning the user data
    return {
        message: `User ${body.name} created successfully`,
        user: {
            name: body.name,
            email: body.email,
            college: body.college,
        },
    };
}
