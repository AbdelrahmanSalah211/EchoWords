const express = require('express');

const userController = require('./../controllers/userController');
const authenticateUser = require('./../middlewares/authenticateUser');

const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);

router.post('/forgotPassword', userController.forgetPassword);
router.patch('/resetPassword/:token', userController.resetPassword);

router.patch('/updatePassword', authenticateUser, userController.updatePassword);
router.patch('/updateMe', authenticateUser, userController.updateUser);
router.delete('/deleteUser', authenticateUser, userController.deleteUser);

module.exports = router;