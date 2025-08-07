const User = require('../models/User');

// แสดงรายการผู้ใช้ทั้งหมด
exports.getUserList = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) return res.status(500).send('Error fetching user list');
        
        // ใช้ Promise.all เพื่อดึงชื่อบทบาทพร้อมกัน
        const userRolesPromises = users.map(user => {
            return new Promise((resolve) => {
                User.getUserRole(user.userId, (err, roles) => {
                    if (err) return resolve(null); // ถ้าเกิดข้อผิดพลาด
                    const roleId = roles.length > 0 ? roles[0].roleId : null;
                    User.getUserRoleName(roleId, (err, roleName) => {
                        if (err) return resolve(null); // ถ้าเกิดข้อผิดพลาด
                        resolve({ ...user, roleName });
                    });
                });
            });
        });

        Promise.all(userRolesPromises).then(usersWithRoles => {
            res.render('user_list', { users: usersWithRoles.filter(u => u) }); // ส่งผู้ใช้ที่มีบทบาทกลับไป
        });
    });
};

// เพิ่มผู้ใช้ใหม่
exports.addUser = (req, res) => {
    const { username, password, roleId } = req.body;

    User.createUser({ username, password, roleId }, (err, result) => {
        if (err) return res.status(500).send('Error creating user');
        res.redirect('/users');
    });
};

// ดึงข้อมูลผู้ใช้เพื่อตรวจสอบก่อนแก้ไข
    exports.getUserById = (req, res) => {
        const userId = req.params.userId;

        User.getUserById(userId, (err, user) => {
            if (err || !user) return res.status(404).send('User not found');

            // ดึง roleId ของผู้ใช้เพื่อหาชื่อบทบาท
            User.getUserRole(userId, (err, roles) => {
                if (err) return res.status(500).send('Error fetching user role');
                const roleId = roles.length > 0 ? roles[0].roleId : null;

                // ดึงชื่อบทบาท
                User.getUserRoleName(roleId, (err, roleName) => {
                    if (err) return res.status(500).send('Error fetching role name');
                    
                    // ดึงรายการบทบาททั้งหมด
                    User.getAllRoles((err, allRoles) => {
                        if (err) return res.status(500).send('Error fetching roles');
                        res.render('edit_user', { user, roleName, roles: allRoles }); // ส่ง roles พร้อมกับข้อมูลผู้ใช้
                    });
                });
            });
        });
    };




// แก้ไขข้อมูลผู้ใช้
exports.updateUser = (req, res) => {
    const { userId } = req.params;
    const { username, password, roleId } = req.body; // เพิ่ม password

    User.updateUser(userId, { username, password, roleId }, (err, result) => {
        if (err) return res.status(500).send('Error updating user');
        res.redirect('/users');
    });
};




// ลบบัญชีผู้ใช้
exports.deleteUser = (req, res) => {
    const { userId } = req.params;
    User.deleteUser(userId, (err) => {
        if (err) return res.status(500).send('Error deleting user');
        res.redirect('/users');
    });
};


exports.getAddUserForm = (req, res) => {
    User.getAllRoles((err, roles) => {
        if (err) return res.status(500).send('Error fetching roles');
        res.render('add_user', { roles }); // ส่ง roles ไปยัง view
    });
};