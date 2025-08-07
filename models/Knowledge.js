const db = require('../config/db');

class Knowledge {
    static fetchArticles(query, callback) {
        const sql = 'SELECT * FROM knowledgebase WHERE title LIKE ? OR content LIKE ?';
        db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
            callback(err, results);
        });
    }
    static createArticle({ title, content, createdBy }, callback) {
        const sql = 'INSERT INTO knowledgebase (title, content, createdBy) VALUES (?, ?, ?)';
        db.query(sql, [title, content, createdBy], (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = Knowledge;
