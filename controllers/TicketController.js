// controllers/TicketController.js
const Ticket = require('../models/Ticket');

exports.submitTicket = (req, res) => {

    res.render('submitTicket');//แสดงหน้าสำหรับส่ง Ticket


};
//สร้าง Ticket ใหม่จากข้อมูลที่ได้รับจากแบบฟอร์มและ session ของผู้ใช้ โดยกำหนด status เป็น NEW 
//แล้วบันทึกข้อมูลลงฐานข้อมูล ถ้าสำเร็จจะแสดงหน้าการยืนยันที่มีหมายเลข Ticket
exports.createTicket = (req, res) => {


    const ticketData = {
        userId: req.session.userId,
        description: req.body.description,
        status: 'NEW',
        createdDate: new Date()
    };

    Ticket.create(ticketData, (err, result) => {
        if (err) return res.send('Error saving ticket');
        res.render('confirmation', { ticketId: result.insertId });
    });
};




//ดึงรายการ Ticket ทั้งหมดที่มี status เป็น NEW เพื่อแสดงในหน้า newTickets สำหรับการจัดการ Ticket ใหม่
exports.viewNewTickets = (req, res) => {
    if (!req.session.userId) return res.redirect('/login');

    // ดึงข้อมูล Ticket ที่มีสถานะเป็น 'NEW'
    Ticket.getNewTickets((err, tickets) => {
        if (err) return res.send('Error fetching tickets');
        res.render('newTickets', { tickets });
    });
};
//บันทึกว่าผู้ใช้ได้ Assign ticket ใด โดยเก็บ userId ของผู้ทำการ Assign ลงฐานข้อมูล
exports.assignTicket = (req, res) => {
    if (!req.session.userId) return res.redirect('/login');  // ตรวจสอบว่ามีการล็อกอินแล้ว

    const { ticketId } = req.body;
    const assignedBy = req.session.userId;  // บันทึก userId ของผู้ทำการ Assign

    Ticket.assign(ticketId, assignedBy, (err, result) => {
        if (err) return res.status(500).send('Error assigning ticket');
        res.redirect('/tickets/new');
    });
};


//ดึงรายการ Ticket ทั้งหมดที่ผู้ใช้ล็อกอินเข้ามาสร้างขึ้นมาแสดงในหน้า track_ticket


exports.getTicketList = (req, res) => {
    const userId = req.session.userId; // ดึง userId จาก session
    Ticket.fetchTicketsForUser(userId, (err, tickets) => {
        if (err) {
            return res.status(500).send('Error fetching tickets');
        }
        res.render('track_ticket', { tickets });
    });
};


//ดึงรายละเอียดของ Ticket ตาม ticketId ที่ได้รับจาก URL แล้วแสดงในหน้า ticket_details
exports.getTicketDetails = (req, res) => {
    const ticketId = req.params.ticketId;
    Ticket.fetchTicketStatus(ticketId, (err, ticket) => {
        if (err || !ticket) {
            return res.status(404).send('Ticket not found');
        }
        res.render('ticket_details', { ticket });
    });
};

//เปลี่ยนสถานะของ Ticket เป็น In Progress โดยใช้ ticketId ที่รับจาก URL
exports.startProblemSolving = (req, res) => {
    const ticketId = req.params.ticketId; // รับ ticketId จากพารามิเตอร์ URL

    // เปลี่ยนสถานะเป็น "In Progress"
    Ticket.markTicketInProgress(ticketId, (err, result) => { // <-- แก้ไขตรงนี้
        if (err) {
            return res.status(500).send('Error marking ticket as in progress');
        }

        // เช็คว่า ticket ถูกอัปเดตสำเร็จหรือไม่
        if (result.success) {
            // ถ้าสำเร็จให้เปลี่ยนเส้นทางไปยังหน้าที่เหมาะสม
            res.redirect('/tickets/assigned'); // เปลี่ยนเส้นทางหลังจากอัปเดตสำเร็จ
        } else {
            // หากไม่พบตั๋วที่ระบุให้แสดงข้อความผิดพลาด
            return res.status(404).send(result.message);    
        }
    });
};



//เปลี่ยนสถานะ Ticket เป็น Escalated โดยใช้ ticketId จาก URL และเปลี่ยนเส้นทางไปยังหน้า /tickets/assigned
exports.escalateTicket = (req, res) => {
    const ticketId = req.params.ticketId;

    Ticket.markTicketEscalated(ticketId, (err, result) => {
        if (err) {
            return res.status(500).send('Error escalating ticket');
        }
        if (result.success) {
            // ถ้าสำเร็จให้เปลี่ยนเส้นทางไปยังหน้าที่เหมาะสม
            res.redirect('/tickets/assigned'); // เปลี่ยนเส้นทางหลังจากอัปเดตสำเร็จ
        } else {
            // หากไม่พบตั๋วที่ระบุให้แสดงข้อความผิดพลาด
            return res.status(404).send(result.message);    
        }
    });
};

// ฟังก์ชันสำหรับบันทึกการแก้ไขปัญหาเสร็จ
exports.resolveTicket = (req, res) => {
    const ticketId = req.params.ticketId; // รับ ticketId จากพารามิเตอร์ URL
    const solution = req.body.solution; // รับการแก้ไขปัญหาจากฟอร์ม

    // เรียกใช้ฟังก์ชัน resolveTicket เพื่อบันทึกการแก้ไขในฐานข้อมูล
    Ticket.resolveTicket(ticketId, solution, (err, result) => {
        if (err) {
            return res.status(500).send('Error resolving ticket');
        }
        if (result.success) {
            // ถ้าสำเร็จให้เปลี่ยนเส้นทางไปยังหน้าที่เหมาะสม
            res.redirect('/tickets/assigned'); // เปลี่ยนเส้นทางหลังจากอัปเดตสำเร็จ
        } else {
            // หากไม่พบตั๋วที่ระบุให้แสดงข้อความผิดพลาด
            return res.status(404).send(result.message);    
        }
    });
};



//ดึงรายการ Ticket ที่ถูกมอบหมายให้ผู้ใช้คนปัจจุบันเพื่อแสดงในหน้า assigned_tickets
exports.getAssignedTickets = (req, res) => {
    const userId = req.session.userId; // ดึง userId จาก session

    Ticket.getAssignedTickets(userId, (err, tickets) => {
        if (err) {
            return res.status(500).send('Error fetching assigned tickets');
        }

        res.render('assigned_tickets', { tickets });
    });
};
//ดึง Ticket ที่มีสถานะ NEW มาแสดงในหน้า edit_queue เพื่อปรับเปลี่ยนลำดับการจัดการ (queue)
exports.editQueue = (req, res) => {
    Ticket.getNewTickets((err, tickets) => {
        if (err) return res.send('Error fetching tickets');
        res.render('edit_queue', { tickets });
    });
};

// ฟังก์ชันสำหรับอัปเดตลำดับ queue
exports.updateQueue = (req, res) => {
    const updatedQueue = req.body.queue; // สมมุติว่าเป็นอาเรย์ของ queueId และ priorityLevel ที่ส่งจากฟอร์ม

    // Loop ผ่านแต่ละ item ใน updatedQueue เพื่ออัปเดตในฐานข้อมูล
    const updates = updatedQueue.map((item) => {
        return new Promise((resolve, reject) => {
            const { queueId, priorityLevel } = item;
            Ticket.updateQueue(queueId, priorityLevel, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });

    // รอให้ Promise ทั้งหมดเสร็จสิ้น
    Promise.all(updates)
        .then(() => res.redirect('/edit-queue'))
        .catch((err) => res.status(500).send('Error updating queue'));
};

//อัปเดตสถานะ Ticket เป็น Closed เมื่อผู้ใช้ทำการตรวจสอบและยืนยันการแก้ไขแล้ว จากนั้นเปลี่ยนเส้นทางไปยัง /track-tickets
exports.verifyTicket = (req, res) => {
    const ticketId = req.params.ticketId;

    // อัปเดตสถานะเป็น "Verified"
    Ticket.updateTicketStatus(ticketId, 'Closed', (err, result) => {
        if (err) {
            return res.status(500).send('Error verifying ticket');
        }
        res.redirect('/track-tickets'); // เปลี่ยนเส้นทางหลังจากตรวจสอบเสร็จ
    });
};



//อัปเดตสถานะ Ticket เป็น Reopened ถ้าผู้ใช้ไม่ยืนยันการแก้ไข จากนั้นเปลี่ยนเส้นทางไปยัง /track-tickets


exports.notVerifyTicket = (req, res) => {
    const ticketId = req.params.ticketId;

    Ticket.updateTicketStatus(ticketId, 'Reopened', (err, result) => {
        if (err) {
            return res.status(500).send('Error not verifying ticket');
        }
        res.redirect('/track-tickets'); // เปลี่ยนเส้นทางหลังจากไม่ตรวจสอบเสร็จ
    });
};

