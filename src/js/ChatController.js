import Modal from './Madal';

function formatDate(string) {
  let date = new Date(string);
  date = date.toLocaleString('ru');
  date = date.substr(0, 17).replace(',', '');
  return date;
}
export default class ChatController {
  constructor(elem) {
    this.element = elem;
    this.userList = this.element.querySelector('.chat__users-list');
    this.textArea = this.element.querySelector('.chat__messages-text');
    this.messagesBox = this.element.querySelector('.chat__messages-messages');

    this.server = 'wss://ahj-ws-chat.herokuapp.com/ws';
    // this.server = 'ws://localhost:7070/ws';

    this.onStart = this.onStart.bind(this);

    this.modal = new Modal();
    this.modal.showModal = this.modal.showModal.bind(this.modal);
    this.modal.createModal = this.modal.createModal.bind(this.modal);
    this.modal.onSaveName = this.modal.onSaveName.bind(this);
  }

  init() {
    this.modal.showModal();
  }

  onStart() {
    this.ws = new WebSocket(this.server);
    this.ws.addEventListener('open', () => {
      this.ws.send(JSON.stringify({
        event: 'connected',
        message: this.name,
      }));
    });

    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.event === 'connect') {
        this.users = msg.message;
      }
      if (msg.event === 'system') {
        this.users = msg.message.users;
        this.renderUserList();
      }
      if (msg.event === 'message') {
        this.addMsg(msg.message);
      }
    });

    this.ws.addEventListener('close', (e) => {
      if (e.reason) {
        this.modal.warning = e.reason;
        this.modal.showModal();
      }
    });

    this.textArea.addEventListener('keydown', (event) => {
      const text = this.textArea.value.trim();
      if (event.key === 'Enter' && text) {
        event.preventDefault();
        this.textArea.value = '';
        this.sendMsg(text);
      }
    });
  }

  renderUserList() {
    this.userList.textContent = '';

    this.users.forEach((user) => {
      const userLi = document.createElement('li');
      userLi.classList.add('chat__users-user');
      userLi.textContent = user;
      if (user === this.name) {
        userLi.textContent = 'You';
        userLi.classList.add('you');
      }
      this.userList.appendChild(userLi);
    });
  }

  sendMsg(text) {
    this.ws.send(JSON.stringify({
      event: 'message',
      message: text,
    }));
  }

  addMsg(data) {
    let { name } = data;
    const { text } = data;
    if (name === this.name) {
      name = 'You';
    }
    const date = formatDate(data.date);
    const massege = document.createElement('div');
    massege.classList.add('message');
    massege.innerHTML = `
    <div class="message__information">${name}, ${date}</div>
    <div class="message__text">${text}</div>
    `;
    if (name === 'You') {
      massege.classList.add('your-message');
    }
    this.messagesBox.appendChild(massege);

    const container = this.element.querySelector('.chat__messages-wrapper');
    container.scrollTop = container.scrollHeight;
  }
}
