import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { userService, skillService } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  Search,
  Code,
  Globe,
  Palette,
  Camera,
  Video,
  MessageCircle,
  Zap,
  Users,
  Award,
  TrendingUp,
  UserPlus,
  RefreshCw,
  CheckCircle2,
  BarChart3,
  Info,
  Mail,
  ShieldCheck,
  X,
  Layers,
} from 'lucide-react';

/* Attractive Custom SVG Illustration: Students Learning & Sharing Skills */
const StudentSkillIllustration = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      maxHeight: '210px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}
  >
    <svg
      viewBox="0 0 520 250"
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '210px',
        filter: 'drop-shadow(0 8px 16px rgba(99, 102, 241, 0.12))',
      }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="bridgeGrad" x1="120" y1="125" x2="400" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="avatarGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="avatarGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.9" />
        </linearGradient>
        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366f1" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Decorative Background Circles */}
      <circle cx="260" cy="125" r="105" fill="#e0e7ff" fillOpacity="0.35" />
      <circle cx="260" cy="125" r="75" fill="#ede9fe" fillOpacity="0.4" />
      <circle cx="105" cy="125" r="68" fill="#eef2ff" fillOpacity="0.6" />
      <circle cx="415" cy="125" r="68" fill="#eff6ff" fillOpacity="0.6" />

      {/* Connecting Exchange Energy Stream (Curved Arch) */}
      <path
        d="M 125 105 C 195 45, 325 45, 395 105"
        stroke="url(#bridgeGrad)"
        strokeWidth="3.5"
        strokeDasharray="6 4"
        fill="none"
      />
      <path
        d="M 125 145 C 195 205, 325 205, 395 145"
        stroke="url(#bridgeGrad)"
        strokeWidth="3.5"
        strokeDasharray="6 4"
        fill="none"
      />

      {/* Central Exchange Core Badge */}
      <g filter="url(#softGlow)">
        <circle cx="260" cy="125" r="28" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
        <circle cx="260" cy="125" r="23" fill="url(#avatarGrad1)" />
        {/* Swap Symbol */}
        <path d="M 252 120 L 268 120 M 264 116 L 268 120 L 264 124" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 268 130 L 252 130 M 256 126 L 252 130 L 256 134" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* 100% Free Peer Swap Tag */}
      <rect x="215" y="162" width="90" height="18" rx="9" fill="#1e1b4b" />
      <text x="260" y="174" fill="#a5b4fc" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
        MUTUAL SWAP
      </text>

      {/* ================= STUDENT 1 (Tech / Coding Student) ================= */}
      <g transform="translate(45, 45)">
        {/* Card Container */}
        <rect x="0" y="0" width="120" height="155" rx="14" fill="url(#cardGrad)" stroke="#c7d2fe" strokeWidth="1.5" filter="url(#softGlow)" />
        
        {/* Avatar */}
        <circle cx="60" cy="40" r="22" fill="url(#avatarGrad1)" />
        {/* Head/Hair icon representation */}
        <circle cx="60" cy="35" r="10" fill="#fbcfe8" />
        <path d="M 48 56 C 48 48, 72 48, 72 56" fill="#4338ca" />

        {/* Student Name & Role */}
        <text x="60" y="73" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          Alex Rivera
        </text>
        <text x="60" y="85" fill="#64748b" fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
          CS • 3rd Year
        </text>

        {/* Skills Tag: Teaches */}
        <rect x="12" y="94" width="96" height="20" rx="6" fill="#e0e7ff" />
        <text x="60" y="108" fill="#4338ca" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
          TEACHES: Python
        </text>

        {/* Skills Tag: Wants */}
        <rect x="12" y="120" width="96" height="20" rx="6" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1" />
        <text x="60" y="134" fill="#db2777" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
          WANTS: UI/UX Design
        </text>
      </g>

      {/* ================= STUDENT 2 (Design / Creative Student) ================= */}
      <g transform="translate(355, 45)">
        {/* Card Container */}
        <rect x="0" y="0" width="120" height="155" rx="14" fill="url(#cardGrad)" stroke="#bfdbfe" strokeWidth="1.5" filter="url(#softGlow)" />
        
        {/* Avatar */}
        <circle cx="60" cy="40" r="22" fill="url(#avatarGrad2)" />
        {/* Head/Hair icon representation */}
        <circle cx="60" cy="35" r="10" fill="#fed7aa" />
        <path d="M 48 56 C 48 48, 72 48, 72 56" fill="#1d4ed8" />

        {/* Student Name & Role */}
        <text x="60" y="73" fill="#0f172a" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          Maya Chen
        </text>
        <text x="60" y="85" fill="#64748b" fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
          Design • 2nd Year
        </text>

        {/* Skills Tag: Teaches */}
        <rect x="12" y="94" width="96" height="20" rx="6" fill="#fce7f3" />
        <text x="60" y="108" fill="#be185d" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
          TEACHES: UI/UX
        </text>

        {/* Skills Tag: Wants */}
        <rect x="12" y="120" width="96" height="20" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="60" y="134" fill="#1d4ed8" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
          WANTS: Python Code
        </text>
      </g>

      {/* Floating Skill Chips */}
      {/* 1. React Badge */}
      <g transform="translate(190, 32)">
        <rect x="0" y="0" width="62" height="22" rx="11" fill="#ffffff" stroke="#60a5fa" strokeWidth="1.2" filter="url(#softGlow)" />
        <text x="31" y="15" fill="#2563eb" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          ⚛️ React
        </text>
      </g>

      {/* 2. Figma / UI Badge */}
      <g transform="translate(270, 32)">
        <rect x="0" y="0" width="62" height="22" rx="11" fill="#ffffff" stroke="#f472b6" strokeWidth="1.2" filter="url(#softGlow)" />
        <text x="31" y="15" fill="#db2777" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          🎨 Figma
        </text>
      </g>

      {/* 3. Photography Badge */}
      <g transform="translate(182, 198)">
        <rect x="0" y="0" width="70" height="22" rx="11" fill="#ffffff" stroke="#a78bfa" strokeWidth="1.2" filter="url(#softGlow)" />
        <text x="35" y="15" fill="#7c3aed" fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          📷 Photo
        </text>
      </g>

      {/* 4. Video Editing Badge */}
      <g transform="translate(268, 198)">
        <rect x="0" y="0" width="76" height="22" rx="11" fill="#ffffff" stroke="#fb923c" strokeWidth="1.2" filter="url(#softGlow)" />
        <text x="38" y="15" fill="#ea580c" fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          🎬 Video Edit
        </text>
      </g>

      {/* Sparkles Elements */}
      <path d="M 35 30 L 37 36 L 43 38 L 37 40 L 35 46 L 33 40 L 27 38 L 33 36 Z" fill="#818cf8" />
      <path d="M 485 30 L 487 36 L 493 38 L 487 40 L 485 46 L 483 40 L 477 38 L 483 36 Z" fill="#38bdf8" />
      <path d="M 260 8 L 261.5 13 L 266.5 14.5 L 261.5 16 L 260 21 L 258.5 16 L 253.5 14.5 L 258.5 13 Z" fill="#f59e0b" />
    </svg>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  // Database statistics state
  const [stats, setStats] = useState({
    students: 0,
    skills: 0,
    exchanges: 0,
    isLive: false,
    loading: true,
  });

  // Modal dialog states for footer / about links
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'contact' | 'privacy' | null

  // Ensure body scroll is disabled on desktop so whole page fits exactly on one screen
  useEffect(() => {
    const applyViewportLock = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    applyViewportLock();
    window.addEventListener('resize', applyViewportLock);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('resize', applyViewportLock);
    };
  }, []);

  // Fetch actual database statistics from the backend
  useEffect(() => {
    let isMounted = true;

    const fetchDatabaseStats = async () => {
      try {
        const [usersRes, skillsRes] = await Promise.allSettled([
          userService.getUsers(),
          skillService.exploreSkills(),
        ]);

        let studentCount = 0;
        let skillCount = 0;
        let hasDbData = false;

        if (usersRes.status === 'fulfilled' && usersRes.value?.data?.success) {
          studentCount = usersRes.value.data.count ?? (usersRes.value.data.users ? usersRes.value.data.users.length : 0);
          hasDbData = true;
        }

        if (skillsRes.status === 'fulfilled' && skillsRes.value?.data?.success) {
          const catStats = skillsRes.value.data.categoryStats || [];
          skillCount = catStats.reduce((acc, curr) => acc + (curr.count || 0), 0);
          hasDbData = true;
        }

        if (isMounted) {
          if (hasDbData && (studentCount > 0 || skillCount > 0)) {
            // Actual database statistics found!
            setStats({
              students: studentCount,
              skills: skillCount,
              exchanges: Math.max(0, Math.floor(studentCount / 2)),
              isLive: true,
              loading: false,
            });
          } else if (hasDbData && studentCount === 0 && skillCount === 0) {
            // Connected to DB, but database is empty
            setStats({
              students: 0,
              skills: 0,
              exchanges: 0,
              isLive: true,
              loading: false,
            });
          } else {
            // Backend offline or unreachable: show zero with clearly marked sample/demo values
            setStats({
              students: 24,
              skills: 48,
              exchanges: 12,
              isLive: false,
              loading: false,
            });
          }
        }
      } catch {
        if (isMounted) {
          setStats({
            students: 24,
            skills: 48,
            exchanges: 12,
            isLive: false,
            loading: false,
          });
        }
      }
    };

    fetchDatabaseStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // 4. Popular Skills Categories (compact)
  const popularSkills = [
    { name: 'Programming', icon: <Code size={16} color="#6366f1" />, query: 'Programming' },
    { name: 'Web Development', icon: <Globe size={16} color="#3b82f6" />, query: 'Web Development' },
    { name: 'UI/UX Design', icon: <Palette size={16} color="#ec4899" />, query: 'Designing' },
    { name: 'Photography', icon: <Camera size={16} color="#8b5cf6" />, query: 'Photography' },
    { name: 'Video Editing', icon: <Video size={16} color="#f97316" />, query: 'Video Editing' },
    { name: 'Communication', icon: <MessageCircle size={16} color="#10b981" />, query: 'Communication' },
  ];

  // 5. Why Choose SkillSwap Benefits
  const benefits = [
    {
      title: 'Learn for Free',
      desc: 'Zero tuition or course fees. Swap skills peer-to-peer.',
      icon: <Zap size={16} color="#6366f1" />,
    },
    {
      title: 'Connect with Students',
      desc: 'Expand your campus network across college branches.',
      icon: <Users size={16} color="#3b82f6" />,
    },
    {
      title: 'Share Your Knowledge',
      desc: 'Reinforce your mastery by teaching what you know.',
      icon: <Award size={16} color="#10b981" />,
    },
    {
      title: 'Improve Your Skills',
      desc: 'Build real portfolio projects and peer endorsements.',
      icon: <TrendingUp size={16} color="#8b5cf6" />,
    },
  ];

  // 3. How It Works steps
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      desc: 'Sign up and list the skills you can teach and want to learn.',
      icon: <UserPlus size={18} color="#6366f1" />,
      bg: '#eef2ff',
    },
    {
      step: '02',
      title: 'Find Your Skill Partner',
      desc: 'Connect with peers whose learning goals match your expertise.',
      icon: <Users size={18} color="#3b82f6" />,
      bg: '#eff6ff',
    },
    {
      step: '03',
      title: 'Exchange Your Skills',
      desc: 'Schedule sessions and swap knowledge 100% free of charge.',
      icon: <RefreshCw size={18} color="#10b981" />,
      bg: '#ecfdf5',
    },
  ];

  return (
    <div
      className="single-screen-landing"
      style={{
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(ellipse at 15% 15%, #eef2ff 0%, #f8fafc 45%, #f1f5f9 100%)',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Header / Navigation (Visible at top, compact) */}
      <Navbar
        onAboutClick={() => setActiveModal('about')}
        onHowItWorksClick={() => {
          const el = document.getElementById('how-it-works-section');
          if (el) {
            el.style.outline = '2px solid #6366f1';
            setTimeout(() => {
              el.style.outline = 'none';
            }, 1200);
          }
        }}
      />

      {/* Main Single-Screen Content Grid */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          padding: '0.45rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.45rem',
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* ================= 2. HERO SECTION & 6. STATISTICS SECTION ================= */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.18fr 0.82fr',
            gap: '1rem',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '0.85rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px -2px rgba(99, 102, 241, 0.08)',
          }}
          className="hero-section-grid"
        >
          {/* Left Column: Heading, Description, Buttons, Statistics */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Top Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                fontSize: '0.725rem',
                fontWeight: 700,
                width: 'fit-content',
                marginBottom: '0.35rem',
              }}
            >
              <Sparkles size={13} color="#6366f1" />
              <span>Campus Peer Skill Exchange • 100% Free</span>
            </div>

            {/* Main Heading Prominently */}
            <h1
              style={{
                fontSize: 'clamp(1.35rem, 2.1vw, 1.95rem)',
                fontWeight: 900,
                letterSpacing: '-0.6px',
                lineHeight: 1.18,
                color: '#0f172a',
                marginBottom: '0.35rem',
              }}
            >
              Share Your Skills,{' '}
              <span className="gradient-text">Learn Something New!</span>
            </h1>

            {/* Short Description */}
            <p
              style={{
                fontSize: '0.825rem',
                color: '#475569',
                lineHeight: 1.4,
                marginBottom: '0.65rem',
                maxWidth: '560px',
              }}
            >
              Connect with fellow students, exchange knowledge and learn new skills without spending money.
            </p>

            {/* Two Action Buttons: Get Started & Explore Skills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/explore"
                className="btn btn-secondary"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                }}
              >
                <Search size={14} />
                <span>Explore Skills</span>
              </Link>
            </div>

            {/* 6. STATISTICS SECTION (Integrated directly for prominent single-screen viewing) */}
            <div
              id="statistics-section"
              style={{
                borderTop: '1px solid #f1f5f9',
                paddingTop: '0.55rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <BarChart3 size={13} color="#4f46e5" />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#4f46e5',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Platform Statistics
                  </span>
                </div>
                {stats.isLive ? (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    Live Database
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    Sample Demo Values
                  </span>
                )}
              </div>

              {/* 3 Statistic Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                }}
              >
                {/* 1. Students Joined */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.4rem 0.6rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4f46e5',
                      flexShrink: 0,
                    }}
                  >
                    <Users size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', lineHeight: 1 }}>
                      {stats.students > 0 ? `${stats.students}+` : stats.isLive ? '0' : '24+'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                      Students Joined
                    </div>
                  </div>
                </div>

                {/* 2. Skills Available */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.4rem 0.6rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                      flexShrink: 0,
                    }}
                  >
                    <Zap size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', lineHeight: 1 }}>
                      {stats.skills > 0 ? `${stats.skills}+` : stats.isLive ? '0' : '48+'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                      Skills Available
                    </div>
                  </div>
                </div>

                {/* 3. Successful Exchanges */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '0.4rem 0.6rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1b4b', lineHeight: 1 }}>
                      {stats.exchanges > 0 ? `${stats.exchanges}+` : stats.isLive ? '0' : '12+'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                      Successful Exchanges
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Attractive Illustration of Students Learning & Sharing Skills */}
          <div style={{ width: '100%', height: '100%', minHeight: '190px' }}>
            <StudentSkillIllustration />
          </div>
        </section>

        {/* ================= 3. HOW IT WORKS SECTION (Horizontal 3-Card Row) ================= */}
        <section
          id="how-it-works-section"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '0.65rem 1rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            transition: 'outline 0.3s ease',
          }}
        >
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.45rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#4f46e5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
              >
                How It Works
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                Simple 3-Step Campus Knowledge Exchange
              </span>
            </div>
          </div>

          {/* Three Feature Cards Displayed Horizontally */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.65rem',
            }}
            className="how-it-works-grid"
          >
            {steps.map((st) => (
              <div
                key={st.step}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: st.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {st.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: '#6366f1',
                        backgroundColor: '#e0e7ff',
                        padding: '1px 5px',
                        borderRadius: '4px',
                      }}
                    >
                      {st.step}
                    </span>
                    <h3 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                      {st.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.2rem', lineHeight: 1.35 }}>
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= BOTTOM SPLIT ROW: 4. POPULAR SKILLS & 5. WHY CHOOSE ================= */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
          }}
          className="bottom-split-grid"
        >
          {/* 4. Popular Skills Section */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '0.65rem 1rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={13} color="#4f46e5" />
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#4f46e5',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                  }}
                >
                  Popular Skills
                </span>
              </div>
              <Link
                to="/explore"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#4f46e5',
                  textDecoration: 'none',
                }}
              >
                Explore All →
              </Link>
            </div>

            {/* 6 Skill Categories Compact Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.45rem',
              }}
              className="skills-compact-grid"
            >
              {popularSkills.map((sk) => (
                <Link
                  key={sk.name}
                  to={`/explore?category=${encodeURIComponent(sk.query)}`}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.35rem 0.55rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eef2ff';
                    e.currentTarget.style.borderColor = '#c7d2fe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      flexShrink: 0,
                    }}
                  >
                    {sk.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {sk.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 5. Why Choose SkillSwap? Section */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '0.65rem 1rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={13} color="#4f46e5" />
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#4f46e5',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                  }}
                >
                  Why Choose SkillSwap?
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                Campus Peer Learning Benefits
              </span>
            </div>

            {/* 4 Small Benefits */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.45rem',
              }}
              className="benefits-compact-grid"
            >
              {benefits.map((b) => (
                <div
                  key={b.title}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.35rem 0.55rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      flexShrink: 0,
                    }}
                  >
                    {b.icon}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '0.76rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
                      {b.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.68rem',
                        color: '#64748b',
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '1px',
                      }}
                    >
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ================= 7. FOOTER (Compact Single-Screen Footer) ================= */}
      <footer
        style={{
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          borderTop: '1px solid #1e293b',
          padding: '0.35rem 1.25rem',
          fontSize: '0.75rem',
          flexShrink: 0,
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Copyright information */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>SkillSwap</span>
            <span style={{ color: '#475569' }}>•</span>
            <span>© 2026 SkillSwap Platform. All rights reserved.</span>
          </div>

          {/* Links: About SkillSwap, Contact, Privacy Policy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => setActiveModal('about')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#cbd5e1',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.target.style.color = '#818cf8')}
              onMouseLeave={(e) => (e.target.style.color = '#cbd5e1')}
            >
              About SkillSwap
            </button>
            <button
              onClick={() => setActiveModal('contact')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#cbd5e1',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.target.style.color = '#818cf8')}
              onMouseLeave={(e) => (e.target.style.color = '#cbd5e1')}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveModal('privacy')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#cbd5e1',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.target.style.color = '#818cf8')}
              onMouseLeave={(e) => (e.target.style.color = '#cbd5e1')}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      {/* ================= MODAL DIALOGS FOR ABOUT, CONTACT, PRIVACY ================= */}
      {activeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#e0e7ff',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeModal === 'about' && <Info size={20} />}
                  {activeModal === 'contact' && <Mail size={20} />}
                  {activeModal === 'privacy' && <ShieldCheck size={20} />}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeModal === 'about' && 'About SkillSwap'}
                  {activeModal === 'contact' && 'Contact SkillSwap Team'}
                  {activeModal === 'privacy' && 'SkillSwap Privacy Policy'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            {activeModal === 'about' && (
              <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '0.75rem' }}>
                  <strong>SkillSwap</strong> is an innovative peer-to-peer campus platform built to empower university students to teach skills they already know and acquire new skills from peers completely free of charge.
                </p>
                <p style={{ marginBottom: '0.75rem' }}>
                  Instead of paying costly bootcamp fees or expensive private tutoring charges, students find mutual learning matches — Student A teaches Python in exchange for Student B teaching UI/UX Design.
                </p>
                <p>
                  Every session includes verified ratings, peer endorsements, and structured exchange tracking to boost academic growth and career resumes.
                </p>
              </div>
            )}

            {activeModal === 'contact' && (
              <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '0.85rem' }}>
                  Have questions, feedback, or want to launch SkillSwap at your university campus? We'd love to hear from you!
                </p>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Mail size={16} color="#4f46e5" />
                    <span style={{ fontWeight: 700, color: '#1e1b4b' }}>support@skillswap.edu</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Available Monday – Friday for student support and club partnerships.
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  SkillSwap Student Initiative • College Innovation & Open Education Network
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '0.75rem' }}>
                  <strong>Student Safety & Privacy First:</strong> SkillSwap is dedicated to preserving the confidentiality and academic privacy of all participating college students.
                </p>
                <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>Your student credentials and email are safely hashed using industry standard bcrypt encryption.</li>
                  <li>No personal user contact data or phone numbers are ever sold to third parties or advertisers.</li>
                  <li>Skill exchanges are strictly non-commercial and peer-monitored.</li>
                  <li>You maintain full control over which skills you choose to list on your student profile.</li>
                </ul>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  Last updated: 2026 Academic Session • SkillSwap Platform Security
                </p>
              </div>
            )}

            {/* Modal Footer */}
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setActiveModal(null)}
                className="btn btn-primary btn-sm"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for responsive adaptations */}
      <style>{`
        @media (min-width: 1024px) {
          .single-screen-landing {
            height: 100vh;
            max-height: 100vh;
            overflow: hidden;
          }
        }
        @media (max-width: 1023px) {
          .single-screen-landing {
            min-height: 100vh;
            height: auto;
            overflow-y: auto;
          }
          .hero-section-grid {
            grid-template-columns: 1fr !important;
          }
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
          }
          .bottom-split-grid {
            grid-template-columns: 1fr !important;
          }
          .skills-compact-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .benefits-compact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
