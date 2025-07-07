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

// Environment variable validation
function validateEnvironmentVariables() {
    const required = [
        'MONGODB_URI',
        'JWT_SECRET',
        'EMAIL_USER',
        'EMAIL_PASSWORD',
        'FRONTEND_URL'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }
}

// Configuration summary function
function logConfiguration() {
    console.log('\n=== Server Configuration ===');
    console.log(`Platform: ${process.env.PLATFORM_NAME || 'FAXRN'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Port: ${process.env.PORT || 3000}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not configured'}`);
    console.log(`Database: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
    console.log(`Email Service: ${process.env.EMAIL_SERVICE || 'Host/Port configuration'}`);
    console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
    console.log(`CORS Credentials: ${process.env.CORS_CREDENTIALS || 'true'}`);
    console.log('============================\n');
}

// Validate environment variables on startup
validateEnvironmentVariables();

var port = process.env.PORT || 3000;

var app = express();

// Email transporter configuration
var emailConfig = {
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
};

// Use service if specified, otherwise use host/port configuration
if (process.env.EMAIL_SERVICE) {
    emailConfig.service = process.env.EMAIL_SERVICE;
} else {
    emailConfig.host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    emailConfig.port = parseInt(process.env.EMAIL_PORT) || 587;
    emailConfig.secure = process.env.EMAIL_SECURE === 'true';
}

var transporter = nodemailer.createTransport(emailConfig);

app.use(express.json({ limit: process.env.API_REQUEST_LIMIT || '100mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: process.env.API_URL_LIMIT || '50mb'
}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: process.env.CORS_CREDENTIALS === 'true' || true
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

app.get('/', (req, res) => {
    res.json({
        message: `${process.env.PLATFORM_NAME || 'FAXRN'} Backend API is running!`,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0'
    });
});

// Health check endpoint for Docker
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Configuration check endpoint (for debugging - remove in production)
app.get('/config-check', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ error: 'Not found' });
    }

    res.json({
        platform: process.env.PLATFORM_NAME || 'FAXRN',
        environment: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
        frontendUrl: process.env.FRONTEND_URL || 'Not configured',
        emailService: process.env.EMAIL_SERVICE || 'Host/Port configuration',
        corsCredentials: process.env.CORS_CREDENTIALS || 'true',
        jwtConfigured: !!process.env.JWT_SECRET,
        databaseConfigured: !!process.env.MONGODB_URI,
        emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
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
        var verificationTokenExpiresHours = parseInt(process.env.VERIFICATION_TOKEN_EXPIRES_HOURS) || 24;
        var verificationTokenExpires = new Date(Date.now() + verificationTokenExpiresHours * 60 * 60 * 1000);

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
        var verificationTokenExpiresHours = parseInt(process.env.VERIFICATION_TOKEN_EXPIRES_HOURS) || 24;
        var verificationTokenExpires = new Date(Date.now() + verificationTokenExpiresHours * 60 * 60 * 1000);

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
})
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
app.post("/posts/:id/like", checkAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userIndex = post.likedBy.indexOf(req.user.id);

    if (userIndex > -1) {
      //unlike
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
    //  like
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

// Start the server
app.listen(port, '0.0.0.0', () => {
  logConfiguration();
  console.log(`${process.env.PLATFORM_NAME || 'FAXRN'} Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
