const Post = require("../models/postModel");
const { AppError } = require("../utils/AppError.js");
const APIFeatures = require("../utils/APIFeatures.js");
const catchAsync = require("../utils/catchAsync.js");

const postController = {
  createPost: catchAsync(async (req, res, next) => {
    const { title, body, image, deleteURL } = req.body;
    console.log(req.body);
    const userId = req.user.id;
    const newPost = await Post.create({
      title,
      body,
      image,
      deleteURL,
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
  }),

  getAllPosts: catchAsync(async (req, res, next) => {
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
  }),

  getPost: async (req, res, next) => {},

  updatePost: catchAsync(async (req, res, next) => {
    const { title, body, image, deleteURL } = req.body;
    const { postId } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(postId, {
      title,
      body,
      image,
      deleteURL
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
  }),

  deletePost: catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    const deleteResponse = await fetch(post.deleteURL, {
      method: 'GET'
    });
    if (!deleteResponse.ok) {
      return next(new AppError('Image not deleted from cloudinary', 404));
    }
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return next(new AppError('Post not deleted', 404));
    }
    return res.status(200).json({
      status: 'success',
      data: null
    });
  }),

  createPosts: catchAsync(async (req, res, next) => {
    const { posts } = req.body;
    const userId = req.user.id;
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
  })

}


module.exports = postController;