const express = require('express');

const userController = require('./../controllers/userController');
const authenticateUser = require('./../middlewares/authenticateUser');

const router = express.Router();

router
  .route("/")
  .patch(authenticateUser, userController.updateUser)
  .delete(authenticateUser, userController.deleteUser);

router.post('/signup', userController.signUp);
router.post('/login', userController.login);

router.patch('/updatePassword', authenticateUser, userController.updatePassword);

router.post('/forgotPassword', userController.forgetPassword);
router.patch('/resetPassword/:token', userController.resetPassword);

module.exports = router;