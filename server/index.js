const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');
// const seed = require("./seed")
const multer = require('multer');
const quizRoutes = require('./routes/quizRoutes');
// const PdfDetail = require('./controllers/PdfDetail');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const Users = require('./models/User');
const Course = require('./models/Course');

const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lectureRoutes = require('./routes/lectureRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/files", express.static("files"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// seed()

console.log("📦 Mongo URI:", process.env.MONGODB_URI); // Debug log

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uuidv4()+".pdf");
  },
});


const upload = multer({storage : storage})

app.post("/upload-files", upload.single("file"), async (req, res) => {
  try {
    // console.log(req.file);
    const title = req.body.title;
    const fileName = req.file.filename;
    // await PdfDetail.create({ title: title, pdf: fileName });
    res.send({ status: "ok", "filename" : fileName });
  } catch (error) {
    // console.error("Error uploading file:", error);
    res.status(500).json({ status: "error", message: "Failed to upload file" });
  }
});
  

// Use routes
app.use(userRoutes);
app.use(courseRoutes);
app.use(lectureRoutes);
app.use(quizRoutes);

const razorpay = new Razorpay({
  key_id: process.env.key,
	key_secret: process.env.key_secret
});


app.post('/razorpay/payment',authMiddleware.verifyToken, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.userId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const amount = course.price * 100; // Converting to paise (Indian currency)
    console.log(typeof amount);
    console.log(amount);

    if (amount === 0) {
      try {
        const user = await Users.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        console.log("User Found");
    
        if (user.courses.includes(courseId)) {
          return res.status(400).json({ message: 'You are already enrolled in this course.' });
        }
        user.courses.push(courseId);
        await user.save();
    
        return res.status(200).json({ message: 'Course enrolled successfully.' });
      } catch (error) {
        console.error('Error enrolling course:', error);
        return res.status(500).json({ message: 'Failed to enroll course. Please try again later.' });
      }
    }


    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'ankitdwivedi36307@gmail.com',
      payment_capture: 1,
    };

    razorpay.orders.create(options, async (err, order) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ success: false, msg: 'Something went wrong!' });
      }
      
      res.status(200).send({
        success: true,
        msg: 'Order Created',
        order_id: order.id,
        amount: amount,
        key_id: process.env.key,
        course_name: course.title,
        description: course.description,
        contact: user.mobile,
        name: user.username,
        email: user.email
      });
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ success: false, msg: 'Failed to create payment. Please try again later.' });
  }
});

app.post('/razorpay/payment/success', authMiddleware.verifyToken, async (req, res) => {
  const { courseId, orderId, paymentId } = req.body;
  const userId = req.user.userId;

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    // console.log(payment);

    if (payment.status === 'captured') {
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.courses.includes(courseId)) {
        return res.status(400).json({ message: 'You are already enrolled in this course.' });
      }
      user.courses.push(courseId);
      await user.save();
  
      res.json({ message: 'Course enrolled successfully.' });
    } 
  } catch (error) {
    console.error('Error handling payment success:', error);
    res.status(500).json({ message: 'Failed to process payment. Please try again later.' });
  }
});



// Route to show all courses and the details of users enrolled in each
app.get('/courses/enrollments', async (req, res) => {
  try {
    const courses = await Course.find({}).select('title description price mentor');

    const courseDetails = [];

    for (const course of courses) {
      const enrolledUsers = await Users.find({ courses: course._id }).select('username email mobile');

      const enrolledUserDetails = enrolledUsers.map(user => ({
        username: user.username,
        email: user.email,
        mobile: user.mobile
      }));

      courseDetails.push({
        courseTitle: course.title,
        courseDescription: course.description,
        coursePrice: course.price,
        mentor: course.mentor,
        enrolledUsersCount: enrolledUsers.length,
        enrolledUsers: enrolledUserDetails
      });
    }

    res.status(200).json({
      message: 'Course enrollments retrieved successfully.',
      courses: courseDetails
    });
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    res.status(500).json({ message: 'Failed to retrieve course enrollments. Please try again later.' });
  }
});



