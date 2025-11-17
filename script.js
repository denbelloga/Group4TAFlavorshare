function openModal(title, details) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDetails").textContent = details;

    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}
