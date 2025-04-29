const Post = require("../models/postModel");
const { AppError } = require("../utils/AppError.js");
const APIFeatures = require("../utils/APIFeatures.js");

const postController = {
  createPost: async (req, res, next) => {
    const { title, body, image } = req.body;
    const userId = req.user.id;
    try {
      const newPost = await Post.create({
        title,
        body,
        image,
        user: userId
      });
      if (!newPost) {
        return next(new AppError('Post not created', 404));
      }
      return res.status(201).json({
        status: 'success',
        data: {
          post: newPost
        }
      });
    } catch (error) {
      console.error("Error creating post: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      const features = new APIFeatures (Post.find(), req.query).filter().sort().limitFields().paginate();
      const posts = await features.query.populate('user');
      if (!posts) {
        return next(new AppError('No posts found', 404));
      }
      return res.status(200).json({
        status: 'success',
        results: posts.length,
        data: {
          posts
        }
      });
    } catch (error) {
      console.error("Error getting all posts: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  getPost: async (req, res, next) => {},

  updatePost: async (req, res, next) => {
    const { title, body, image } = req.body;
    const { postId } = req.params;
    try {
      const updatedPost = await Post.findByIdAndUpdate(postId, {
        title,
        body,
        image,
      }, {
        new: true,
        runValidators: true
      });
      if (!updatedPost) {
        return next(new AppError('Post not updated', 404));
      }
      return res.status(200).json({
        status: 'success',
        data: {
          post: updatedPost
        }
      });
    } catch (error) {
      console.error("Error updating post: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  deletePost: async (req, res, next) => {
    const { postId } = req.params;
    try {
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
        return next(new AppError('Post not deleted', 404));
      }
      return res.status(200).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      console.error("Error deleting post: ", error);
      return next(new AppError('Internal server error', 500));
    }
  },

  createPosts: async (req, res, next) => {
    const { posts } = req.body;
    const userId = req.user.id;
    try {
      const newPosts = await Post.insertMany(posts.map(post => ({ ...post, user: userId })));
      if (!newPosts) {
        return next(new AppError('Posts not created', 404));
      }
      return res.status(201).json({
        status: 'success',
        data: {
          posts: newPosts
        }
      });
    } catch (error) {
      console.error("Error creating posts: ", error);
      return next(new AppError('Internal server error', 500));
    }
  }

}


module.exports = postController;