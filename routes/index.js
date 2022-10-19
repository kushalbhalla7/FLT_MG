const router = require('express').Router();
const userRoutes = require('./user');
const postRoutes = require('./post');

router.use('/api/v1/user', userRoutes);
router.use('/api/v1/post', postRoutes);

module.exports = router;
