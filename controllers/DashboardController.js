// DashboardController.js
const User = require('../models/User');

exports.getDashboard = (req, res) => {
    const userId = req.session.userId; // ดึง userId จาก session

    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
    if (!userId) {
        return res.status(401).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Access Denied</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        text-align: center;
                        padding: 50px;
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    a {
                        color: #4CAF50;
                        text-decoration: none;
                        font-weight: bold;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1>Access Denied</h1>
                <p>Please log in to access this page.</p>
                <a href="/">Go to Login</a>
            </body>
            </html>
        `);
    }

    User.getUserRole(userId, (err, roles) => {
        if (err || !roles.length) {
            return res.status(403).send('Access denied <a href="/">Go to Login</a>');
        }

        const roleId = roles[0].roleId; // สมมติว่าผู้ใช้มีบทบาทเดียว

        // ดึงชื่อบทบาท
        User.getUserRoleName(roleId, (err, roleName) => {
            if (err || !roleName) {
                return res.status(500).send('Error fetching role name');
            }

            // บันทึก roleName ลงใน session
            req.session.role = roleName;

            // แสดงหน้าแดชบอร์ดตามบทบาท
            if (roleName === 'Customer') {
                res.render('user_index', { user: req.session });
            } else if (roleName === 'Staff') {
                res.render('staff_index', { user: req.session });
            } else if (roleName === 'Admin') {
                res.render('admin_index', { user: req.session });
            } else {
                res.status(403).send('Access denied <a href="/">Go to Login</a>');
            }
        });
    });
};
