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

var port = process.env.PORT || 3000;

var app = express();

// email transporter setup
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// email verification helper function
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

// auth middleware
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

// auth routes
app.post('/register', async (req, res) => {
    try {
        var { username, email, password, role } = req.body;

        // check if user already exists
        var existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.send('User with this email already exists');
        }

        var hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

        // generate verification token
        var verificationToken = crypto.randomBytes(32).toString('hex');
        var verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

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

        // send verification email
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

        // check if email is verified
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

// email verification endpoint
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

        // update user as verified
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

// resend verification email endpoint
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

        // generate new verification token
        var verificationToken = crypto.randomBytes(32).toString('hex');
        var verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        // send verification email
        await sendVerificationEmail(email, verificationToken, user.username);

        res.send('Verification email sent! Please check your inbox.');
    } catch (error) {
        console.log('Resend verification error:', error);
        res.send('Error sending verification email: ' + error);
    }
});

// post routes
app.get('/posts', async (req, res) => {
    try {
        var posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
        res.send(posts);
    } catch (error) {
        res.send('Error getting posts: ' + error);
    }
});

app.post('/posts', checkAuth, async (req, res) => {
    try {
        var post = new Post({
            title: req.body.title,
            content: req.body.content,
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

// comment routes
app.post('/posts/:id/comments', checkAuth, async (req, res) => {
    try {
        var comment = new Comment({
            content: req.body.content,
            author: req.user.id,
            post: req.params.id
        });
        await comment.save();
        
        // add comment to post
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

// user routes
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

app.listen(port, () => {
  console.log(`${process.env.PLATFORM_NAME} Server is running on http://localhost:${port}`);
});
