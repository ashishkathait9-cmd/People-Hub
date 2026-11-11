export function filterUsers(users, searchText) {
    const search = searchText.toLowerCase().trim();

    return users.filter(user =>
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.address?.city?.toLowerCase().includes(search)
    );
}

export function sortUserList(users, order = "asc") {
    return [...users].sort((a, b) => {
        return order === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });
}

export function paginateUsers(users, currentPage, usersPerPage) {
    const startIndex = (currentPage - 1) * usersPerPage;

    return users.slice(startIndex, startIndex + usersPerPage);
}