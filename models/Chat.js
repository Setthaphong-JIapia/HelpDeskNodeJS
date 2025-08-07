// models/Chat.js
const db = require('../config/db');

class Chat {
    static createChat(ticketId, chatLog, callback) {
        const query = 'INSERT INTO chat (ticketId, chatLog) VALUES (?, ?)';
        db.query(query, [ticketId, chatLog], (err, result) => {
            callback(err, result);
        });
    }

    static fetchChatByTicketId(ticketId, callback) {
        const query = 'SELECT * FROM chat WHERE ticketId = ? ORDER BY createdAt';
        db.query(query, [ticketId], (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = Chat;
