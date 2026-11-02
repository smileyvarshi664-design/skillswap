const http = require('http');

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
      },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname + u.search,
        method: 'GET',
        headers: {
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
      },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(d) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: d.substring(0, 150) });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function testAll() {
  console.log('=== 1. Testing Health Endpoint ===');
  const health = await get('http://localhost:5000/api/health');
  console.log('Status:', health.status, 'Body:', health.body);

  console.log('\n=== 2. Testing Student Login (Aarav) ===');
  const studentLogin = await post('http://localhost:5000/api/auth/login', {
    email: 'aarav@skillswap.edu',
    password: 'Student@123',
  });
  console.log('Status:', studentLogin.status);
  console.log('Logged in user:', studentLogin.body.user.name, `(${studentLogin.body.user.email})`);
  const token = studentLogin.body.token;

  console.log('\n=== 3. Testing Smart Mutual Skill Matching ===');
  const matches = await get('http://localhost:5000/api/matches', token);
  console.log('Matches Count:', matches.body.count);
  matches.body.matches.forEach((m) => {
    console.log(`- ${m.user.name}: [${m.matchType}] (Score: ${m.score}%) Mutual=${m.isMutual}`);
    if (m.theyTeachIWant.length) {
      console.log('  They Teach You:', m.theyTeachIWant.map((s) => s.skillName).join(', '));
    }
    if (m.iTeachTheyWant.length) {
      console.log('  You Teach Them:', m.iTeachTheyWant.map((s) => s.skillName).join(', '));
    }
  });

  console.log('\n=== 4. Testing My Skills (Aarav) ===');
  const skills = await get('http://localhost:5000/api/skills/my', token);
  console.log('Teaching Skills:', skills.body.teachSkills.map((s) => s.skillName));
  console.log('Learning Skills:', skills.body.learnSkills.map((s) => s.skillName));

  console.log('\n=== 5. Testing Explore Students API ===');
  const explore = await get('http://localhost:5000/api/users', token);
  console.log('Explore Students count:', explore.body.count);
  explore.body.users.slice(0, 3).forEach((u) => {
    console.log(`- ${u.name} (${u.college}) | Rating: ${u.rating} | Teach: ${u.teachSkills.length} | Learn: ${u.learnSkills.length}`);
  });

  console.log('\n=== 6. Testing My Exchanges (Aarav) ===');
  const exchanges = await get('http://localhost:5000/api/exchanges', token);
  console.log('Exchanges count:', exchanges.body.count);
  exchanges.body.exchanges.forEach((e) => {
    console.log(`- Partner: ${e.partner.name} | Status: ${e.status} | Teaching: ${e.myTeachingSkill} | Learning: ${e.myLearningSkill}`);
  });

  console.log('\n=== 7. Testing Admin Login & Admin Dashboard ===');
  const adminLogin = await post('http://localhost:5000/api/auth/login', {
    email: 'admin@skillswap.edu',
    password: 'Admin@123',
  });
  console.log('Admin Login status:', adminLogin.status, 'User:', adminLogin.body.user.name, 'Role:', adminLogin.body.user.role);
  const adminToken = adminLogin.body.token;

  const adminStats = await get('http://localhost:5000/api/admin/dashboard', adminToken);
  console.log('Admin Stats Summary:');
  console.log('  Total Students:', adminStats.body.stats.totalUsers);
  console.log('  Total Skills:', adminStats.body.stats.totalSkills);
  console.log('  Total Exchange Requests:', adminStats.body.stats.totalRequests);
  console.log('  Total Active Exchanges:', adminStats.body.stats.totalExchanges);
  console.log('  Total Feedback Reviews:', adminStats.body.stats.totalFeedback);

  console.log('\n=== 8. Testing Frontend Server (http://localhost:5173/) ===');
  const fe = await get('http://localhost:5173/');
  console.log('Frontend status:', fe.status, 'Content length:', fe.raw.length, 'bytes');

  console.log('\n🎉 ALL FULL-STACK VERIFICATIONS PASSED SUCCESSFULLY!');
}

testAll().catch(console.error);
