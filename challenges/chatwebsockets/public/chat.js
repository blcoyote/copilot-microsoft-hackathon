// Initialize socket connection
const socket = io();

// Get DOM elements
const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const imageInput = document.getElementById('image');
const sendButton = document.getElementById('send');
const usernameInput = document.getElementById('username');
const setUsernameButton = document.getElementById('setUsername');

// Retrieve username and user color from local storage or generate new ones
let username = localStorage.getItem('username') || '';
let userColor = localStorage.getItem('userColor') || '#' + Math.floor(Math.random() * 16777215).toString(16);

// List of moods and animals for generating random usernames
const moods = ['Happy', 'Sad', 'Angry', 'Excited', 'Calm', 'Joyful', 'Bored', 'Curious', 'Nervous', 'Relaxed'];
const animals = ['Lion', 'Tiger', 'Bear', 'Wolf', 'Eagle', 'Fox', 'Elephant', 'Giraffe', 'Panda', 'Kangaroo'];

// Suggest a predefined username if not already set
if (!username) {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    usernameInput.value = `${randomMood} ${randomAnimal}`;
} else {
    usernameInput.value = username;
}

// Enable or disable input fields based on whether a username is set
if (username) {
    usernameInput.disabled = true;
    setUsernameButton.disabled = true;
    messageInput.disabled = false;
    imageInput.disabled = false;
    sendButton.disabled = false;
    initializeSocket();
} else {
    usernameInput.disabled = false;
    setUsernameButton.disabled = false;
    messageInput.disabled = true;
    imageInput.disabled = true;
    sendButton.disabled = true;
    initializeSocket();
}

// Set username and enable input fields when the set username button is clicked
setUsernameButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username);
        localStorage.setItem('userColor', userColor);
        usernameInput.disabled = true;
        setUsernameButton.disabled = true;
        messageInput.disabled = false;
        imageInput.disabled = false;
        sendButton.disabled = false;
    }
});

// Initialize socket events and handlers
function initializeSocket() {
    // Display chat history
    socket.on('chat history', (history) => {
        history.forEach((msg) => {
            if (msg.type === 'text') {
                const messageElement = document.createElement('div');
                messageElement.innerHTML = `<span style="color: ${msg.color}"><strong>${msg.username}:</strong> ${msg.text}</span>`;
                chat.appendChild(messageElement);
            } else if (msg.type === 'image') {
                const imageElement = document.createElement('div');
                imageElement.innerHTML = `<strong>${msg.username}:</strong> <img src="${msg.data}" style="max-width: 100%;">`;
                chat.appendChild(imageElement);
            }
        });
        chat.scrollTop = chat.scrollHeight;
    });

    // Handle incoming chat messages
    socket.on('chat message', (msg) => {
        if (msg.type === 'text') {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<span style="color: ${msg.color}"><strong>${msg.username}:</strong> ${msg.text}</span>`;
            chat.appendChild(messageElement);
        } else if (msg.type === 'image') {
            const imageElement = document.createElement('div');
            imageElement.innerHTML = `<strong>${msg.username}:</strong> <img src="${msg.data}" style="max-width: 100%;">`;
            chat.appendChild(imageElement);
        }
        chat.scrollTop = chat.scrollHeight;
    });

    // Send message when the send button is clicked
    sendButton.addEventListener('click', () => {
        const msg = {
            username: username,
            text: messageInput.value,
            color: userColor,
            type: 'text'
        };
        socket.emit('chat message', msg);
        messageInput.value = '';

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgMsg = {
                    username: username,
                    data: e.target.result,
                    type: 'image'
                };
                socket.emit('chat message', imgMsg);
            };
            reader.readAsDataURL(file);
            imageInput.value = '';
        }
    });

    // Send message when the Enter key is pressed
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
}