import ChatController from './ChatController';

const chat = document.querySelector('.chat');
const chatController = new ChatController(chat);
chatController.init();
