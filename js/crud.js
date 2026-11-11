
import {
    createUser,
    updateUser,
    removeUser
} from "./api.js";

export async function addUser(userData) {
    return await createUser(userData);
}

export async function editUserData(id, userData) {
    return await updateUser(id, userData);
}

export async function deleteUserData(id) {
    return await removeUser(id);
}