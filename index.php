<!DOCTYPE html>
<html>
  <head>
    <title>Customer Service Chat</title>
    <script src="/socket.io/socket.io.js"></script>
  </head>
  <body>
    <div id="chat">
      <ul id="messages"></ul>
      <form id="message-form">
        <input id="message-input" autocomplete="off" />
        <button>Send</button>
      </form>
    </div>
    <script>
      const socket = io();
      const form = document.querySelector('#message-form');
      const input = document.querySelector('#message-input');
      const messages = document.querySelector('#messages');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });

      socket.on('chat message', (msg) => {
        const li = document.createElement('li');
        li.textContent = msg;
        messages.appendChild(li);
      });
    </script>
  </body>
</html>
