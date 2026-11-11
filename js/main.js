import { fetchUsers } from "./api.js";
import {
    addUser,
    editUserData,
    deleteUserData
} from "./crud.js";
import {
    showToast,
    displayUser
} from "./ui.js";
const inputName = document.querySelector("#name");
const form = document.querySelector("#userform");
const inputEmail = document.querySelector("#email");
const button = document.querySelector("#btn");
const container = document.querySelector("#container");
const message = document.querySelector("#message");
const searchInput = document.querySelector("#searchInput");
const editForm = document.querySelector("#editForm");
const editName = document.querySelector("#editName");
const editEmail = document.querySelector("#editEmail");
const cancelEdit = document.querySelector("#cancelEdit");
const userCount = document.querySelector("#userCount");
const loading = document.querySelector("#loading");
const searchMessage = document.querySelector("#searchMessage");
const sortUsers = document.querySelector("#sortUsers");
const pagination = document.querySelector("#pagination");
const totalUsers = document.querySelector("#totalUsers");
let currentPage = 1;
const usersPerPage = 5;
let editingUserId = null
let userData = [];
const deleteSelected = document.querySelector("#deleteSelected");
const selectedCount = document.querySelector("#selectedCount");
let selectedUsers = [];
const exportCSV = document.querySelector("#exportCSV");
const API_URL = "https://jsonplaceholder.typicode.com/users";
const toast = document.querySelector("#toast");
const statTotalUsers = document.querySelector("#statTotalUsers");
const statFilteredUsers = document.querySelector("#statFilteredUsers");
const statCurrentPage = document.querySelector("#statCurrentPage");
const statSelectedUsers = document.querySelector("#statSelectedUsers");
const themeToggle = document.querySelector("#themeToggle");
function applyTheme(theme) {
    document.documentElement.classList.toggle(
        "dark-mode",
        theme === "dark"
    );

    if (themeToggle) {
        themeToggle.textContent =
            theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
}
let savedTheme = "light";
try {
    savedTheme = localStorage.getItem("theme") || "light";
} catch (error) {
    console.warn("Theme storage unavailable:", error);
}
applyTheme(savedTheme);
themeToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark-mode");
    const newTheme = isDark ? "light" : "dark";
    applyTheme(newTheme);
    try {
        localStorage.setItem("theme", newTheme);
    } catch (error) {
        console.warn("Could not save theme:", error);
    }
});
function updateDashboardStats(filteredCount, pageCount) {
    if (statTotalUsers) {
        statTotalUsers.textContent = userData.length;
    }
    if (statFilteredUsers) {
        statFilteredUsers.textContent = filteredCount;
    }
    if (statCurrentPage) {
        statCurrentPage.textContent = pageCount;
    }
    if (statSelectedUsers) {
        statSelectedUsers.textContent = selectedUsers.length;
    }
}
function saveUsers() {
    try {
        localStorage.setItem("users", JSON.stringify(userData));
    } catch (error) {
        console.warn("Could not save users in LocalStorage");
    }
}
function updateSelectedCount() {
    if (selectedCount) {
        selectedCount.textContent = `${selectedUsers.length} selected`;
    }
    if (statSelectedUsers) {
        statSelectedUsers.textContent = selectedUsers.length;
    }
}
deleteSelected.addEventListener("click", async () => {
  if (selectedUsers.length === 0) {
    message.textContent = "Please select users first!";
    return;
  }
  const confirmDelete = confirm(
    `Delete ${selectedUsers.length} selected users?`
  );
  if (!confirmDelete) return;
  try{
   const responses = await Promise.all(
    selectedUsers.map(id =>
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
    )
);
userData = userData.filter(
    user => !selectedUsers.includes(user.id)
);
saveUsers();
selectedUsers = [];
searchUsers();
updateSelectedCount();
showToast("Selected users deleted successfully!", "success");
if (responses.some(response => !response.ok)) {
    throw new Error("Some users could not be deleted");
}
    saveUsers();
    selectedUsers = [];
    searchUsers();
    updateSelectedCount();
    showToast("Selected users deleted successfully!");
  } catch (error) {
    message.textContent = error.message;
  }
});
async function getUser() {
    try {
        if (loading) {
            loading.textContent = "Loading Users...";
        }
        let savedUsers = null;
        try {
            savedUsers = localStorage.getItem("users");
        } catch (error) {
            console.warn("LocalStorage unavailable:", error);
        }

        if (savedUsers) {
            try {
                const parsedUsers = JSON.parse(savedUsers);

                if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
                    userData = parsedUsers;
                    searchUsers();
                    return;
                }
            } catch (error) {
                console.warn("Invalid saved user data:", error);
            }
        }
        const data = await fetchUsers();
        if (!Array.isArray(data)) {
            throw new Error("Invalid API response");
        }
        userData = data;
        saveUsers();
        searchUsers();
    } catch (error) {
        console.error("User loading error:", error);
        if (message) {
            message.textContent = "Users could not be loaded: " + error.message;
        }
    } finally {
        if (loading) {
            loading.textContent = "";
        }
    }
}
function searchUsers() {
    const searchText = searchInput.value.toLowerCase().trim();
    let filterText = userData.filter(user => {
        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const city = (user.address?.city || "").toLowerCase();
        return (
            name.includes(searchText) ||
            email.includes(searchText) ||
            city.includes(searchText)
        );
    });
    userCount.textContent = `Users found: ${filterText.length}`;
    totalUsers.textContent = userData.length;
    if (sortUsers.value === "az") {
    filterText.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
    );
}
if (sortUsers.value === "za") {
    filterText.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "")
    );
}
    const totalPages = Math.ceil(filterText.length / usersPerPage);
    currentPage = Math.min(
        currentPage,
        Math.max(totalPages, 1)
    );
    const start = (currentPage - 1) * usersPerPage;
    const paginatedUsers = filterText.slice(
        start,
        start + usersPerPage
    );
    displayUser(paginatedUsers, selectedUsers);
    displayPagination(filterText);
    updateDashboardStats(
        filterText.length,
        currentPage
    );
    searchMessage.textContent =
        filterText.length === 0 && searchText !== ""
            ? "No users found!"
            : "";
}
    function displayPagination(users) {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(users.length / usersPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      searchUsers();
    });
    pagination.append(btn);
  }}
searchInput.addEventListener("input", () => {
    currentPage = 1;
    searchUsers();
});
sortUsers.addEventListener("change", () => {
    currentPage = 1;
    searchUsers();
});
form.addEventListener("submit", async(event)=>{
    event.preventDefault();
    const name = inputName.value.trim();
    const email = inputEmail.value.trim().toLowerCase();
    if(name === ""){
       showToast("Name is required!", "error");
        return;
    }
    if (email === "") {
    showToast("Email is required!", "error");
    return;
}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
     showToast("Please enter a valid email!", "error");
    return;
}
const emailExists = userData.some(
    user => user.email.toLowerCase() === email &&
    user.id !== editingUserId);
if (emailExists) {
   showToast("This email already exists!", "error");
    return;
}
message.textContent = "";
    try{
        button.disabled = true;
        message.textContent = "creating User";
       const newUser = await addUser({
    name: name,
    email: email
});
        const user = {
            ...newUser,
            name: name,
            email: email,
            address: {
                city: "Unknown"
            }
        };
        userData.unshift(user);
        saveUsers();
        searchUsers();
        showToast("User created successfully!","success");
        form.reset();
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
});
function editUser(id){
     const user = userData.find(user => user.id === id);
    if (!user) {
        return;
    }
    editingUserId = id;
    editName.value = user.name;
    editEmail.value = user.email;
    editForm.style.display = "block";
    editName.focus();
}
async function deleteUser(id) {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete){
        return
    } 
    try {
        message.textContent = "Deleting user...";
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
        userData=userData.filter(user=>user.id!== id);
        saveUsers();
        searchUsers();
        showToast("User deleted successfully");
    }
 catch (error) { message.textContent=error.message;
     }
}
editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = editName.value.trim();
    const email = editEmail.value.trim().toLowerCase();
    if (!name || !email) {
       showToast("Please fill all fields!", "error");
        return;
    }
    const emailExists = userData.some(user =>
  user.email.toLowerCase() === email &&
  user.id !== editingUserId);
if (emailExists) {
 showToast("This email already exists!", "error");
  return;
}
    try {
        message.textContent = "Updating user...";
        const response = await fetch(`${API_URL}/${editingUserId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email
            })
        });
        if (!response.ok) {
  throw new Error("Failed to update user");
}
        userData = userData.map(user =>
    user.id === editingUserId
        ?{
            ...user,
            name: name,
            email: email
        }: user
);
saveUsers();
searchUsers();
showToast("User updated successfully");
editForm.style.display = "none";
editForm.reset();
editingUserId = null;
    } catch (error) {
        message.textContent = error.message;
    }
});
cancelEdit.addEventListener("click", () => {
    editForm.style.display = "none";
    editForm.reset();
    editingUserId = null;
});
exportCSV.addEventListener("click", () => {
  if (userData.length === 0) {
    message.textContent = "No users to export!";
    return;
  }
  const headers = ["Name", "Email", "City"];
  const rows = userData.map(user => [
    user.name,
    user.email,
    user.address?.city || "Unknown"
  ]);
  const csvContent = [headers, ...rows]
    .map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "peoplehub-users.csv";
  link.click();
  URL.revokeObjectURL(url);
});
container.addEventListener("change", (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
        const userId = Number(event.target.dataset.userId);

        if (event.target.checked) {
            if (!selectedUsers.includes(userId)) {
                selectedUsers.push(userId);
            }
        } else {
            selectedUsers = selectedUsers.filter(
                id => id !== userId
            );
        }
        updateSelectedCount();
        searchUsers();
    }
});
// Edit and Delete events
container.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    const userId = Number(btn.dataset.userId);
    if (btn.dataset.action === "edit") {
        editUser(userId);
    }
    if (btn.dataset.action === "delete") {
        deleteUser(userId);
    }
});
getUser();