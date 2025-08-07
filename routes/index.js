// routes/index.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const TicketController = require('../controllers/TicketController');
const authorize = require('../middlewares/authorize');
const dashboardController = require('../controllers/DashboardController');
const KnowledgeBaseController = require('../controllers/KnowledgeBaseController');
const ReportController = require('../controllers/ReportController');
const UserController = require('../controllers/UserController');
const ChatController = require('../controllers/ChatController');


router.get('/', (req, res) => res.render('login'));
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/submit-ticket', authorize('Create Ticket'),TicketController.submitTicket);
router.post('/submit-ticket', authorize('Create Ticket'),TicketController.createTicket);
// แสดงรายการ Ticket ใหม่ (ต้องมีสิทธิ์ 'Assign Ticket')
router.get('/tickets/new', authorize('Assign Ticket'), TicketController.viewNewTickets);

// Assign Ticket (ต้องมีสิทธิ์ 'Assign Ticket')
router.post('/tickets/assign', authorize('Assign Ticket'), TicketController.assignTicket);
router.get('/dashboard', dashboardController.getDashboard);

router.get('/track-tickets', authorize('TrackTicket'),TicketController.getTicketList);
router.get('/ticket/:ticketId', authorize('TrackTicket'),TicketController.getTicketDetails);

router.get('/knowledge-base', authorize('knowledgeBase'),KnowledgeBaseController.getknowledgebase);
router.get('/search-articles', authorize('knowledgeBase'),KnowledgeBaseController.searchArticles);
router.get('/knowledge-base/new', authorize('knowledgeBase'),KnowledgeBaseController.getNewArticleForm);
router.post('/knowledge-base/new', authorize('knowledgeBase'),KnowledgeBaseController.createArticle);


router.post('/generate-report', authorize('GenReport'),ReportController.generateReport);
router.get('/reports', authorize('GenReport'),ReportController.viewReports);
router.get('/user-reports', authorize('GenReport'),ReportController.viewUserReports);


router.post('/tickets/:ticketId/solve', authorize('SolveProblem'),TicketController.startProblemSolving);

// Route สำหรับบันทึกการแก้ไขปัญหาเสร็จ
router.post('/tickets/:ticketId/resolve', authorize('SolveProblem'),TicketController.resolveTicket);
router.post('/tickets/:ticketId/escalate', authorize('SolveProblem'),TicketController.escalateTicket);



router.get('/tickets/assigned', authorize('SolveProblem'),TicketController.getAssignedTickets);



router.get('/users', authorize('ManageUsers'), UserController.getUserList);

// ฟอร์มเพิ่มผู้ใช้ใหม่
router.get('/users/add', authorize('ManageUsers'), UserController.getAddUserForm);
router.post('/users/add', authorize('ManageUsers'), UserController.addUser);

// ฟอร์มแก้ไขผู้ใช้
router.get('/users/edit/:userId', authorize('ManageUsers'), UserController.getUserById);
router.post('/users/edit/:userId', authorize('ManageUsers'), UserController.updateUser);

// ลบผู้ใช้
router.post('/users/delete/:userId', authorize('ManageUsers'), UserController.deleteUser);

router.get('/edit-queue', authorize('editQueue'),TicketController.editQueue);
router.post('/update-queue', authorize('editQueue'),TicketController.updateQueue);

router.get('/chat/:ticketId', authorize('Chat'),ChatController.getChat);
router.post('/chat/:ticketId', authorize('Chat'),ChatController.postChat);


router.post('/tickets/:ticketId/verify',authorize('Verify'), TicketController.verifyTicket);
router.post('/tickets/:ticketId/not-verify',authorize('Verify'), TicketController.notVerifyTicket);



module.exports = router;
