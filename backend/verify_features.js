const http = require('http');

function apiCall(endpoint, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runComprehensiveVerification() {
  console.log('====================================================');
  console.log('  SkillSwap End-to-End Feature Verification Suite');
  console.log('====================================================\n');

  const results = [];

  function record(feature, passed, details = '') {
    results.push({ feature, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} | ${feature.padEnd(35)} | ${details}`);
  }

  try {
    // 1. Health check & Connectivity
    const health = await apiCall('/api/health');
    record('Backend Health & API Server', health.status === 200, `Status ${health.status} - ${health.data?.app}`);

    // 2. Student Registration & Validation
    const testEmail = `test_student_${Date.now()}@skillswap.edu`;
    const regRes = await apiCall('/api/auth/register', 'POST', {
      name: 'Verification Bot',
      email: testEmail,
      password: 'TestPassword@123',
      confirmPassword: 'TestPassword@123',
      college: 'Tech University',
      department: 'Computer Science',
      year: '3rd Year',
      bio: 'Verification user created during system check.',
    });
    record('Student Registration', regRes.status === 201 && regRes.data?.success, `Created user ID: ${regRes.data?.user?.id}`);
    const testToken = regRes.data?.token;
    const testUserId = regRes.data?.user?.id;

    // 3. Student Login
    const loginRes = await apiCall('/api/auth/login', 'POST', {
      email: testEmail,
      password: 'TestPassword@123',
    });
    record('Student Login Authentication', loginRes.status === 200 && !!loginRes.data?.token, `Logged in as ${loginRes.data?.user?.name}`);

    // 4. Student Profile Management
    const profileRes = await apiCall(
      '/api/users/profile',
      'PUT',
      {
        bio: 'Updated bio: Passionate about Web and Mobile architecture.',
        college: 'State Technical University',
      },
      testToken
    );
    record('User Profile Management', profileRes.status === 200 && profileRes.data?.user?.bio?.includes('Updated bio'), 'Bio successfully updated');

    // 5. Add Skills (Teach and Learn)
    const teachSkillRes = await apiCall(
      '/api/skills',
      'POST',
      {
        skillName: 'Flutter App Development',
        category: 'Programming',
        type: 'teach',
        proficiencyLevel: 'Advanced',
        description: 'Cross-platform app development using Dart & Flutter.',
      },
      testToken
    );
    const learnSkillRes = await apiCall(
      '/api/skills',
      'POST',
      {
        skillName: 'Deep Learning & PyTorch',
        category: 'Data Science',
        type: 'learn',
        proficiencyLevel: 'Beginner',
        description: 'Neural networks and machine learning.',
      },
      testToken
    );
    const addedSkills = teachSkillRes.status === 201 && learnSkillRes.status === 201;
    record('Add Skills (Teach & Learn)', addedSkills, 'Added 1 teaching skill and 1 learning skill');

    // 6. View My Skills & Explore Skills
    const mySkillsRes = await apiCall('/api/skills/my', 'GET', null, testToken);
    const exploreSkillsRes = await apiCall('/api/skills/explore', 'GET');
    const skillsOk = mySkillsRes.data?.teachSkills?.length > 0 && exploreSkillsRes.data?.categories?.length > 0;
    record('Explore & View Skills', skillsOk, `My skills: ${mySkillsRes.data?.teachSkills?.length} teach, ${mySkillsRes.data?.learnSkills?.length} learn | Popular skills listed: ${exploreSkillsRes.data?.popularTeach?.length}`);

    // 7. Existing Seed Student Login & Skill Matching
    const aaravLogin = await apiCall('/api/auth/login', 'POST', {
      email: 'aarav@skillswap.edu',
      password: 'Student@123',
    });
    const aaravToken = aaravLogin.data?.token;
    const matchesRes = await apiCall('/api/matches', 'GET', null, aaravToken);
    record('Skill Matching Algorithm', matchesRes.status === 200 && matchesRes.data?.count > 0, `Found ${matchesRes.data?.count} matched peer students`);

    // 8. Ongoing Exchanges
    const exchangesRes = await apiCall('/api/exchanges', 'GET', null, aaravToken);
    record('Ongoing Exchanges Retrieval', exchangesRes.status === 200, `Active exchanges found: ${exchangesRes.data?.count}`);

    // 9. Feedback and Ratings
    const feedbackRes = await apiCall(`/api/feedback/${aaravLogin.data?.user?.id}`, 'GET', null, aaravToken);
    record('Feedback and Ratings Display', feedbackRes.status === 200, `Retrieved ratings for user: ${feedbackRes.data?.averageRating || 5}★`);

    // 10. Admin Login & Dashboard
    const adminLogin = await apiCall('/api/auth/login', 'POST', {
      email: 'admin@skillswap.edu',
      password: 'Admin@123',
    });
    const adminToken = adminLogin.data?.token;
    const adminDashRes = await apiCall('/api/admin/dashboard', 'GET', null, adminToken);
    const adminUsersRes = await apiCall('/api/admin/users', 'GET', null, adminToken);
    const adminOk = adminDashRes.status === 200 && adminUsersRes.data?.users?.length > 0;
    record('Admin Dashboard & User Management', adminOk, `Platform stats: ${adminDashRes.data?.stats?.totalUsers} users, ${adminDashRes.data?.stats?.totalSkills} skills`);

    // Clean up temporary verification user
    if (testUserId) {
      const User = require('./models/User');
      const Skill = require('./models/Skill');
      const mongoose = require('mongoose');
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap');
      await User.findByIdAndDelete(testUserId);
      await Skill.deleteMany({ user: testUserId });
      await mongoose.disconnect();
      console.log('\n🧹 Verification cleanup: Removed temporary test student and skills.');
    }

    console.log('\n====================================================');
    const totalPassed = results.filter((r) => r.passed).length;
    console.log(`Summary: ${totalPassed} / ${results.length} Core Features Verified Successfully!`);
    console.log('====================================================');
  } catch (err) {
    console.error('Verification error:', err);
  }
}

runComprehensiveVerification();
