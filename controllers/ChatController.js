// controllers/ChatController.js
const Chat = require('../models/Chat');

class ChatController {
    static getChat(req, res) {
        const { ticketId } = req.params;
        Chat.fetchChatByTicketId(ticketId, (err, chats) => {
            if (err) {
                return res.status(500).send('Error fetching chat logs');
            }
            res.render('chat', { chats, ticketId });
        });
    }

    static postChat(req, res) {
        const { ticketId } = req.params;
        const { chatLog } = req.body;

        Chat.createChat(ticketId, chatLog, (err) => {
            if (err) {
                return res.status(500).send('Error sending chat');
            }
            res.redirect(`/chat/${ticketId}`);
        });
    }
}

module.exports = ChatController;
