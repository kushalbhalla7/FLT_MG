const router = require('express').Router();
const { requestValidator } = require('../middleware/validation');
const { addPost, editPost } = require('../validations/post');
const { validateTokenAndVerifyUser, validateTokenAndVerifyAdmin, validateToken } = require('../middleware/isAuth');
const postController = require('../controllers/post');

router.post('/add', validateTokenAndVerifyUser, requestValidator(addPost, 'body'), postController.addPost);
router.put('/edit', validateTokenAndVerifyUser, requestValidator(editPost, 'body'), postController.updatePost);
router.delete('/delete', validateTokenAndVerifyUser, postController.deletePost);
router.get('/view', validateToken, postController.getPost);
router.put('/like', validateTokenAndVerifyUser, postController.likePost);

router.get('/view/user/all', validateTokenAndVerifyUser, postController.getUserPosts);

module.exports = router;
