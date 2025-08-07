const db = require('../config/db');

class Report {
    static generateReport(reportType, reportData, generatedBy, callback) {
        const sql = 'INSERT INTO report (reportType, reportData, generatedBy) VALUES (?, ?, ?)';
        db.query(sql, [reportType, reportData, generatedBy], (err, results) => {
            callback(err, results);
        });
    }

    static fetchReports(callback) {
        const sql = 'SELECT * FROM report';
        db.query(sql, (err, results) => {
            callback(err, results);
        });
    }

    static fetchReportsByUser(userId, callback) {
        const sql = 'SELECT * FROM report WHERE generatedBy = ?';
        db.query(sql, [userId], (err, results) => {
            callback(err, results);
        });
    }

    // ฟังก์ชันเพิ่มเติมสำหรับรายงานตามประเภท
    static fetchReportsByType(reportType, callback) {
        const sql = 'SELECT * FROM report WHERE reportType = ?';
        db.query(sql, [reportType], (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = Report;
