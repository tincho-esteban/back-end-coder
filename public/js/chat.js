const socket = io();
const chatBox = document.getElementById("chatBox");
const container = document.getElementById("chatContainer");

let user;

Swal.fire({
    title: "Inicia sesion!",
    text: "Ingresa tu nombre de usuario",
    input: "text",
    confirmButtonText: "Cool",
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value) {
            return "Debe ingresar un nombre de usuario";
        }
    },
}).then((result) => {
    if (result.value) {
        user = result.value;
        socket.emit("new-user", { user: user, id: socket.id });
    }
});

function createMessageHTML({ user, message }) {
    return `
        <div class="chat-message">
            <div class="message-bubble">
                <div class="message-sender">${user}</div>
                <p>${message}</p>
            </div>
        </div>
    `;
}

chatBox.addEventListener("keyup", (e) => {
    const message = chatBox.value.trim();
    if (e.key === "Enter" && message.length > 0) {
        socket.emit("message", { user, message });
        chatBox.value = "";
    }
});

socket.on("messages", (data) => {
    container.innerHTML = data.map(createMessageHTML).join("");
});

function firstLoad() {
    fetch("/chat/message")
        .then((response) => response.json())
        .then((data) => {
            container.innerHTML = data.map(createMessageHTML).join("");
        })
        .catch((error) => console.error("Error:", error));
}

firstLoad();
