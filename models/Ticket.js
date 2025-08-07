// models/Ticket.js
const db = require('../config/db');
//ดึงข้อมูล Ticket ที่มีสถานะเป็น NEW พร้อมระดับความสำคัญ (priorityLevel) โดยใช้การเชื่อมกับตาราง queue เพื่อนำไปแสดงในหน้า Ticket ใหม่
class Ticket {
    static getNewTickets(callback) {
        const query = `
            SELECT t.*, q.priorityLevel 
            FROM ticket t 
            LEFT JOIN queue q ON t.queueId = q.queueId 
            WHERE t.status = "NEW"
        `;
        db.query(query, (err, results) => {
            callback(err, results);
        });
    }


//เปลี่ยนสถานะ Ticket เป็น Assigned โดยบันทึก userId ของผู้ทำการ Assign 
//และลบ Ticket ออกจากตาราง queue (เฉพาะกรณีที่สถานะไม่ใช่ NEW) 
//พร้อมทั้งเรียงลำดับ priorityLevel ใหม่เพื่อจัดการลำดับในคิว


    static assign(ticketId, assignedBy, callback) {
        const query = `
            UPDATE ticket 
            SET status = "Assigned", assignedBy = ?
            WHERE ticketId = ?
        `;
        db.query(query, [assignedBy, ticketId], (err, result) => {
            if (err) return callback(err);

            // ลบตั๋วจาก queue หากสถานะไม่ใช่ "NEW"
            const deleteQueueQuery = `
                DELETE FROM queue 
                WHERE ticketId = ? AND EXISTS (
                    SELECT 1 FROM ticket WHERE ticketId = ? AND status != "NEW"
                )
            `;
            db.query(deleteQueueQuery, [ticketId, ticketId], (err) => {
                if (err) return callback(err);
                
                // เรียงลำดับ priorityLevel ใหม่
                Ticket.reorderPriorityLevels(callback);
            });

        });
    }


    //สร้าง Ticket ใหม่ และกำหนด priorityLevel โดยนับจำนวน queue ปัจจุบัน และบันทึกข้อมูลลำดับลงในตาราง queue รวมถึงอัปเดต queueId ในตาราง Ticket
    static create(ticketData, callback) {
        db.query('INSERT INTO ticket SET ?', ticketData, (err, results) => {
            if (err) return callback(err);
            
            // คำนวณ priorityLevel โดยการนับจำนวน queue ปัจจุบัน
            db.query('SELECT COUNT(*) AS count FROM queue', (err, countResult) => {
                if (err) return callback(err);
        
                const newPriorityLevel = countResult[0].count + 1; // เพิ่ม 1 เพื่อเป็นลำดับถัดไป
                
                // สร้าง queue entry ใหม่
                const newQueueEntry = {
                    ticketId: results.insertId,
                    priorityLevel: newPriorityLevel // ใช้ค่า count เป็น priorityLevel
                };
                
                // เพิ่ม queue entry ใหม่
                db.query('INSERT INTO queue SET ?', newQueueEntry, (err, queueResult) => {
                    if (err) return callback(err);
    
                    // อัปเดต queueId ในตาราง ticket
                    db.query('UPDATE ticket SET queueId = ? WHERE ticketId = ?', [queueResult.insertId, results.insertId], (err) => {
                        if (err) return callback(err);
                        callback(null, results); // ส่งผลลัพธ์กลับไป
                    });
                });
            });
        });
    }
    
//ดึงข้อมูล Ticket ทั้งหมดที่ผู้ใช้คนปัจจุบันเป็นผู้สร้าง พร้อมระดับความสำคัญในคิวเพื่อแสดงให้ผู้ใช้ติดตาม
    static fetchTicketsForUser(userId, callback) {
        const query = `
            SELECT ticket.*, queue.priorityLevel 
            FROM ticket 
            LEFT JOIN queue ON ticket.ticketId = queue.ticketId 
            WHERE ticket.userId = ?;
        `;
        db.query(query, [userId], (err, results) => {
            callback(err, results);
        });
    }

    //ดึงสถานะของ Ticket ตาม ticketId ที่ได้รับมา
    static fetchTicketStatus(ticketId, callback) {
        db.query('SELECT * FROM ticket WHERE ticketId = ?', [ticketId], (err, results) => {
            callback(err, results[0]);
        });
    }

    //เปลี่ยนสถานะ Ticket เป็น In Progress ตาม ticketId ที่ระบุ
    static markTicketInProgress(ticketId, callback) {
        const sql = 'UPDATE ticket SET status = ? WHERE ticketId = ?';
        db.query(sql, ['In Progress', ticketId], (err, result) => {
            if (err) return callback(err);
    
            // ตรวจสอบจำนวนแถวที่ถูกอัปเดต
            if (result.affectedRows === 0) {
                // ถ้าไม่มีแถวใดถูกอัปเดต แสดงว่า ticketId นี้ไม่มีอยู่
                return callback(null, { success: false, message: "Ticket not found." });
            }
    
            // ถ้ามีการอัปเดตสำเร็จ ส่งข้อมูลสำเร็จกลับไป
            callback(null, { success: true, message: "Ticket marked as In Progress successfully." });
        });
    }
    

    //บันทึกการแก้ไขปัญหาใน Ticket โดยเปลี่ยนสถานะเป็น Resolved และบันทึกคำตอบหรือแนวทางแก้ไขที่ได้รับจากผู้ใช้
    static resolveTicket(ticketId, solution, callback) {
        const sql = 'UPDATE ticket SET status = ?, solution = ? WHERE ticketId = ?';
        db.query(sql, ['Resolved', solution, ticketId], (err, result) => {
            if (err) return callback(err);
    
            // ตรวจสอบจำนวนแถวที่ถูกอัปเดต
            if (result.affectedRows === 0) {
                // ถ้าไม่มีแถวใดถูกอัปเดต แสดงว่า ticketId นี้ไม่มีอยู่
                return callback(null, { success: false, message: "Ticket not found." });
            }
    
            // ถ้ามีการอัปเดตสำเร็จ ส่งข้อมูลสำเร็จกลับไป
            callback(null, { success: true, message: "Ticket resolved successfully." });
        });
    }
    
    //ดึง Ticket ทั้งหมดที่ถูกมอบหมายให้เจ้าหน้าที่ตาม userId ของผู้ที่ทำการ Assign
static getAssignedTickets(userId, callback) {
    const sql = 'SELECT * FROM ticket WHERE assignedBy = ?'; // สมมุติว่าใช้ `assignedTo` เพื่อเก็บ userId ของเจ้าหน้าที่
    db.query(sql, [userId], (err, results) => {
        if (err) {
            // ส่งข้อผิดพลาดกลับไปยัง callback
            return callback(err, null);
        }
        // ส่งผลลัพธ์กลับไปยัง callback
        callback(null, results);
    });
}

    //อัปเดตระดับความสำคัญ (priorityLevel) ของคิวในตาราง queue โดยใช้ queueId ที่ระบุ
    static updateQueue(queueId, priorityLevel, callback) {
        const sql = 'UPDATE queue SET priorityLevel = ? WHERE queueId = ?';
        db.query(sql, [priorityLevel, queueId], (err, result) => {
            if (err) return callback(err);
    
            // ตรวจสอบจำนวนแถวที่ถูกอัปเดต
            if (result.affectedRows === 0) {
                // ถ้าไม่มีแถวใดถูกอัปเดต แสดงว่า queueId นี้ไม่มีอยู่
                return callback(null, { success: false, message: "Queue not found." });
            }
    
            // ถ้ามีการอัปเดตสำเร็จ ส่งข้อมูลสำเร็จกลับไป
            callback(null, { success: true, message: "Queue priority level updated successfully." });
        });
    }
    
    //เรียงลำดับความสำคัญ (priorityLevel) ของทุกคิวใหม่ตามลำดับ โดยจะเริ่มจาก 1 ตามลำดับที่ต้องการเพื่อให้ระดับความสำคัญในคิวเป็นไปตามลำดับ
    static reorderPriorityLevels(callback) {
        const query = `
            SELECT queueId FROM queue 
            ORDER BY priorityLevel ASC
        `;
        db.query(query, (err, results) => {
            if (err) return callback(err);

            // เรียงลำดับใหม่
            const updates = results.map((row, index) => {
                return new Promise((resolve, reject) => {
                    const updateQuery = `
                        UPDATE queue 
                        SET priorityLevel = ? 
                        WHERE queueId = ?
                    `;
                    db.query(updateQuery, [index + 1, row.queueId], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });

            // รอให้ทุกการอัปเดตเสร็จสิ้น
            Promise.all(updates)
                .then(() => callback(null))
                .catch(callback);
        });
    }
    //อัปเดตสถานะของ Ticket ตาม ticketId ที่ระบุ
    static updateTicketStatus(ticketId, status, callback) {
        const sql = 'UPDATE ticket SET status = ? WHERE ticketId = ?';
        db.query(sql, [status, ticketId], (err, result) => {
            if (err) return callback(err);
    
            // ตรวจสอบจำนวนแถวที่ถูกอัปเดต
            if (result.affectedRows === 0) {
                // ถ้าไม่มีแถวใดถูกอัปเดต แสดงว่า ticketId นี้ไม่มีอยู่
                return callback(null, { success: false, message: "Ticket not found." });
            }
    
            // ถ้ามีการอัปเดตสำเร็จ ส่งข้อมูลสำเร็จกลับไป
            callback(null, { success: true, message: "Ticket status updated successfully." });
        });
    }
    
    //เปลี่ยนสถานะ Ticket เป็น Escalated ตาม ticketId ที่ระบุเพื่อแสดงว่าปัญหาถูกส่งต่อไปขั้นสูงกว่า
    static markTicketEscalated(ticketId, callback) {
        const sql = 'UPDATE ticket SET status = ? WHERE ticketId = ?';
        db.query(sql, ['Escalated', ticketId], (err, result) => {
            if (err) return callback(err);
    
            // ตรวจสอบจำนวนแถวที่ถูกอัปเดต
            if (result.affectedRows === 0) {
                // ถ้าไม่มีแถวใดถูกอัปเดต แสดงว่า ticketId นี้ไม่มีอยู่
                return callback(null, { success: false, message: "Ticket not found." });
            }
    
            // ถ้ามีการอัปเดตสำเร็จ ส่งข้อมูลสำเร็จกลับไป
            callback(null, { success: true, message: "Ticket marked as Escalated successfully." });
        });
    }
    
}

    




module.exports = Ticket;
