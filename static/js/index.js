socket = io();

names = ['Lee', 'Kye', 'Penelope', 'Demi', 'Flora', 'Alexia', 'Amelia', 'Claudia', 'Lachlan', 'Esme', 'Annabel', 'Charley', 'Evangeline', 'Milly', 'Paige', 'Sam', 'Yasmin', 'Minnie', 'Annabelle', 'Abigail', 'Genevieve', 'Ray', 'Lisa', 'Verity', 'Faye', 'Stacey', 'Jenna', 'Courtney', 'Angela', 'Ronnie', 'Rosa', 'Gloria', 'Meghan', 'Poppy', 'Kane', 'Sana', 'Darcie', 'Susan', 'Cleo', 'Mabel', 'Jane', 'Stephanie', 'Cora', 'Scarlett', 'Ayla', 'Jessica', 'Hanna', 'Elsie', 'Jay', 'Maia'];
function randomName() {
  return names[Math.floor(Math.random() * names.length)];
}

messagesForm.onsubmit = () => {
  if (document.getElementById('typing') != null)
    document.getElementById('userTyping').innerHTML = '<span style="color: white">...</span>';
  message = messagesForm.message.value;
  messagesForm.message.value = '';
  messages.innerHTML += 'você: ' + message + '<br>';
  messages.scrollTo(0, messages.scrollHeight);
  socket.emit(roomCode, message);
  return false;
}

function changeRoom(roomCode) {
  socket.emit('change room', roomCode);

  /* Listening for messages of other users from the same room: */
  socket.on(roomCode, (message) => {
    if (document.getElementById('typing') != null)
      document.getElementById('userTyping').innerHTML = '<span style="color: white">...</span>';
    messages.innerHTML += message + '<br>';
    messages.scrollTo(0, messages.scrollHeight);
  });
}

menu.onsubmit = () => {
  username = menu.username.value;
  roomCode = menu.roomCode.value;

  socket.emit('change username', username);

  changeRoom(roomCode);

  menu.style.display = 'none';
  menuChooseBuildedRoom.style.display = 'none';
  messagesBox.style.display = 'block';

  return false;
}

roomOne.onclick = () => {
  username = randomName();
  roomCode = 'roomOne';

  socket.emit('change username', username);

  socket.on(roomCode + ':typing', (text) => {
    typing = document.getElementById('typing');
    if (typing == null) {
      userTyping.innerHTML = '<span class="text-secondary" id="typing">' + text + '</span>';

      /* Deletes the "typing..." message after the time set in setTimeout. */
      setTimeout(() => {
        document.getElementById('userTyping').innerHTML = '<span style="color: white">...</span>';
      }, 3000);
    }
  });

  changeRoom(roomCode);

  menu.style.display = 'none';
  menuChooseBuildedRoom.style.display = 'none';
  messagesBox.style.display = 'block';
}

/* "typing..." functionality. */
message.onkeypress = () => {
  socket.emit(roomCode + ':typing');
}
