const router = require('express').Router();
const AuthController = require('app/Controllers/authController');
const authCheck = require('middlewares/authMiddleware');
const accessCheck = require('middlewares/accessMiddleware');


router.post('/login', AuthController.login);

router.get('/profile', authCheck, AuthController.getMyProfile);
router.post('/change-password', authCheck, AuthController.changePassword);

module.exports = router;