// models/User.js
const db = require('../config/db');

class User {
    static findByUsername(username, callback) {
        db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
            callback(err, results[0]);
        });
    }

    static getUserRole(userId, callback) {
        db.query('SELECT roleId FROM userroles WHERE userId = ?', [userId], (err, results) => {
            callback(err, results);
        });
    }

    
    static getUserRoleName(roleId, callback) {
        db.query('SELECT roleName FROM role WHERE roleId = ?', [roleId], (err, results) => {
            callback(err, results[0] ? results[0].roleName : null);
        });
    }


    static getUserPermissions(roleId, callback) {
        db.query('SELECT p.permissionName FROM rolepermissions rp JOIN permission p ON rp.permissionId = p.permissionId WHERE rp.roleId = ?', [roleId], (err, results) => {
            callback(err, results);
        });
    }
    static getAllUsers(callback) {
        db.query('SELECT * FROM user', (err, results) => {
            callback(err, results);
        });
    }


    // สร้างผู้ใช้ใหม่
    static createUser(userData, callback) {
        const { username, password, roleId } = userData;
    
        // ขั้นแรก สร้างผู้ใช้ใหม่ในตาราง user
        db.query('INSERT INTO user (username, password, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [username, password], (err, result) => {
                if (err) {
                    return callback(err);
                }
    
                // หลังจากสร้างผู้ใช้สำเร็จ ให้เพิ่มการเชื่อมโยงกับ role ใน userroles
                const newUserId = result.insertId; // ดึง userId ที่เพิ่งสร้างขึ้นมา
                db.query('INSERT INTO userroles (userId, roleId) VALUES (?, ?)',
                    [newUserId, roleId], (err) => {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, { userId: newUserId, username, roleId }); // ส่งผลลัพธ์กลับ
                    });
            });
    }

    // ดึงข้อมูลผู้ใช้ตาม userId
    static getUserById(userId, callback) {
        db.query('SELECT * FROM user WHERE userId = ?', [userId], (err, results) => {
            callback(err, results[0]);
        });
    }

    // แก้ไขข้อมูลผู้ใช้
// models/User.js

static updateUser(userId, userData, callback) {
    const { username, password, roleId } = userData;

    // เริ่มต้นด้วยการอัปเดตข้อมูลในตาราง user
    const updateUserQuery = 'UPDATE user SET username = ? WHERE userId = ?';
    db.query(updateUserQuery, [username, userId], (err, result) => {
        if (err) {
            return callback(err);
        }

        // อัปเดต password ถ้ามีการกรอก
        if (password) {
            const updatePasswordQuery = 'UPDATE user SET password = ? WHERE userId = ?';
            db.query(updatePasswordQuery, [password, userId], (err) => {
                if (err) {
                    return callback(err);
                }
            });
        }

        // อัปเดตข้อมูลในตาราง userroles
        const updateRoleQuery = 'UPDATE userroles SET roleId = ? WHERE userId = ?';
        db.query(updateRoleQuery, [roleId, userId], (err) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
}



    // ลบผู้ใช้
    static deleteUser(userId, callback) {
        db.query('DELETE FROM user WHERE userId = ?', [userId], callback);
    }


    static getAllRoles(callback) {
        db.query('SELECT * FROM role', (err, results) => {
            callback(err, results);
        });
    }

    
    

    
}

module.exports = User;
