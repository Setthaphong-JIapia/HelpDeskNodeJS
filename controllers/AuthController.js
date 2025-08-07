// controllers/AuthController.js
const User = require('../models/User');

exports.login = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, user) => {
        if (err || !user || user.password !== password) {
            return res.send('Invalid username or password');
        }

        req.session.userId = user.userId;

        // ดึงข้อมูลบทบาทและสิทธิ์
        User.getUserRole(user.userId, (err, roles) => {
            if (err || !roles.length) {
                return res.send('No roles found');
            }

            req.session.roleId = roles[0].roleId; // สมมติว่าผู้ใช้มีบทบาทเดียว
            User.getUserPermissions(req.session.roleId, (err, permissions) => {
                if (err) {
                    return res.send('Error fetching permissions');
                }
                req.session.permissions = permissions.map(p => p.permissionName);
                res.redirect('/dashboard');
            });
        });
    });
};


exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};