const router = require('express').Router();
const userController = require('../controllers/user');
const { requestValidator } = require('../middleware/validation');
const { registerUser, login, updateUser } = require('../validations/user');
const { validateTokenAndVerifyUser, validateTokenAndVerifyAdmin } = require('../middleware/isAuth');

router.post('/register', requestValidator(registerUser, 'body'), userController.register);
router.post('/login', requestValidator(login, 'body'), userController.login);
router.get('/profile', validateTokenAndVerifyUser, userController.getUserProfile);
router.put('/verify', validateTokenAndVerifyAdmin, userController.verifyUser);
router.put('/update', validateTokenAndVerifyUser, requestValidator(updateUser, 'body'), userController.updateUser);
router.delete('/delete', validateTokenAndVerifyUser, userController.deleteUser);

module.exports = router;
