const Report = require('../models/Report');
const db = require('../config/db');


exports.generateReport = (req, res) => {
    const { reportType } = req.body;
    const generatedBy = req.session.userId;

    // Initialize reportData variable
    let reportData = '';

    switch (reportType) {
        case 'Ticket Queue':
            // Fetch ticket data in the queue
            const queueSql = 'SELECT * FROM queue JOIN ticket ON queue.ticketId = ticket.ticketId';
            db.query(queueSql, (err, queueResults) => {
                if (err) {
                    return res.status(500).send('Error fetching ticket queue data');
                }
                reportData = JSON.stringify(queueResults); // Convert results to string for storage
                Report.generateReport(reportType, reportData, generatedBy, (err, result) => {
                    if (err) {
                        return res.status(500).send('Error generating report');
                    }
                    res.redirect('/reports');
                });
            });
            return; // Prevent further execution

        case 'Ticket Status':
            const statusSql = 'SELECT ticketId, status FROM ticket';
            db.query(statusSql, (err, statusResults) => {
                if (err) {
                    return res.status(500).send('Error fetching ticket status data');
                }
                reportData = JSON.stringify(statusResults);
                Report.generateReport(reportType, reportData, generatedBy, (err, result) => {
                    if (err) {
                        return res.status(500).send('Error generating report');
                    }
                    res.redirect('/reports');
                });
            });
            return;
        default:
            return res.status(400).send('Invalid report type');
    }
};


exports.viewReports = (req, res) => {
    Report.fetchReports((err, reports) => {
        if (err) {
            return res.status(500).send('Error fetching reports');
        }
        res.render('reports', { reports });
    });
};

exports.viewUserReports = (req, res) => {
    const userId = req.session.userId; // ใช้ userId จาก session

    Report.fetchReportsByUser(userId, (err, reports) => {
        if (err) {
            return res.status(500).send('Error fetching reports');
        }
        res.render('user_reports', { reports });
    });
};
