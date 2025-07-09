require('dotenv').config();
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
require('./db');
var User = require('./models/user');
var Post = require('./models/post');
var Comment = require('./models/comment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

var port = 3000;

var app = express();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

var sendVerificationEmail = async (email, token, username) => {
    var verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    var mailOptions = {
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
        throw error;
    }
};

// Send password reset email
var sendPasswordResetEmail = async (email, token, username) => {
    var resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    var mailOptions = {
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
        throw error;
    }
};

app.get('/', (req, res) => {
    res.json({
        message: 'FAXRN Backend API is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

var checkAuth = (req, res, next) => {
    try {
        var token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.send('No token provided');
        }
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.send('Invalid token');
    }
};

app.post('/register', async (req, res) => {
    try {
        var { username, email, password, role } = req.body;

        var existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.send('User with this email already exists');
        }

        var hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);


        var verificationToken = crypto.randomBytes(32).toString('hex');
        var verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        var user = new User({
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

        res.send('User registered successfully! Please check your email to verify your account.');
    } catch (error) {
        console.log('Registration error:', error);
        res.send('Error registering user: ' + error);
    }
});

app.post('/login', async (req, res) => {
    try {
        var { email, password } = req.body;
        var user = await User.findOne({ email: email });
        if (!user) {
            return res.send('User not found');
        }

        var isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send('Invalid password');
        }

        if (!user.isVerified) {
            return res.send('Please verify your email before logging in. Check your inbox for verification link.');
        }

        var token = jwt.sign({
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
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.log('Login error:', error);
        res.send('Error logging in: ' + error);
    }
});

app.get('/verify-email', async (req, res) => {
    try {
        var { token } = req.query;

        if (!token) {
            return res.send('Verification token is required');
        }
        
        var user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.send('Invalid or expired verification token');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.send('Email verified successfully! You can now login to your account.');
    } catch (error) {
        console.log('Email verification error:', error);
        res.send('Error verifying email: ' + error);
    }
});

app.post('/resend-verification', async (req, res) => {
    try {
        var { email } = req.body;

        var user = await User.findOne({ email: email });
        if (!user) {
            return res.send('User not found');
        }

        if (user.isVerified) {
            return res.send('Email is already verified');
        }

        var verificationToken = crypto.randomBytes(32).toString('hex');
        var verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        await sendVerificationEmail(email, verificationToken, user.username);

        res.send('Verification email sent! Please check your inbox.');
    } catch (error) {
        console.log('Resend verification error:', error);
        res.send('Error sending verification email: ' + error);
    }
});

// Simple rate limiting for forgot password (in production, use Redis or proper rate limiting middleware)
var forgotPasswordAttempts = new Map();

// Forgot password - send reset email
app.post('/forgot-password', async (req, res) => {
    try {
        var { email } = req.body;

        if (!email) {
            return res.send('Email is required');
        }

        // Rate limiting: max 3 attempts per email per 15 minutes
        var now = Date.now();
        var attempts = forgotPasswordAttempts.get(email) || [];
        var recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000); // 15 minutes

        if (recentAttempts.length >= 3) {
            return res.send('Too many password reset attempts. Please try again later.');
        }

        // Record this attempt
        recentAttempts.push(now);
        forgotPasswordAttempts.set(email, recentAttempts);

        var user = await User.findOne({ email: email });

        // Always return the same success message to prevent user enumeration
        // Only send email if user actually exists
        if (user) {
            // Generate reset token
            var resetToken = crypto.randomBytes(32).toString('hex');
            var resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpires = resetTokenExpires;
            await user.save();

            await sendPasswordResetEmail(email, resetToken, user.username);
        }

        // Always return the same message regardless of whether user exists
        res.send('If an account with that email exists, a password reset link has been sent.');
    } catch (error) {
        console.log('Forgot password error:', error);
        res.send('Error sending password reset email: ' + error);
    }
});

// Reset password with token
app.post('/reset-password', async (req, res) => {
    try {
        var { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.send('Token and new password are required');
        }

        if (newPassword.length < 6) {
            return res.send('Password must be at least 6 characters long');
        }

        var user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.send('Invalid or expired reset token');
        }

        // Hash new password
        var hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 10);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();

        res.send('Password reset successfully! You can now login with your new password.');
    } catch (error) {
        console.log('Reset password error:', error);
        res.send('Error resetting password: ' + error);
    }
});

app.get('/posts', async (req, res) => {
    try {
        var posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).json({ error: 'Error getting posts', message: error.message });
    }
});

app.post('/posts', checkAuth, async (req, res) => {
    try {
        var post = new Post({
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
            author: req.user.id
        });
        await post.save();
        res.send('Post created successfully');
    } catch (error) {
        res.send('Error creating post: ' + error);
    }
});

app.get('/posts/:id', async (req, res) => {
    try {
        var post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' }
            });
        res.send(post);
    } catch (error) {
        res.send('Error getting post: ' + error);
    }
});

app.put('/posts/:id', checkAuth, async (req, res) => {
    try {
        var post = await Post.findById(req.params.id);
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.send('Not authorized');
        }
        await Post.findByIdAndUpdate(req.params.id, req.body);
        res.send('Post updated successfully');
    } catch (error) {
        res.send('Error updating post: ' + error);
    }
});

app.delete('/posts/:id', checkAuth, async (req, res) => {
    try {
        var post = await Post.findById(req.params.id);
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.send('Not authorized');
        }
        await Post.findByIdAndDelete(req.params.id);
        res.send('Post deleted successfully');
    } catch (error) {
        res.send('Error deleting post: ' + error);
    }
});

app.get('/search', async (req, res) => {
    try {
        var { q } = req.query;

        if (!q || q.trim() === '') {
            return res.json([]);
        }

        var searchRegex = new RegExp(q.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');

        var posts = await Post.find({
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
        var comment = new Comment({
            content: req.body.content,
            author: req.user.id,
            post: req.params.id
        });
        await comment.save();

        await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: comment._id }
        });

        res.send('Comment added successfully');
    } catch (error) {
        res.send('Error adding comment: ' + error);
    }
});

app.delete('/comments/:id', checkAuth, async (req, res) => {
    try {
        var comment = await Comment.findById(req.params.id);
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.send('Not authorized');
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.send('Comment deleted successfully');
    } catch (error) {
        res.send('Error deleting comment: ' + error);
    }
});

app.put('/comments/:id', checkAuth, async (req, res) => {
    try {
        var comment = await Comment.findById(req.params.id);
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.send('Not authorized');
        }
        await Comment.findByIdAndUpdate(req.params.id, req.body);
        res.send('Comment updated successfully');
    } catch (error) {
        res.send('Error updating comment: ' + error);
    }
});
app.get('/users', checkAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.send('Admin access required');
        }
        var users = await User.find().select('-password');
        res.send(users);
    } catch (error) {
        res.send('Error getting users: ' + error);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id).select('-password');
        var posts = await Post.find({ author: req.params.id }).populate('author', 'username');
        res.send({ user: user, posts: posts });
    } catch (error) {
        res.send('Error getting user: ' + error);
    }
});

app.delete('/users/:id', checkAuth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.send('Admin access required');
        }
        await User.findByIdAndDelete(req.params.id);
        res.send('User deleted successfully');
    } catch (error) {
        res.send('Error deleting user: ' + error);
    }
});

app.put('/profile', checkAuth, async (req, res) => {
    try {
        var { username, password } = req.body;
        var userId = req.user.id;

        if (!username || username.trim() === '') {
            return res.status(400).json({ message: 'Username is required' });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

        if (password && password.trim() && password.trim().length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        var user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username.trim() !== user.username) {
            var existingUser = await User.findOne({ username: username.trim() });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username.trim();
        }

        if (password && password.trim()) {
            var hashedPassword = await bcrypt.hash(password.trim(), parseInt(process.env.BCRYPT_ROUNDS) || 10);
            user.password = hashedPassword;
        }

        await user.save();

        // Return success response with updated user info (excluding password)
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

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`${process.env.PLATFORM_NAME} Server is running on http://localhost:${port}`);
  });
}
module.exports = app;
