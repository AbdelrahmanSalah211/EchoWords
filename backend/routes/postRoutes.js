const express = require("express");

const postController = require("../controllers/postController");
const authenticateUser = require("./../middlewares/authenticateUser");

const router = express.Router();

router
  .route("/")
  .get(postController.getAllPosts)
  .post(authenticateUser, postController.createPost);
  // .post(authenticateUser, postController.createPosts);

router
  .route("/:postId")
  .patch(authenticateUser, postController.updatePost)
  .delete(authenticateUser, postController.deletePost);

module.exports = router;
