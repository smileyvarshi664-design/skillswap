const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Skill = require('./models/Skill');
const ExchangeRequest = require('./models/ExchangeRequest');
const Exchange = require('./models/Exchange');
const Feedback = require('./models/Feedback');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Skill.deleteMany({});
    await ExchangeRequest.deleteMany({});
    await Exchange.deleteMany({});
    await Feedback.deleteMany({});
    console.log('[Seed] Cleared old data.');

    // Common password
    const salt = await bcrypt.genSalt(10);
    const studentPassword = await bcrypt.hash('Student@123', salt);
    const adminPassword = await bcrypt.hash('Admin@123', salt);

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@skillswap.edu',
      password: adminPassword,
      college: 'Global Institute of Technology',
      department: 'Computer Science & Engineering',
      year: 'Postgraduate',
      bio: 'Platform Administrator overseeing student skill exchanges and quality control.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'admin',
      isActive: true,
    });

    // 2. Create Students
    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@skillswap.edu',
      password: studentPassword,
      college: 'National Institute of Technology',
      department: 'Computer Science',
      year: '3rd Year',
      bio: 'Passionate about backend architectures, Python automation, and algorithms. Looking to learn clean UI/UX design to build full products.',
      profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      role: 'student',
      isActive: true,
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@skillswap.edu',
      password: studentPassword,
      college: 'Institute of Fine Arts & Design',
      department: 'Designing',
      year: '2nd Year',
      bio: 'Figma and UI/UX design enthusiast! Love creating modern micro-interactions and sleek web apps. Eager to learn Python for data and logic.',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      role: 'student',
      isActive: true,
    });

    const student3 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@skillswap.edu',
      password: studentPassword,
      college: 'Apex Engineering University',
      department: 'Data Science',
      year: '4th Year',
      bio: 'Machine learning practitioner, pandas, and data visualization geek. Working on thesis and want to improve public speaking and communication skills.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      role: 'student',
      isActive: true,
    });

    const student4 = await User.create({
      name: 'Ananya Iyer',
      email: 'ananya@skillswap.edu',
      password: studentPassword,
      college: 'Metropolitan School of Media',
      department: 'Communication',
      year: '2nd Year',
      bio: 'Debater, presentation coach, and content marketer. Happy to help peers master interview preparation and communication. Looking to learn Data Science basics!',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      role: 'student',
      isActive: true,
    });

    const student5 = await User.create({
      name: 'Rohan Mehta',
      email: 'rohan@skillswap.edu',
      password: studentPassword,
      college: 'Centennial Media Academy',
      department: 'Film & Media',
      year: '3rd Year',
      bio: 'Video editor and color grader using Premiere Pro & DaVinci Resolve. Can teach video storytelling. Want to learn Web Development to host portfolio.',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      role: 'student',
      isActive: true,
    });

    const student6 = await User.create({
      name: 'Sneha Kulkarni',
      email: 'sneha@skillswap.edu',
      password: studentPassword,
      college: 'Tech State Institute',
      department: 'Information Technology',
      year: '3rd Year',
      bio: 'Frontend developer passionate about React, Tailwind, and CSS animations. Looking to learn Video Editing for YouTube tutorials.',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      role: 'student',
      isActive: true,
    });

    console.log('[Seed] Users created.');

    // 3. Create Skills
    const skills = [
      // Aarav (Teaches Python, Web Dev | Learns UI/UX, Video Editing)
      {
        userId: student1._id,
        skillName: 'Python Programming',
        category: 'Programming',
        description: 'Object-oriented programming, data structures, algorithms, and scripting in Python 3.',
        type: 'teach',
        proficiencyLevel: 'Advanced',
      },
      {
        userId: student1._id,
        skillName: 'Web Development',
        category: 'Web Development',
        description: 'Node.js, Express, REST APIs, and database fundamentals.',
        type: 'teach',
        proficiencyLevel: 'Intermediate',
      },
      {
        userId: student1._id,
        skillName: 'UI/UX Design',
        category: 'Designing',
        description: 'Want to learn design systems, user flows, wireframing, and Figma prototyping.',
        type: 'learn',
        proficiencyLevel: 'Beginner',
      },
      {
        userId: student1._id,
        skillName: 'Video Editing',
        category: 'Video Editing',
        description: 'Interested in learning video pacing, basic sound design, and Reels editing.',
        type: 'learn',
        proficiencyLevel: 'Beginner',
      },

      // Priya (Teaches UI/UX Design, Designing | Learns Python, Web Development)
      {
        userId: student2._id,
        skillName: 'UI/UX Design',
        category: 'Designing',
        description: 'Modern Figma workflows, component libraries, typography, color palettes, and UX research.',
        type: 'teach',
        proficiencyLevel: 'Advanced',
      },
      {
        userId: student2._id,
        skillName: 'Designing',
        category: 'Designing',
        description: 'Graphic design principles, visual hierarchy, and logo design.',
        type: 'teach',
        proficiencyLevel: 'Intermediate',
      },
      {
        userId: student2._id,
        skillName: 'Python Programming',
        category: 'Programming',
        description: 'Eager to understand programming basics, loops, and building small helper scripts.',
        type: 'learn',
        proficiencyLevel: 'Beginner',
      },
      {
        userId: student2._id,
        skillName: 'Web Development',
        category: 'Web Development',
        description: 'Want to learn how frontend code connects with modern backend services.',
        type: 'learn',
        proficiencyLevel: 'Beginner',
      },

      // Rahul (Teaches Data Science | Learns Communication)
      {
        userId: student3._id,
        skillName: 'Data Science',
        category: 'Data Science',
        description: 'Data wrangling with Pandas, NumPy, scikit-learn models, and Jupyter notebook analysis.',
        type: 'teach',
        proficiencyLevel: 'Advanced',
      },
      {
        userId: student3._id,
        skillName: 'Communication',
        category: 'Communication',
        description: 'Looking to improve presentation delivery, vocal clarity, and storytelling.',
        type: 'learn',
        proficiencyLevel: 'Beginner',
      },

      // Ananya (Teaches Communication | Learns Data Science)
      {
        userId: student4._id,
        skillName: 'Communication',
        category: 'Communication',
        description: 'Public speaking, debate technique, confidence building, and professional pitch deck presentations.',
        type: 'teach',
        proficiencyLevel: 'Advanced',
      },
      {
        userId: student4._id,
        skillName: 'Data Science',
        category: 'Data Science',
        description: 'Want to understand basic statistical terms, charts, and data interpretation for media research.',
        type: 'learn',
        proficiencyLevel: 'Beginner',
      },

      // Rohan (Teaches Video Editing, Photography | Learns Web Development)
      {
        userId: student5._id,
        skillName: 'Video Editing',
        category: 'Video Editing',
        description: 'Premiere Pro editing, B-roll transitions, keyframing, and cinematic color correction.',
        type: 'teach',
        proficiencyLevel: 'Advanced',
      },
      {
        userId: student5._id,
        skillName: 'Photography',
        category: 'Photography',
        description: 'Manual camera controls, ISO, shutter speed, composition rule of thirds, and Lightroom presets.',
        type: 'teach',
        proficiencyLevel: 'Intermediate',
      },
      {
        userId: student5._id,
        skillName: 'Web Development',
        category: 'Web Development',
        description: 'Looking to learn HTML, CSS, and basic JavaScript to build my creative portfolio.',
        type: 'learn',
        proficiencyLevel: 'Beginner',
      },

      // Sneha (Teaches Web Development | Learns Video Editing)
      {
        userId: student6._id,
        skillName: 'Web Development',
        category: 'Web Development',
        description: 'React.js component design, modern hooks, responsive layouts, and interactive state management.',
        type: 'teach',
        proficiencyLevel: 'Advanced',
      },
      {
        userId: student6._id,
        skillName: 'Video Editing',
        category: 'Video Editing',
        description: 'Want to make tech tutorial clips and reels showcasing developer tips.',
        type: 'learn',
        proficiencyLevel: 'Beginner',
      },
    ];

    await Skill.insertMany(skills);
    console.log('[Seed] Skills created.');

    // 4. Create an Accepted Exchange between Aarav and Priya
    const req1 = await ExchangeRequest.create({
      senderId: student1._id,
      receiverId: student2._id,
      offeredSkill: 'Python Programming',
      requestedSkill: 'UI/UX Design',
      message: 'Hey Priya! I saw your amazing UI designs. I can teach you Python fundamentals in exchange for Figma & UI/UX lessons!',
      status: 'Accepted',
    });

    const exchange1 = await Exchange.create({
      requestId: req1._id,
      studentOne: student1._id,
      studentTwo: student2._id,
      skillOne: 'Python Programming',
      skillTwo: 'UI/UX Design',
      status: 'In Progress',
    });

    // 5. Create a Completed Exchange between Rahul and Ananya with Feedback
    const req2 = await ExchangeRequest.create({
      senderId: student3._id,
      receiverId: student4._id,
      offeredSkill: 'Data Science',
      requestedSkill: 'Communication',
      message: 'Hi Ananya, would love to exchange Data Science tutoring for presentation coaching.',
      status: 'Accepted',
    });

    const exchange2 = await Exchange.create({
      requestId: req2._id,
      studentOne: student3._id,
      studentTwo: student4._id,
      skillOne: 'Data Science',
      skillTwo: 'Communication',
      status: 'Completed',
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Feedback for exchange2
    await Feedback.create({
      exchangeId: exchange2._id,
      reviewerId: student3._id,
      receiverId: student4._id,
      rating: 5,
      comment: 'Ananya was extraordinary! She helped me structure my research presentation and gave actionable feedback that boosted my confidence immensely.',
    });

    await Feedback.create({
      exchangeId: exchange2._id,
      reviewerId: student4._id,
      receiverId: student3._id,
      rating: 5,
      comment: 'Rahul explained complex statistical algorithms so intuitively! He used real-world examples and was very patient with my questions. 10/10 recommend!',
    });

    // 6. Create a Pending Request from Rohan to Sneha
    await ExchangeRequest.create({
      senderId: student5._id,
      receiverId: student6._id,
      offeredSkill: 'Video Editing',
      requestedSkill: 'Web Development',
      message: 'Hey Sneha! I would love to teach you video editing techniques if you can guide me on building a responsive React website.',
      status: 'Pending',
    });

    console.log('[Seed] Seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Accounts:');
    console.log('Admin:   admin@skillswap.edu  / Admin@123');
    console.log('Student 1 (Aarav): aarav@skillswap.edu  / Student@123');
    console.log('Student 2 (Priya): priya@skillswap.edu  / Student@123');
    console.log('Student 3 (Rahul): rahul@skillswap.edu  / Student@123');
    console.log('Student 4 (Ananya): ananya@skillswap.edu / Student@123');
    console.log('Student 5 (Rohan): rohan@skillswap.edu  / Student@123');
    console.log('Student 6 (Sneha): sneha@skillswap.edu  / Student@123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
