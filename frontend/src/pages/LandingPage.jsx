import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Sparkles,
  ArrowRight,
  Code,
  Palette,
  Camera,
  Video,
  BarChart2,
  MessageCircle,
  Globe,
  Award,
  Zap,
  Users,
  CheckCircle2,
  ShieldCheck,
  Star,
} from 'lucide-react';

const LandingPage = () => {
  const categories = [
    { name: 'Programming', icon: <Code size={24} color="#6366f1" />, count: 'Python, C++, Java, JS' },
    { name: 'Designing', icon: <Palette size={24} color="#ec4899" />, count: 'Figma, UI/UX, Graphic Design' },
    { name: 'Video Editing', icon: <Video size={24} color="#f97316" />, count: 'Premiere Pro, DaVinci, Reels' },
    { name: 'Data Science', icon: <BarChart2 size={24} color="#06b6d4" />, count: 'Pandas, ML, Analytics' },
    { name: 'Photography', icon: <Camera size={24} color="#8b5cf6" />, count: 'Lightroom, Portrait, Framing' },
    { name: 'Communication', icon: <MessageCircle size={24} color="#10b981" />, count: 'Public Speaking, Interview Prep' },
    { name: 'Languages', icon: <Globe size={24} color="#3b82f6" />, count: 'Spanish, German, Japanese' },
    { name: 'Marketing', icon: <Award size={24} color="#eab308" />, count: 'SEO, Content & Growth' },
  ];

  const steps = [
    {
      num: '01',
      title: 'List Your Skills',
      desc: 'Add the skills you already excel at (what you can teach) and the skills you are passionate to learn.',
      badge: 'Step 1',
    },
    {
      num: '02',
      title: 'Get Smart Matched',
      desc: 'Our intelligent matching algorithm pairs you with students who want what you know and teach what you need!',
      badge: 'Step 2',
    },
    {
      num: '03',
      title: 'Swap & Level Up',
      desc: 'Connect, schedule sessions, exchange knowledge for free, and build verified ratings on your student profile.',
      badge: 'Step 3',
    },
  ];

  const benefits = [
    {
      title: '100% Free Peer Learning',
      desc: 'No expensive bootcamps or hourly tutoring fees. Exchange your existing skills without paying money.',
      icon: <Zap size={22} color="#6366f1" />,
    },
    {
      title: 'Mutual Match Discovery',
      desc: 'If you know Python and want UI/UX, we instantly connect you with designers who want to learn Python.',
      icon: <Users size={22} color="#3b82f6" />,
    },
    {
      title: 'Resume & Portfolio Booster',
      desc: 'Gain real hands-on teaching experience and verified peer endorsements to showcase on LinkedIn.',
      icon: <Award size={22} color="#10b981" />,
    },
    {
      title: 'Verified Student Network',
      desc: 'Collaborate with passionate college students across departments, campuses, and disciplines.',
      icon: <ShieldCheck size={22} color="#8b5cf6" />,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          padding: '5rem 0 4.5rem',
          background: 'radial-gradient(ellipse at top, #eef2ff 0%, #f8fafc 70%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '960px' }}>
          {/* Top Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              backgroundColor: '#e0e7ff',
              color: '#4338ca',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.75rem',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.15)',
            }}
          >
            <Sparkles size={16} color="#6366f1" />
            <span>The #1 Peer-to-Peer Campus Skill Exchange Platform</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '3.6rem',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
              color: '#0f172a',
              marginBottom: '1.5rem',
            }}
          >
            Share Your Skills, <br />
            <span className="gradient-text">Learn Something New.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.25rem',
              color: '#475569',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            SkillSwap enables college students to teach skills they already know and master new
            skills from peers completely free. Student A teaches Python; Student B teaches UI/UX Design —
            everyone grows together!
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">
              <span>Explore Students & Skills</span>
            </Link>
          </div>

          {/* Platform Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#4f46e5' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Free Skill Exchange</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563eb' }}>Mutual</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Smart Match Pairing</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669' }}>10+</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>College Categories</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#d97706' }}>5★</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Peer Verified Ratings</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
              How SkillSwap Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Exchanging knowledge with fellow students has never been this seamless and structured.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {steps.map((st) => (
              <div
                key={st.num}
                className="card card-interactive"
                style={{
                  padding: '2.2rem 1.8rem',
                  position: 'relative',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: '#c7d2fe',
                    lineHeight: 1,
                    marginBottom: '1rem',
                  }}
                >
                  {st.num}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '0.75rem' }}>
                  {st.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills Categories */}
      <section style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Campus Learning Domains
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
              Featured Skill Categories
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Whatever you want to teach or master, you'll find eager student peers ready to collaborate.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="card card-interactive"
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cat.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{cat.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Why Students Love SkillSwap
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
              Benefits of Peer Skill Exchange
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              A revolutionary platform turning college campuses into dynamic knowledge-sharing hubs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {benefits.map((b, i) => (
              <div
                key={i}
                className="card card-interactive"
                style={{
                  padding: '2rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  {b.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Example Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#eef2ff' }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '1rem' }}>
            The Perfect Skill Exchange in Action
          </h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
            See how two college students instantly solve each other's learning goals:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {/* Student A */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                backgroundColor: '#ffffff',
                border: '2px solid #c7d2fe',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
                  alt="Aarav"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontWeight: 800, color: '#1e1b4b' }}>Aarav Sharma</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>CS • 3rd Year</span>
                </div>
              </div>
              <div style={{ marginBottom: '0.6rem' }}>
                <span className="badge badge-teach">Teaches: Python Programming</span>
              </div>
              <div>
                <span className="badge badge-learn">Wants: UI/UX Design</span>
              </div>
            </div>

            {/* Match Indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Sparkles size={26} />
              </div>
              <span style={{ fontWeight: 800, color: '#4f46e5', fontSize: '0.9rem' }}>
                100% MUTUAL MATCH
              </span>
            </div>

            {/* Student B */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                backgroundColor: '#ffffff',
                border: '2px solid #bfdbfe',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                  alt="Priya"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontWeight: 800, color: '#1e1b4b' }}>Priya Patel</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Design • 2nd Year</span>
                </div>
              </div>
              <div style={{ marginBottom: '0.6rem' }}>
                <span className="badge badge-teach">Teaches: UI/UX Design</span>
              </div>
              <div>
                <span className="badge badge-learn">Wants: Python Programming</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '4rem 0 2rem',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2.5rem',
              marginBottom: '3rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>SkillSwap</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                The premier peer-to-peer student skill exchange platform empowering university students
                to teach what they know and master what they desire.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#f1f5f9' }}>
                Platform Navigation
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <li><Link to="/explore" style={{ color: 'inherit' }}>Explore Student Profiles</Link></li>
                <li><Link to="/#how-it-works" style={{ color: 'inherit' }}>How Exchanges Work</Link></li>
                <li><Link to="/login" style={{ color: 'inherit' }}>Student Sign In</Link></li>
                <li><Link to="/register" style={{ color: 'inherit' }}>Create Free Account</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#f1f5f9' }}>
                College Support
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Built with passion for students, hackathons, and campus innovation clubs.
                Email: support@skillswap.edu
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid #1e293b',
              paddingTop: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.825rem',
              color: '#64748b',
            }}
          >
            <span>© 2026 SkillSwap Platform. All rights reserved.</span>
            <span>Made for College Students • Peer Education Initiative</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
