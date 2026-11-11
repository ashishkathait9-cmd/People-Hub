const API_URL = "https://jsonplaceholder.typicode.com/users";

// GET - Fetch all users
export async function fetchUsers() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return await response.json();
}

// POST - Create user
export async function createUser(userData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error("Failed to create user");
    }

    return await response.json();
}

// PATCH - Update user
export async function updateUser(id, userData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return await response.json();
}

// DELETE - Delete user
export async function removeUser(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    return true;
}