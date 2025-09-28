import { NextResponse } from 'next/server';

// In-memory "database"
// NOTE: This will reset every time the server restarts.
// In a real application, you would use a database like PostgreSQL, MongoDB, etc.
let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
];

/**
 * @route   GET /api/users
 * @desc    Get all users
 */
export async function GET() {
    return NextResponse.json(users);
}

/**
 * @route   POST /api/users
 * @desc    Create a new user
 */
export async function POST(request) {
    try {
        const newUser = await request.json();

        // Basic validation
        if (!newUser.name || !newUser.email) {
            return NextResponse.json(
                { message: 'Name and email are required' },
                { status: 400 }
            );
        }

        // Add a unique ID and add to our "database"
        newUser.id = Date.now(); // Simple unique ID
        users.push(newUser);

        return NextResponse.json(
            { message: 'User created successfully', user: newUser },
            { status: 201 } // 201 Created
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error creating user', error: error.message },
            { status: 500 }
        );
    }
}