export function showToast(message, type = "success") {
    const toast = document.querySelector("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}


export function displayUser(users, selectedUsers = []) {
    const container = document.querySelector("#container");

    if (!container) return;

    container.replaceChildren();

    if (!users || users.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No users found.";
        container.append(emptyMessage);
        return;
    }

    users.forEach(user => {
        const card = document.createElement("div");
        card.classList.add("usercard");

        const heading = document.createElement("h3");
        heading.textContent = user.name || "Unknown";

        const email = document.createElement("p");
        email.textContent = user.email || "No email";

        const city = document.createElement("p");
        city.textContent = user.address?.city || "City not available";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = selectedUsers.includes(user.id);
        checkbox.dataset.userId = user.id;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.dataset.action = "edit";
        editButton.dataset.userId = user.id;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.userId = user.id;

        card.append(
            checkbox,
            heading,
            email,
            city,
            editButton,
            deleteButton
        );

        container.append(card);
    });
}