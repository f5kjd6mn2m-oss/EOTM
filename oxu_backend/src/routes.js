const router = require('express').Router();

router.get('/health', (_req, res) => res.json({ success: true, status: 'ok', time: new Date().toISOString() }));

router.use('/auth', require('./modules/auth/auth.routes'));
router.use('/teachers', require('./modules/teachers/teacher.routes'));
router.use('/students', require('./modules/students/student.routes'));
router.use('/groups', require('./modules/groups/group.routes'));
router.use('/subjects', require('./modules/subjects/subject.routes'));
router.use('/lessons', require('./modules/lessons/lesson.routes'));
router.use('/schedule', require('./modules/schedule/schedule.routes'));

module.exports = router;
