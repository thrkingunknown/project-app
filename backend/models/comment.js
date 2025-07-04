var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  content: String,
  img: {
    data: Buffer,
    contentType: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var CommentModel = mongoose.model('Comment', commentSchema);
module.exports = CommentModel;
