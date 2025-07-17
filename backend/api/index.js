require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('./db');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const port = 3000;

const app = express();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

const sendVerificationEmail = async (email, token, username) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Welcome to ${process.env.PLATFORM_NAME} - Verify Your Email`,
        html: `
            <h2>Welcome to ${process.env.PLATFORM_NAME}!</h2>
            <p>Hi ${username},</p>
            <p>Thank you for registering with ${process.env.PLATFORM_NAME}. Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with ${process.env.PLATFORM_NAME}, please ignore this email.</p>
            <br>
            <p>Best regards,<br>The ${process.env.PLATFORM_NAME} Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email.');
    }
};

const sendPasswordResetEmail = async (email, token, username) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `${process.env.PLATFORM_NAME} - Password Reset Request`,
        html: `
            <h2>Password Reset Request</h2>
            <p>Hi ${username},</p>
            <p>You requested to reset your password for your ${process.env.PLATFORM_NAME} account. Please click the link below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <br>
            <p>Best regards,<br>The ${process.env.PLATFORM_NAME} Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email.');
    }
};

app.get('/', (req, res) => {
    res.json({
        message: 'FAXRN Backend API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);


        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            role: role || 'user',
            verificationToken: verificationToken,
            verificationTokenExpires: verificationTokenExpires,
            isVerified: false
        });

        await user.save();

        await sendVerificationEmail(email, verificationToken, username);

        res.status(201).json({ message: 'User registered successfully! Please check your email to verify your account.' });
    } catch (error) {
        console.log('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in. Check your inbox for verification link.' });
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.json({
            token: token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                email: user.email,
                isVerified: user.isVerified,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.log('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Verification token is required' });
        }
        
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully! You can now login to your account.' });
    } catch (error) {
        console.log('Email verification error:', error);
        res.status(500).json({ message: 'Error verifying email', error: error.message });
    }
});

app.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        await sendVerificationEmail(email, verificationToken, user.username);

        res.status(200).json({ message: 'Verification email sent! Please check your inbox.' });
    } catch (error) {
        console.log('Resend verification error:', error);
        res.status(500).json({ message: 'Error sending verification email', error: error.message });
    }
});

const forgotPasswordAttempts = new Map();

app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const now = Date.now();
        const attempts = forgotPasswordAttempts.get(email) || [];
        const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000);

        if (recentAttempts.length >= 3) {
            return res.status(429).json({ message: 'Too many password reset attempts. Please try again later.' });
        }

        recentAttempts.push(now);
        forgotPasswordAttempts.set(email, recentAttempts);

        const user = await User.findOne({ email: email });

        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpires = resetTokenExpires;
            await user.save();

            await sendPasswordResetEmail(email, resetToken, user.username);
        }

        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
        console.log('Forgot password error:', error);
        res.status(500).json({ message: 'Error sending password reset email', error: error.message });
    }
});

app.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully! You can now login with your new password.' });
    } catch (error) {
        console.log('Reset password error:', error);
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username profilePicture').sort({ createdAt: -1 });
        const postsWithImages = posts.map(post => {
            const postObject = post.toObject();
            if (postObject.img && postObject.img.data) {
                postObject.img = `data:${postObject.img.contentType};base64,${postObject.img.data.toString('base64')}`;
            }
            return postObject;
        });
        res.json(postsWithImages);
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'Error getting posts', message: error.message });
    }
});

app.post('/posts', checkAuth, async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const post = new Post({
            title,
            content,
            author: req.user.id,
        });

        if (image) {
            const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                post.img = {
                    data: Buffer.from(matches[2], 'base64'),
                    contentType: matches[1],
                };
            }
        }

        await post.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username profilePicture')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username profilePicture' }
            });
        
        if (post) {
            const postObject = post.toObject();
            if (postObject.img && postObject.img.data) {
                postObject.img = `data:${postObject.img.contentType};base64,${postObject.img.data.toString('base64')}`;
            }
            res.status(200).json(postObject);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error getting post', error: error.message });
    }
});

app.put('/posts/:id', checkAuth, async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const post = await Post.findById(req.params.id);

        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        post.title = title;
        post.content = content;

        if (image) {
            const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                post.img = {
                    data: Buffer.from(matches[2], 'base64'),
                    contentType: matches[1],
                };
            }
        }

        await post.save();
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
});

app.delete('/posts/:id', checkAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
});

app.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.json([]);
        }

        const searchRegex = new RegExp(q.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');

        const posts = await Post.find({
            $or: [
                { title: { $regex: searchRegex } },
                { content: { $regex: searchRegex } }
            ]
        })
        .populate('author', 'username')
        .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ error: 'Error searching posts', message: error.message });
    }
});

app.post('/posts/:id/comments', checkAuth, async (req, res) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            author: req.user.id,
            post: req.params.id
        });
        await comment.save();

        await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: comment._id }
        });

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
});

app.delete('/comments/:id', checkAuth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
});

app.put('/comments/:id', checkAuth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await Comment.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
});
app.get('/users', checkAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        const posts = await Post.find({ author: req.params.id }).populate('author', 'username profilePicture');
        res.status(200).json({ user: user, posts: posts });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
});

app.delete('/users/:id', checkAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

app.put('/profile', checkAuth, async (req, res) => {
    try {
        const { username, password } = req.body;
        const userId = req.user.id;

        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Username is required' });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

        if (password && password.trim() && password.trim().length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username.trim() !== user.username) {
            const existingUser = await User.findOne({ username: username.trim() });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username.trim();
        }

        if (password && password.trim()) {
            const hashedPassword = await bcrypt.hash(password.trim(), parseInt(process.env.BCRYPT_ROUNDS) || 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile: ' + error.message });
    }
});

app.post('/users/:id/profile-picture', checkAuth, async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const userId = req.params.id;

        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePicture = profilePicture;
        await user.save();

        res.status(200).json({ message: 'Profile picture updated successfully', profilePicture: user.profilePicture });
    } catch (error) {
        res.status(500).send('Error updating profile picture: ' + error);
    }
});
app.post("/posts/:id/like", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userIndex = post.likedBy.indexOf(req.user.id);

    if (userIndex > -1) {
      post.likes--;
      post.likedBy.splice(userIndex, 1);
      await post.save();
      res.json({
        message: 'Post unliked successfully',
        likes: post.likes,
        likedBy: post.likedBy,
        action: 'unliked'
      });
    } else {
      post.likes++;
      post.likedBy.push(req.user.id);
      await post.save();
      res.json({
        message: 'Post liked successfully',
        likes: post.likes,
        likedBy: post.likedBy,
        action: 'liked'
      });
    }
  } catch (error) {
    console.error('Error liking/unliking post:', error);
    res.status(500).json({ error: 'Error processing like: ' + error.message });
  }
});

app.post('/posts/:id/report', checkAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Reason for reporting is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot report your own post' });
    }

    const existingReport = post.reports.find(report => report.user.toString() === req.user.id);
    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this post' });
    }

    post.reports.push({ user: req.user.id, reason });
    await post.save();

    res.status(200).json({ message: 'Post reported successfully' });
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).send('Error reporting post: ' + error);
  }
});

app.get('/reported-posts', checkAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const posts = await Post.find({ "reports.0": { $exists: true } })
      .populate('author', 'username profilePicture')
      .populate('reports.user', 'username');

    const sortedPosts = posts.sort((a, b) => b.reports.length - a.reports.length);

    res.status(200).json(sortedPosts);
  } catch (error) {
    console.error('Error getting reported posts:', error);
    res.status(500).send('Error getting reported posts: ' + error);
  }
});

app.delete('/posts/:postId/reports/:reportId', checkAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { postId, reportId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.reports.pull({ _id: reportId });
    await post.save();

    res.status(200).json({ message: 'Report removed successfully' });
  } catch (error) {
    console.error('Error removing report:', error);
    res.status(500).send('Error removing report: ' + error);
  }
});

module.exports = app;
