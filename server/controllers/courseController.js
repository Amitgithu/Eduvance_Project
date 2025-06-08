const Lecture = require('../models/Lecture');
const Users = require('../models/User');
const Course = require('../models/Course');

exports.search = async (req,res) => {
    try {
      const { q } = req.query; 
      const query = { title: { $regex: q, $options: "i" } };
      // console.log(query)
      const courses = await Course.find(query);
      // console.log(courses)
  
      return res.status(200).json(courses);
    } catch (error) {
        console.error('Error searching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }


  exports.addCourse = async (req, res) => {
    const { title, description, price, mentor, image, lectureIds } = req.body;
    const userId = req.user.userId;
  
    if (!title || !description || !price || !mentor || !image || !lectureIds) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      const course = await Course.create({ title, description, price, mentor, image, lectureIds });
      const user = await Users.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Not Admin' });
      }
  
      user.createdcourse.push(course._id);
      await user.save();
  
      res.status(201).json({ message: 'Course added successfully.', course });
    } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };



  exports.getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (error) {
      console.error('Error getting all courses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getMyCourses = async (req, res) => {
    const userId = req.user.userId;
    // console.log("userid",userId)
    try {
      const user = await Users.findById(userId).populate('courses');
      res.json(user.courses);
    } catch (error) {
      console.error('Error getting user courses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  exports.getcreatedCourses = async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await Users.findById(userId).populate('createdcourse');
      res.json(user.createdcourse);
    } catch (error) {
      console.error('Error getting user courses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  
  exports.getCourseContent = async (req, res) => {
    const { courseId } = req.params;
    try {
      const course = await Course.findById(courseId).populate('lectureIds');
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      console.error('Error getting course content:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.getSingleCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      console.error('Error getting course content:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  exports.saveFeedback = async (req, res) => {
    const { courseId } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user.userId;
    if (!feedback || feedback.length < 5) {
      return res.status(400).json({ message: 'Feedback must not be empty and must contain at least 5 characters.' });
    }
  
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const existingFeedbackIndex = course.feedbacks.findIndex(fb => fb.user.toString() === userId);
      const currentDate = new Date();
      if (existingFeedbackIndex !== -1) {
        course.feedbacks[existingFeedbackIndex].rating = rating;
        course.feedbacks[existingFeedbackIndex].feedback = feedback;
        course.feedbacks[existingFeedbackIndex].createdAt = currentDate;
      } else {
        course.feedbacks.push({
          user: userId,
          rating,
          feedback
        });
      }
  
      await course.save();
  
      res.json({ message: 'Feedback saved successfully', course });
    } catch (error) {
      console.error('Error saving feedback:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  
  exports.showFeedback = async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const course = await Course.findById(courseId).populate('feedbacks.user');
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const feedbacks = course.feedbacks;
      res.json({ feedbacks });
    } catch (error) {
      console.error('Error fetching ratings and comments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  
  
  exports.getCreatedcourseById = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.userId; 
    try {
      const course = await Course.findById(courseId).populate('lectureIds');
      // console.log(course)
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userCreatedCourseIds = user.createdcourse.map(course => course.toString());
      if (!userCreatedCourseIds.includes(courseId)) {
        return res.status(403).json({ message: 'You are not authorized to access this course' });
      }
  
      res.json({ course });
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.editCourse = async (req, res) => {
    const { courseId } = req.params; 
  
    const { title, description, price, mentor, image, lectureIds } = req.body;
    console.log(price);
    console.log(typeof price);
    const userId = req.user.userId; 
  
    if (!title || !description || !price || !mentor || !image || !lectureIds) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    try {
      const course = await Course.findById(courseId);
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userCreatedCourse = user.createdcourse.map(course => course.toString());
      if (!userCreatedCourse.includes(courseId)) {
        return res.status(403).json({ message: 'You are not authorized to edit this course' });
      }
      const updatedCourse = await Course.findByIdAndUpdate(courseId, { title, description, price, mentor, image, lectureIds }, { new: true });
  
      res.send({ message: 'Course updated successfully.', course: updatedCourse });
    } 
    
    catch (error) {
      console.error('Error updating course:', error);
      res.status(500).send({ message: 'Server error' });
    }
  };
  
  exports.deleteCourse=async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.user.userId;
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if(user.role!=='admin'){
        return res.status(404).json({ message: 'Not Admin' });
      }
  
      await Course.findByIdAndDelete(courseId);
      res.json({ message: 'Course deleted successfully' });
    } 
    catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  
  // Route to show all courses and the details of users enrolled in each
  exports.getallenrolleduser = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const user = await Users.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Not Admin' });
      }
  
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
  
      // Send the course details as a response
      res.status(200).json({
        message: 'Course enrollments retrieved successfully.',
        courses: courseDetails
      });
    } catch (error) {
      console.error('Error fetching course enrollments:', error.message || error);
      res.status(500).json({ message: 'Failed to retrieve course enrollments. Please try again later.', error: error.message });
    }
  };
  
  exports.addCourseProgress = async (req, res) => {
    const { lectureId } = req.body;
  
    if (!lectureId) {
      return res.status(400).json({ message: 'Lecture ID is required.' });
    }
  
    const userId = req.user.userId;
  
    try {
      await Users.findByIdAndUpdate(userId, { $addToSet: { completedLectures: lectureId } });
      const updatedLecture = await Lecture.findById(lectureId);
      res.status(201).json({ success: true, lecture: updatedLecture, message: 'Course progress added successfully.' });
    } catch (error) {
      console.error('Error adding course progress:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  
  