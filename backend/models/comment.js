var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  content: String,
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
  },
  isEditted: {
    type: Boolean,
    default: false
  }
});

var CommentModel = mongoose.model('Comment', commentSchema);
module.exports = CommentModel;
