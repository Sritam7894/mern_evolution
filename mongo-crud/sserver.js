const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB (Replace with your own MongoDB URI if needed)
mongoose.connect('mongodb://localhost:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define the Student schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

// CRUD Operations

// 1. CREATE a new student
app.post('/students', async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const newStudent = new Student({ name, age, grade });
    await newStudent.save();
    res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (err) {
    res.status(500).json({ message: 'Error creating student', error: err });
  }
});

// 2. READ students with age > 21
app.get('/students/age/greater-than-21', async (req, res) => {
  try {
    const students = await Student.find({ age: { $gt: 21 } });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving students', error: err });
  }
});

// 3. UPDATE a student's details (by ID)
app.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, grade } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, grade },
      { new: true }
    );
    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    res.status(500).json({ message: 'Error updating student', error: err });
  }
});

// 4. DELETE a student (by ID)
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
