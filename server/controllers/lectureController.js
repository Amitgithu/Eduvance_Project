const Lecture = require('../models/Lecture');
const Users = require('../models/User');
const Course = require('../models/Course');

exports.addLecture = async (req, res) => {
    const { title, video, notes, assignment } = req.body;
    // console.log(req.body);
  
    if (!title || !video || !notes) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
      const lecture = await Lecture.create({ title, video, notes, assignment });
  
      res.status(201).json({ message: 'Lecture added successfully.', lecture });
    } catch (error) {
      console.error('Error adding lecture:', error);
      res.status(500).json({ message: 'Server error' });
    }
};
  
exports.updateLecture = async (req, res) => {
  const { lectureId } = req.params;
  const { title, video, notes, assignment } = req.body;

  // if (!title || !video || !notes|| !assignment) {
  //   return res.status(400).json({ message: 'All fields are required.' });
  // }

  try {
    if (!lectureId) {
      return res.status(400).json({ message: 'Lecture ID is required for updating a lecture.' });
    }
    const lecture = await Lecture.findByIdAndUpdate(lectureId, { title, video, notes, assignment }, { new: true });
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    res.status(200).json({ message: 'Lecture updated successfully', lecture });
  } catch (error) {
    console.error('Error updating lecture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
  
exports.getCompletedLectures = async (req,res) => {
  try {
    const userId = req.user.userId;
    const user = await Users.findById(userId).populate('completedLectures');

    // Extract the completed lectures from the user object
    const completedLectures = user.completedLectures;

    res.json({ success: true, completedLectures });
  } catch (error) {
    console.error('Error fetching completed lectures:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch completed lectures' });
  }
}


exports.getCertificate = async(req,res) => {
  const userId = req.user.userId;
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId).populate('lectureIds')
    const user = await Users.findById(userId).populate('completedLectures')
    // console.log(course,"   AND   ",user)
    // console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const courseExists = user.courses.includes(courseId);
    if(!courseExists || !Course) return res.status(404).json({ message: 'Course not found' });

    const findCommonDocuments = (array1, array2) => {
      // console.log("1-> ",array1)
      // console.log("2-> ",array2)
      const commonDocuments = [];
      if(!array1 || !array2) return commonDocuments;
      array1.forEach(docA => {
        // console.log('tis sis',docA._id.toString())
        const foundDoc = array2.find(docB => docB._id.toString() === docA._id.toString());
        if (foundDoc) {
          commonDocuments.push(foundDoc._id);
        }
      });
      return commonDocuments;
    };
    // console.log("fjsdfjkfk",user.completedLectures, course.lectureIds)
    const commonDocuments = findCommonDocuments(user.completedLectures, course.lectureIds);
    // console.log("CMN",commonDocuments.length,course.lectureIds.length)
    const progress = commonDocuments.length/course.lectureIds.length;
    if(progress!=1) return res.status(404).json({ message: 'Certificate Not Found' });
        
    // console.log(course.title)
    return res.status(201).json({ success : true, message : 'You are Elligible.', "username" : user.username, "coursename" : course.title});
  } catch (error) {
    console.error('Error adding course:', error);
    return res.status(500).json({ message: 'Server error' });
  }


}



  