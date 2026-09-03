const { useState, useEffect } = React;

// Storage Keys
const ACCOUNT_KEY = "mdt-account";
const USERS_DB_KEY = "mdt-users-db";
const PROJECTS_KEY = "mdt-projects";

// Clean SVG Icon component
function Icon({ name, size = 20, className = "" }) {
  const iconProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: `svg-icon ${className}`
  };

  switch (name) {
    case "home":
      return (
        <svg {...iconProps}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "academy":
      return (
        <svg {...iconProps}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "learning":
      return (
        <svg {...iconProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="14" y2="10" />
        </svg>
      );
    case "projects":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "portfolio":
      return (
        <svg {...iconProps}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "community":
      return (
        <svg {...iconProps}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "opportunities":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "notifications":
      return (
        <svg {...iconProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "settings":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...iconProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "search":
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "play":
      return (
        <svg {...iconProps} fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case "lessons":
      return (
        <svg {...iconProps}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "pencil":
      return (
        <svg {...iconProps}>
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      );
    case "check":
      return (
        <svg {...iconProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "fire":
      return (
        <svg {...iconProps} fill="currentColor">
          <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.65 2.17-6.8 5.37-8.15.42-.18.89.1.94.55.08.77.34 2.1 1.19 2.6 1.15-2.2 2.87-4.5 4.5-6.5.3-.37.88-.28 1.05.17C17.5 6.5 21 11.2 21 14c0 4.97-4.03 9-9 9zm0-14c-1.2 1.5-2.4 3.2-3 5-.3.9-.1 1.9.5 2.6.6.7 1.5 1.1 2.5 1.1s1.9-.4 2.5-1.1c.6-.7.8-1.7.5-2.6-.6-1.8-1.8-3.5-3-5z"/>
        </svg>
      );
    case "badge-fire":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" className={className}>
          <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.65 2.17-6.8 5.37-8.15.42-.18.89.1.94.55.08.77.34 2.1 1.19 2.6 1.15-2.2 2.87-4.5 4.5-6.5.3-.37.88-.28 1.05.17C17.5 6.5 21 11.2 21 14c0 4.97-4.03 9-9 9zm0-14c-1.2 1.5-2.4 3.2-3 5-.3.9-.1 1.9.5 2.6.6.7 1.5 1.1 2.5 1.1s1.9-.4 2.5-1.1c.6-.7.8-1.7.5-2.6-.6-1.8-1.8-3.5-3-5z"/>
        </svg>
      );
    case "badge-project":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" className={className}>
          <rect x="3" y="3" width="8" height="8" rx="2.5" />
          <rect x="13" y="3" width="8" height="8" rx="2.5" />
          <rect x="3" y="13" width="8" height="8" rx="2.5" />
          <rect x="13" y="13" width="8" height="8" rx="2.5" />
        </svg>
      );
    case "badge-quiz":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21.5 12A9.5 9.5 0 1 1 17.5 4.5L21.5 8" />
          <polyline points="21.5 3 21.5 8 16.5 8" />
          <polyline points="8.5 12.5 11 15 16 9.5" />
        </svg>
      );
    case "badge-skill":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" className={className}>
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          <path d="M5 13.18v4c0 2.5 3.13 4.82 7 4.82s7-2.32 7-4.82v-4l-7 3.82-7-3.82z" />
        </svg>
      );
    case "close":
      return (
        <svg {...iconProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case "chart":
      return (
        <svg {...iconProps}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...iconProps}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...iconProps}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
          <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    default:
      return null;
  }
}

// Course Catalog with rich lesson metadata for the Ongoing Course view
const academyCourses = [
  {
    id: "uiux-1",
    category: "Design",
    title: "UI/UX Design Fundamentals",
    module: "Designing User Interfaces",
    meta: "5 Lessons • Beginner",
    lessonsCount: 5,
    level: "Beginner",
    description: "Design clean, usable interfaces from wireframe to prototype. Learn type hierarchy, layouts, and responsive design.",
    status: "in-progress",
    btnLabel: "Continue Learning",
    btnStyle: "light",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    instructor: "Joseph Joestar",
    instructorRole: "Product Designer, Tutor",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    duration: "18 mins",
    curriculum: [
      {
        title: "What is Typography",
        duration: "3 min",
        done: true,
        savedTimestamp: 0,
        description: "Explore the core building blocks of digital typography, font weights, and how text shapes user experiences across devices.",
        tags: ["Typography", "Hierarchy", "Fundamentals"]
      },
      {
        title: "Type Anatomy",
        duration: "4 min",
        done: true,
        savedTimestamp: 0,
        description: "Deep dive into x-height, ascenders, descenders, kerning, and baseline grids to build balanced interfaces.",
        tags: ["Type Anatomy", "Grids", "Spacing"]
      },
      {
        title: "Choosing Typefaces",
        duration: "5 min",
        done: false,
        savedTimestamp: 120,
        description: "A typeface sets the tone before a single word is read. Learn how to choose typefaces that match a product's personality, judge readability at different sizes, and pair a display face with a body face without clashing.",
        tags: ["Readability", "Type Pairing", "Hierarchy"]
      },
      {
        title: "Pairing Fonts",
        duration: "4 min",
        done: false,
        savedTimestamp: 0,
        description: "Master proven formulas for combining serif, sans-serif, and display typefaces harmoniously across websites and mobile apps.",
        tags: ["Font Pairing", "Styling", "Contrast"]
      },
      {
        title: "Quiz: Typography Basics",
        duration: "5 min",
        done: false,
        savedTimestamp: 0,
        description: "Review and test your knowledge of typographic hierarchy, readability guidelines, and practical pairing rules.",
        tags: ["Quiz", "Knowledge Check", "Review"]
      }
    ]
  },
  {
    id: "mkt-1",
    category: "Marketing",
    title: "Digital Marketing",
    module: "Audience Growth & Analytics",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Grow an audience with content, social media channels, and actionable analytics.",
    status: "in-progress",
    btnLabel: "Continue Learning",
    btnStyle: "light",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    instructor: "Elena Rostova",
    instructorRole: "Growth Strategist",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/bixR-KIJKYM",
    duration: "22 mins",
    curriculum: [
      {
        title: "Digital Marketing Landscape for Creators",
        duration: "7 min",
        done: true,
        savedTimestamp: 0,
        description: "Understand inbound channels, creator ecosystems, and identifying where your target audience hangs out online.",
        tags: ["Strategy", "Ecosystem", "Foundations"]
      },
      {
        title: "Content Strategy & Audience Segmentation",
        duration: "9 min",
        done: false,
        savedTimestamp: 0,
        description: "Build content pillars that attract and retain loyal followers while speaking directly to different customer personas.",
        tags: ["Content Strategy", "Segmentation", "Personas"]
      },
      {
        title: "Search & Social Analytics Mastery",
        duration: "14 min",
        done: false,
        savedTimestamp: 0,
        description: "Interpret impressions, engagement rates, click-throughs, and convert data insights into higher performing posts.",
        tags: ["Analytics", "Metrics", "Optimization"]
      },
      {
        title: "Running Impactful Campaigns on a Budget",
        duration: "11 min",
        done: false,
        savedTimestamp: 0,
        description: "Maximize ROI on organic distribution and low-cost paid campaigns to test ideas quickly.",
        tags: ["Campaigns", "Budgeting", "Execution"]
      }
    ]
  },
  {
    id: "media-1",
    category: "Media",
    title: "Content Creation",
    module: "Video Production & Storytelling",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Shoot, edit, and publish video content that engages audiences from the very first second.",
    status: "in-progress",
    btnLabel: "Continue Learning",
    btnStyle: "light",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    instructor: "Marcus Reed",
    instructorRole: "Filmmaker & YouTube Creator",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/nLRL_NcnK-4",
    duration: "25 mins",
    curriculum: [
      {
        title: "Camera Angles, Lighting & Phone Setups",
        duration: "8 min",
        done: true,
        savedTimestamp: 0,
        description: "Set up cinematic 3-point lighting and frame compelling video shots using your smartphone camera.",
        tags: ["Lighting", "Framing", "Mobile Production"]
      },
      {
        title: "Storyboarding & Hooking the Audience in 3s",
        duration: "10 min",
        done: false,
        savedTimestamp: 0,
        description: "Learn psychological hooks, narrative arcs, and pacing techniques to maintain high retention on short-form video.",
        tags: ["Hook", "Storyboarding", "Retention"]
      },
      {
        title: "Premiere & CapCut Editing Masterclass",
        duration: "25 min",
        done: false,
        savedTimestamp: 0,
        description: "Pacing cuts, seamless transitions, dynamic sound effects, and color grading for YouTube and TikTok.",
        tags: ["Editing", "CapCut", "Premiere"]
      },
      {
        title: "Sound Design, Music & Publishing Strategy",
        duration: "15 min",
        done: false,
        savedTimestamp: 0,
        description: "Select copyright-free music tracks, EQ voiceovers for crystal-clear audio, and optimize video thumbnails.",
        tags: ["Audio", "Thumbnails", "Publishing"]
      }
    ]
  },
  {
    id: "web-1",
    category: "Web Development",
    title: "Intro to Web Development",
    module: "Frontend Coding Essentials",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Build your first responsive website from scratch with HTML5, modern CSS, and Flexbox.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    instructor: "Alex Rivera",
    instructorRole: "Senior Frontend Engineer",
    instructorAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/mU6anWqZJcc",
    duration: "32 mins",
    curriculum: [
      {
        title: "How the Web Works: HTML Document Structure",
        duration: "10 min",
        done: false,
        savedTimestamp: 0,
        description: "Learn how browsers parse HTML tags, semantic elements, and build accessible webpage foundations.",
        tags: ["HTML5", "Semantics", "Web Structure"]
      },
      {
        title: "Styling with Modern CSS & Flexbox",
        duration: "18 min",
        done: false,
        savedTimestamp: 0,
        description: "Master CSS box model, colors, custom fonts, and 1D flexbox layouts that adapt smoothly to screen sizes.",
        tags: ["CSS3", "Flexbox", "Responsive"]
      },
      {
        title: "Building a Responsive Portfolio Landing Page",
        duration: "32 min",
        done: false,
        savedTimestamp: 0,
        description: "Code a real personal showcase page with hero section, project grid, and mobile hamburger navigation.",
        tags: ["Projects", "Portfolio", "Hands-on"]
      },
      {
        title: "Deploying Your Website to GitHub Pages & Vercel",
        duration: "12 min",
        done: false,
        savedTimestamp: 0,
        description: "Publish your website live to the world with a public URL using free GitHub Pages and Vercel hosting.",
        tags: ["Deployment", "Git", "Hosting"]
      }
    ]
  },
  {
    id: "design-2",
    category: "Design",
    title: "Personal Branding",
    module: "Creative Identity & Case Studies",
    meta: "4 Lessons • Intermediate",
    lessonsCount: 4,
    level: "Intermediate",
    description: "Craft a compelling story, portfolio case study, and online presence that stands out.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    instructor: "Sophie Turner",
    instructorRole: "Creative Director",
    instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/G6Y_oEw8Poc",
    duration: "19 mins",
    curriculum: [
      {
        title: "Defining Your Creative Identity & Niche",
        duration: "9 min",
        done: false,
        savedTimestamp: 0,
        description: "Identify your unique strengths, visual style, and target audience in the creator ecosystem.",
        tags: ["Branding", "Positioning", "Identity"]
      },
      {
        title: "Crafting a Compelling Case Study",
        duration: "14 min",
        done: false,
        savedTimestamp: 0,
        description: "Structure design problem-solving stories with problem statement, user research, wireframes, and final impact.",
        tags: ["Case Studies", "Storytelling", "UX"]
      },
      {
        title: "Building Your Online Portfolio Space",
        duration: "19 min",
        done: false,
        savedTimestamp: 0,
        description: "Select the right platform and design a clean layout that showcases your best builds.",
        tags: ["Portfolio", "Presentation", "UI"]
      },
      {
        title: "Networking & Reaching Out to Opportunities",
        duration: "11 min",
        done: false,
        savedTimestamp: 0,
        description: "Write effective intro emails and connect with mentors, peers, and collaborators.",
        tags: ["Outreach", "Networking", "Career"]
      }
    ]
  },
  {
    id: "biz-1",
    category: "Business",
    title: "Build Your First Business",
    module: "Idea Validation & Launch",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Turn a useful idea into a simple plan, launch strategy, and first offer.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    instructor: "David Sterling",
    instructorRole: "Startup Mentor",
    instructorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/1vRz2aG1O9s",
    duration: "28 mins",
    curriculum: [
      {
        title: "Finding Problems Worth Solving as a Teen",
        duration: "12 min",
        done: false,
        savedTimestamp: 0,
        description: "Spot everyday frictions and unmet needs that people are willing to pay for.",
        tags: ["Ideation", "Market Research", "Opportunities"]
      },
      {
        title: "The 1-Page Business Model Canvas",
        duration: "15 min",
        done: false,
        savedTimestamp: 0,
        description: "Map out value propositions, customer segments, channels, and revenue streams quickly on 1 page.",
        tags: ["Business Model", "Strategy", "Lean"]
      },
      {
        title: "Creating Your First Minimum Viable Product",
        duration: "28 min",
        done: false,
        savedTimestamp: 0,
        description: "Build a prototype or pilot service in under 48 hours to validate demand with real users.",
        tags: ["MVP", "Validation", "Prototyping"]
      },
      {
        title: "Getting Your First 10 Customers",
        duration: "14 min",
        done: false,
        savedTimestamp: 0,
        description: "Reach your first buyers through direct outreach, localized word-of-mouth, and early bird perks.",
        tags: ["Sales", "Launch", "Customers"]
      }
    ]
  }
];

// Helper to parse duration strings like "6:15", "5 min", "18 mins" into seconds
function parseDurationToSeconds(dur) {
  if (!dur) return 300;
  if (typeof dur === "number") return dur;
  if (dur.includes(":")) {
    const parts = dur.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const match = dur.match(/(\d+)/);
  return match ? parseInt(match[1], 10) * 60 : 300;
}

// Format seconds into readable MM:SS
function formatSeconds(sec) {
  if (!sec || isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Calculate course completion % based on curriculum video durations
function getCourseProgress(course) {
  if (!course || !course.curriculum || !Array.isArray(course.curriculum) || course.curriculum.length === 0) return 0;
  const totalSeconds = course.curriculum.reduce((acc, l) => acc + parseDurationToSeconds(l ? l.duration : "5 min"), 0);
  const doneSeconds = course.curriculum.filter((l) => l && l.done).reduce((acc, l) => acc + parseDurationToSeconds(l ? l.duration : "5 min"), 0);
  return totalSeconds > 0 ? Math.round((doneSeconds / totalSeconds) * 100) : 0;
}

// Calculate level progression where XP requirement increases as levels go higher
// Level 1: 500 XP, Level 2: 750 XP, Level 3: 1,000 XP, Level 4: 1,250 XP, Level 5: 1,500 XP...
function getLevelInfo(totalXp) {
  let level = 1;
  let xpAccumulated = 0;

  while (true) {
    // XP needed specifically to complete the current level (increases with each level)
    const xpRequiredThisLevel = 500 + (level - 1) * 250;

    if (totalXp < xpAccumulated + xpRequiredThisLevel) {
      const currentLevelXp = Math.max(0, totalXp - xpAccumulated);
      const levelProgressPct = Math.min(
        Math.max(Math.round((currentLevelXp / xpRequiredThisLevel) * 100), 0),
        100
      );
      const xpToNext = xpRequiredThisLevel - currentLevelXp;
      return {
        userLevel: level,
        currentLevelXp,
        xpRequiredThisLevel,
        levelProgressPct,
        xpToNext
      };
    }

    xpAccumulated += xpRequiredThisLevel;
    level++;
  }
}

function readStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// Ensure saved user courses are upgraded and merged with rich course catalog properties
function mergeWithCatalog(savedCourses) {
  if (!savedCourses || !Array.isArray(savedCourses) || savedCourses.length === 0) {
    return academyCourses;
  }
  return academyCourses.map((catalogCourse) => {
    const saved = savedCourses.find((c) => c && c.id === catalogCourse.id);
    if (!saved) return catalogCourse;
    return {
      ...catalogCourse,
      ...saved,
      module: catalogCourse.module || saved.module || "General Module",
      instructor: catalogCourse.instructor || saved.instructor || "Instructor",
      instructorRole: catalogCourse.instructorRole || saved.instructorRole || "Tutor",
      instructorAvatar: catalogCourse.instructorAvatar || saved.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      videoUrl: catalogCourse.videoUrl || saved.videoUrl,
      curriculum: catalogCourse.curriculum.map((catalogLesson, idx) => {
        const savedLesson = saved.curriculum && saved.curriculum[idx];
        return savedLesson
          ? {
              ...catalogLesson,
              ...savedLesson,
              description: catalogLesson.description || (savedLesson && savedLesson.description) || "Lesson overview",
              tags: catalogLesson.tags || (savedLesson && savedLesson.tags) || ["Fundamentals"]
            }
          : catalogLesson;
      })
    };
  });
}

// Create clean course list starting with 0% progress for new accounts
function getFreshCourses() {
  return academyCourses.map((course) => ({
    ...course,
    enrolled: false,
    status: "not-started",
    curriculum: course.curriculum.map((lesson) => ({
      ...lesson,
      done: false,
      savedTimestamp: 0
    }))
  }));
}

// Fresh 0-state data template for brand new accounts
function createFreshUserData(user) {
  return {
    email: user.email,
    userLevel: 1,
    userXp: 0,
    streak: 0,
    lastStreakDate: null,
    coursesList: getFreshCourses(),
    projects: []
  };
}

// Default Daniel demo account
const defaultAccount = {
  name: "Daniel",
  email: "daniel@mydearteenager.com",
  password: "password123",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
};

// Default Daniel demo starter progress (starts with UI/UX course ongoing at Choosing Typefaces)
const defaultDemoData = {
  email: "daniel@mydearteenager.com",
  userLevel: 1,
  userXp: 0,
  streak: 1,
  lastStreakDate: null,
  coursesList: academyCourses,
  projects: []
};

// Calculate difference in whole calendar days between two YYYY-MM-DD strings
function getDaysDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return Infinity;
  const [y1, m1, d1] = dateStr1.split("-").map(Number);
  const [y2, m2, d2] = dateStr2.split("-").map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// Reset streak to 0 if the user missed an entire calendar day without logging in / recording a streak
function checkAndResetStreak(userData) {
  if (!userData) return userData;
  if (!userData.lastStreakDate || !userData.streak) {
    return userData;
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const daysDiff = getDaysDifference(userData.lastStreakDate, todayStr);

  // If 2 or more days have elapsed since last check-in, an entire day was missed -> reset streak
  if (daysDiff > 1) {
    return {
      ...userData,
      streak: 0,
      lastStreakDate: null
    };
  }

  return userData;
}

function getUserDataKey(email) {
  return `mdt-userdata-${(email || "").toLowerCase().trim()}`;
}

function loadUserData(email, fallbackData = null) {
  if (!email) return createFreshUserData({ email: "" });
  const key = getUserDataKey(email);
  const stored = readStorage(key, null);
  if (stored) {
    const verified = checkAndResetStreak(stored);
    if (verified.streak !== stored.streak || verified.lastStreakDate !== stored.lastStreakDate) {
      localStorage.setItem(key, JSON.stringify(verified));
    }
    return {
      ...verified,
      coursesList: mergeWithCatalog(verified.coursesList)
    };
  }

  const initial = fallbackData || createFreshUserData({ email });
  const verifiedInitial = checkAndResetStreak(initial);
  verifiedInitial.coursesList = mergeWithCatalog(verifiedInitial.coursesList);
  localStorage.setItem(key, JSON.stringify(verifiedInitial));
  return verifiedInitial;
}

function saveUserData(email, data) {
  if (!email) return;
  const key = getUserDataKey(email);
  localStorage.setItem(key, JSON.stringify(data));
}

function AuthPage() {
  const [account, setAccount] = useState(() => readStorage(ACCOUNT_KEY, null));
  const [view, setView] = useState(() => {
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    if (hash === "academy" || hash === "home" || hash === "learning" || hash === "course") {
      return "dashboard";
    }
    if (hash === "login") return "login";
    if (hash === "signup" || hash === "register") return "signup";
    return "welcome";
  });
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("forward");

  function transitionToView(targetView, direction = "forward") {
    if (view === targetView) return;
    setIsViewTransitioning(true);
    setTransitionDirection(direction);
    setTimeout(() => {
      setView(targetView);
      setNotice("");
      setIsViewTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  }

  const [userRole, setUserRole] = useState("teenager"); // "teenager" | "parent"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", agreeTerms: false });
  const [project, setProject] = useState({ title: "", skill: "", description: "" });
  const [dashboardView, setDashboardView] = useState(() => {
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    if (hash === "academy" || hash === "learning" || hash === "course") return hash;
    return "home";
  }); // "home" | "academy" | "learning" | "course"
  const [academyCategory, setAcademyCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Ongoing Course page view state
  const [activeCourseId, setActiveCourseId] = useState("uiux-1");
  const [activeLessonIndex, setActiveLessonIndex] = useState(2);

  // Active lesson video watch timestamp and static initial start second (prevents iframe from reloading while watching)
  const [lessonWatchTimestamp, setLessonWatchTimestamp] = useState(0);
  const [lessonInitialStartTime, setLessonInitialStartTime] = useState(0);
  const [liveVideoDuration, setLiveVideoDuration] = useState("");
  const [liveVideoDurationSec, setLiveVideoDurationSec] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Initialize data isolated specifically for current active account
  const activeUserData = account
    ? loadUserData(account.email, account.email === defaultAccount.email ? defaultDemoData : null)
    : createFreshUserData({ email: "" });

  const [userXp, setUserXp] = useState(activeUserData.userXp || 0);
  const [streak, setStreak] = useState(activeUserData.streak || 0);
  const [lastStreakDate, setLastStreakDate] = useState(activeUserData.lastStreakDate);
  const [coursesList, setCoursesList] = useState(activeUserData.coursesList || academyCourses);
  const [projects, setProjects] = useState(activeUserData.projects || []);

  // Dynamic scaling level & progress calculations (XP requirements increase with higher levels; bar resets to 0% upon entering new level)
  const { userLevel, currentLevelXp, xpRequiredThisLevel, levelProgressPct, xpToNext } = getLevelInfo(userXp);
  const weeklyXpGoalPct = Math.min(Math.round((userXp / 400) * 100), 100);

  // Current calendar day (YYYY-MM-DD) for 1-click-per-day streak enforcement
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const isStreakClaimedToday = lastStreakDate === todayDateStr;

  // Helper to persist saved playback timestamp for a course lesson into localStorage
  function updateLessonSavedTimestamp(courseId, lessonIdx, seconds) {
    setCoursesList((prev) => {
      const updated = prev.map((c) => {
        if (c.id === courseId) {
          const updatedCurr = (c.curriculum || []).map((l, idx) =>
            idx === lessonIdx ? { ...l, savedTimestamp: seconds } : l
          );
          return { ...c, curriculum: updatedCurr };
        }
        return c;
      });
      persistUserProgress({ coursesList: updated });
      return updated;
    });
  }

  // Persist current user state changes into localStorage
  function persistUserProgress(updates) {
    if (!account || !account.email) return;
    const currentPayload = {
      email: account.email,
      userLevel,
      userXp,
      streak,
      lastStreakDate,
      coursesList,
      projects,
      ...updates
    };
    saveUserData(account.email, currentPayload);
  }

  // On load / session resume, verify if an entire day was missed and reset streak if needed
  useEffect(() => {
    if (!account || !account.email) return;
    if (lastStreakDate && streak > 0) {
      const daysDiff = getDaysDifference(lastStreakDate, todayDateStr);
      if (daysDiff > 1) {
        setStreak(0);
        setLastStreakDate(null);
        persistUserProgress({
          streak: 0,
          lastStreakDate: null
        });
      }
    }
  }, [account, lastStreakDate, todayDateStr]);

  // Sync initial playback timestamp whenever a course or lesson is opened
  useEffect(() => {
    if (dashboardView === "course") {
      const course = coursesList.find((c) => c.id === activeCourseId) || coursesList[0];
      if (course && course.curriculum && course.curriculum[activeLessonIndex]) {
        const saved = Math.floor(course.curriculum[activeLessonIndex].savedTimestamp || 0);
        setLessonInitialStartTime(saved);
        setLessonWatchTimestamp(saved);
        setLiveVideoDurationSec(0);
        setIsVideoPlaying(true);
      }
    }
  }, [activeCourseId, activeLessonIndex, dashboardView]);

  // Dynamically listen to YouTube iframe postMessages to detect exact duration and pause/play state
  useEffect(() => {
    if (dashboardView !== "course") {
      setLiveVideoDuration("");
      setLiveVideoDurationSec(0);
      setIsVideoPlaying(true);
      return;
    }

    const handleMessage = (event) => {
      try {
        if (typeof event.data === "string") {
          const data = JSON.parse(event.data);

          // Track YouTube player state (1: playing, 2: paused, 0: ended)
          if (data.event === "onStateChange") {
            const state = data.info;
            if (state === 1) {
              setIsVideoPlaying(true);
            } else if (state === 2 || state === 0) {
              setIsVideoPlaying(false);
            }
          }

          if (data.event === "infoDelivery" && data.info) {
            if (typeof data.info.playerState === "number") {
              if (data.info.playerState === 1) {
                setIsVideoPlaying(true);
              } else if (data.info.playerState === 2 || data.info.playerState === 0) {
                setIsVideoPlaying(false);
              }
            }

            // Sync exact playback time from YouTube player if available
            if (typeof data.info.currentTime === "number") {
              const exactCurrent = Math.floor(data.info.currentTime);
              if (exactCurrent >= 0) {
                setLessonWatchTimestamp(exactCurrent);
                updateLessonSavedTimestamp(activeCourseId, activeLessonIndex, exactCurrent);
              }
            }

            // Sync exact video duration
            if (typeof data.info.duration === "number") {
              const exactSec = Math.round(data.info.duration);
              if (exactSec > 0) {
                setLiveVideoDurationSec(exactSec);
                const m = Math.floor(exactSec / 60);
                const s = exactSec % 60;
                setLiveVideoDuration(`${m}:${s.toString().padStart(2, "0")}`);
              }
            }
          }
        }
      } catch (e) {
        // ignore non-json messages
      }
    };

    window.addEventListener("message", handleMessage);

    // Initial and recurring listening handshake to YouTube iframe
    const handshakeTimer = setInterval(() => {
      const iframe = document.querySelector(".ongoing-video-container iframe");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: "listening" }), "*");
      }
    }, 1200);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(handshakeTimer);
    };
  }, [dashboardView, activeCourseId, activeLessonIndex]);

  // Continuously track watch seconds ONLY when video is playing; STOP timer when paused
  useEffect(() => {
    if (dashboardView !== "course" || !isVideoPlaying) return;

    const timer = setInterval(() => {
      setLessonWatchTimestamp((prev) => {
        const next = prev + 1;
        if (next % 4 === 0) {
          updateLessonSavedTimestamp(activeCourseId, activeLessonIndex, next);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dashboardView, isVideoPlaying, activeCourseId, activeLessonIndex]);

  // Sync hash if URL has #academy, #home, #learning, #course, #signup, #login, or #welcome
  useEffect(() => {
    const handleHash = () => {
      const hash = (window.location.hash || "").replace("#", "").toLowerCase();
      if (hash === "academy") {
        setView("dashboard");
        setDashboardView("academy");
      } else if (hash === "home") {
        setView("dashboard");
        setDashboardView("home");
      } else if (hash === "learning" || hash === "mylearning") {
        setView("dashboard");
        setDashboardView("learning");
      } else if (hash === "course") {
        setView("dashboard");
        setDashboardView("course");
      } else if (hash === "signup" || hash === "register") {
        setView("signup");
      } else if (hash === "login") {
        setView("login");
      } else if (hash === "welcome") {
        setView("welcome");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  function updateForm(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setNotice("");
  }

  function submitAuth(event) {
    if (event && event.preventDefault) event.preventDefault();
    const cleanEmail = (form.email || "").trim().toLowerCase();
    const usersDb = readStorage(USERS_DB_KEY, [defaultAccount]);

    if (view === "signup") {
      if (!form.name.trim()) {
        setNotice("Please enter your full name.");
        return;
      }
      if (!cleanEmail) {
        setNotice("Please enter your email address.");
        return;
      }
      if (form.password.length < 6) {
        setNotice("Your password needs at least 6 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setNotice("Passwords do not match. Please confirm your password.");
        return;
      }
      if (!form.agreeTerms) {
        setNotice("Please agree to the Terms of Service and Privacy Policy.");
        return;
      }

      // Check if email already exists in system (1 email = 1 account rule)
      const existingUser = usersDb.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        setNotice("An account with this email address already exists. Please log in instead.");
        return;
      }

      const newAccount = {
        name: form.name.trim() || (userRole === "parent" ? "Parent / Mentor" : "Teen Learner"),
        email: cleanEmail,
        password: form.password,
        role: userRole,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
      };

      // Save to users database and active session
      const updatedUsersDb = [...usersDb, newAccount];
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsersDb));
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(newAccount));

      // Brand new account starts fresh with everything at ZERO
      const freshData = createFreshUserData(newAccount);
      saveUserData(cleanEmail, freshData);

      setAccount(newAccount);
      setUserXp(freshData.userXp);
      setStreak(freshData.streak);
      setLastStreakDate(freshData.lastStreakDate);
      setCoursesList(freshData.coursesList);
      setProjects(freshData.projects);
      setNotice("");
      setView("dashboard");
      setDashboardView("home");
      window.location.hash = "home";
      return;
    }

    if (view === "login") {
      const foundUser = usersDb.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === form.password
      );

      if (!foundUser) {
        setNotice("Those details do not match an account yet. Check your email/password or create one.");
        return;
      }

      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(foundUser));
      setAccount(foundUser);

      // Load this specific user's saved data
      const userSavedData = loadUserData(
        foundUser.email,
        foundUser.email === defaultAccount.email ? defaultDemoData : null
      );
      setUserXp(userSavedData.userXp);
      setStreak(userSavedData.streak);
      setLastStreakDate(userSavedData.lastStreakDate);
      setCoursesList(userSavedData.coursesList);
      setProjects(userSavedData.projects || []);
      setNotice("");
      setView("dashboard");
      setDashboardView("home");
      window.location.hash = "home";
      return;
    }
  }

  function logout() {
    setAccount(null);
    localStorage.removeItem(ACCOUNT_KEY);
    setView("welcome");
    window.location.hash = "";
    setForm({ name: "", email: "", password: "" });
    setNotice("");
  }

  function createProject(event) {
    event.preventDefault();
    if (!project.title.trim() || !project.skill.trim()) return;
    const nextProjects = [{ ...project, id: Date.now() }, ...projects];
    setProjects(nextProjects);
    persistUserProgress({ projects: nextProjects });
    setProject({ title: "", skill: "", description: "" });
  }

  // Open course in the dedicated Ongoing Course page (matching Ongoing course.jpeg)
  function openCourseVideo(course, lessonIndex = null) {
    const targetCourse = (course && coursesList.find((c) => c.id === course.id)) || course || coursesList[0] || academyCourses[0];
    setActiveCourseId(targetCourse.id);

    // Mark course as enrolled / in-progress when the user opens or starts watching it
    if (!targetCourse.enrolled) {
      const updatedCourses = coursesList.map((c) => {
        if (c.id === targetCourse.id) {
          return { ...c, enrolled: true, status: "in-progress" };
        }
        return c;
      });
      setCoursesList(updatedCourses);
      persistUserProgress({ coursesList: updatedCourses });
    }

    let targetIdx = 0;
    if (typeof lessonIndex === "number") {
      targetIdx = lessonIndex;
    } else if (targetCourse.curriculum && Array.isArray(targetCourse.curriculum)) {
      const firstUndone = targetCourse.curriculum.findIndex((l) => !l.done);
      targetIdx = firstUndone !== -1 ? firstUndone : 0;
    }

    setActiveLessonIndex(targetIdx);
    const initialTime =
      targetCourse.curriculum && targetCourse.curriculum[targetIdx]
        ? Math.floor(targetCourse.curriculum[targetIdx].savedTimestamp || 0)
        : 0;
    setLessonInitialStartTime(initialTime);
    setLessonWatchTimestamp(initialTime);

    setDashboardView("course");
    window.location.hash = "course";
  }

  // Increment Weekly Streak once per calendar day and award XP
  function incrementStreak() {
    if (isStreakClaimedToday) return;

    // Check if the previous streak was recorded yesterday (1 day difference) to continue streak, otherwise start at 1
    const isConsecutive = lastStreakDate && getDaysDifference(lastStreakDate, todayDateStr) === 1;
    const nextStreak = isConsecutive ? (streak < 14 ? streak + 1 : 1) : 1;
    const nextXp = userXp + 50;
    const { userLevel: nextLevel } = getLevelInfo(nextXp);

    setStreak(nextStreak);
    setLastStreakDate(todayDateStr);
    setUserXp(nextXp);

    persistUserProgress({
      streak: nextStreak,
      lastStreakDate: todayDateStr,
      userXp: nextXp,
      userLevel: nextLevel
    });
  }

  // Mark the current active lesson on the Ongoing Course page as complete
  function completeCurrentOngoingLesson() {
    const targetCourseId = activeCourseId || (coursesList[0] && coursesList[0].id) || "uiux-1";
    const currentCourse = coursesList.find((c) => c.id === targetCourseId) || coursesList[0];
    if (!currentCourse || !currentCourse.curriculum) return;

    const currentLesson = currentCourse.curriculum[safeActiveLessonIndex];
    if (!currentLesson) return;

    const updatedCourses = coursesList.map((c) => {
      if (c.id === targetCourseId) {
        const updatedCurriculum = c.curriculum.map((l, idx) =>
          idx === safeActiveLessonIndex ? { ...l, done: true, savedTimestamp: 0 } : l
        );
        return { ...c, curriculum: updatedCurriculum };
      }
      return c;
    });

    setCoursesList(updatedCourses);

    // If not already done, award +60 XP
    if (!currentLesson.done) {
      const nextXp = userXp + 60;
      const { userLevel: nextLevel } = getLevelInfo(nextXp);
      setUserXp(nextXp);

      persistUserProgress({
        coursesList: updatedCourses,
        userXp: nextXp,
        userLevel: nextLevel
      });
    } else {
      persistUserProgress({ coursesList: updatedCourses });
    }

    // Automatically advance to the next uncompleted lesson in this course
    const nextUndoneIdx = currentCourse.curriculum.findIndex((l, idx) => idx > safeActiveLessonIndex && !l.done);
    if (nextUndoneIdx !== -1) {
      setActiveLessonIndex(nextUndoneIdx);
      const nextSaved = Math.floor(currentCourse.curriculum[nextUndoneIdx].savedTimestamp || 0);
      setLessonInitialStartTime(nextSaved);
      setLessonWatchTimestamp(nextSaved);
    }
  }

  // Filter courses by category and search query
  const filteredCourses = coursesList.filter((course) => {
    const matchesCategory = academyCategory === "All" || course.category.toLowerCase() === academyCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesList = ["All", "Design", "Marketing", "Web Development", "Media", "Business"];

  // Filter courses that are strictly ongoing (user enrolled or started watching, and not 100% completed)
  const ongoingCourses = coursesList.filter((course) => {
    const pct = getCourseProgress(course);
    const hasStartedWatching = course.curriculum && course.curriculum.some((l) => l.done || (l.savedTimestamp && l.savedTimestamp > 0));
    return (course.enrolled || hasStartedWatching || pct > 0) && pct < 100;
  });

  const featuredOngoingCourse = ongoingCourses.length > 0 ? ongoingCourses[0] : null;
  const otherOngoingCourses = ongoingCourses.length > 1 ? ongoingCourses.slice(1) : [];

  // Currently active course and active lesson for the Ongoing Course page with robust fallbacks
  const currentOngoingCourse =
    coursesList.find((c) => c.id === activeCourseId) ||
    coursesList[0] ||
    academyCourses[0];

  const currentCurriculum =
    currentOngoingCourse && currentOngoingCourse.curriculum && currentOngoingCourse.curriculum.length > 0
      ? currentOngoingCourse.curriculum
      : academyCourses[0].curriculum;

  const safeActiveLessonIndex = Math.min(
    Math.max(activeLessonIndex, 0),
    currentCurriculum.length - 1
  );

  const currentOngoingLesson =
    currentCurriculum[safeActiveLessonIndex] ||
    currentCurriculum[0] || {
      title: "Introduction",
      duration: "5 min",
      done: false,
      description: "Lesson details",
      tags: ["Fundamentals"]
    };

  const currentCourseDoneCount = currentCurriculum.filter((l) => l.done).length;
  const currentCourseTotalCount = currentCurriculum.length;
  const currentCourseModulePct = currentCourseTotalCount > 0 ? Math.round((currentCourseDoneCount / currentCourseTotalCount) * 100) : 0;

  // Active lesson total duration and dynamic remaining seconds to collect XP
  const currentLessonTotalSec =
    liveVideoDurationSec > 0
      ? liveVideoDurationSec
      : parseDurationToSeconds(currentOngoingLesson.duration || "5 min");

  const currentLessonRemainingSec = Math.max(0, currentLessonTotalSec - lessonWatchTimestamp);

  // If user is logged in and on dashboard view, show Dashboard
  if (account && view === "dashboard") {
    return (
      <div className="dashboard-app">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <a className="dashboard-logo" href="index.html">
            <span className="brand-logo-text">
              <span className="logo-purple">MyDear</span>
              <span className="logo-dark">Teenager</span>
            </span>
          </a>

          <nav className="dashboard-nav">
            <a
              className={dashboardView === "home" ? "selected" : ""}
              href="#home"
              onClick={(e) => { e.preventDefault(); setDashboardView("home"); window.location.hash = "home"; }}
            >
              <Icon name="home" size={20} />
              <span>Home</span>
            </a>

            <a
              className={dashboardView === "academy" ? "selected" : ""}
              href="#academy"
              onClick={(e) => { e.preventDefault(); setDashboardView("academy"); window.location.hash = "academy"; }}
            >
              <Icon name="academy" size={20} />
              <span>Skill Academy</span>
            </a>

            <a
              className={dashboardView === "learning" ? "selected" : ""}
              href="#learning"
              onClick={(e) => {
                e.preventDefault();
                setDashboardView("learning");
                window.location.hash = "learning";
              }}
            >
              <Icon name="learning" size={20} />
              <span>My Learning</span>
            </a>

            <a href="#projects">
              <Icon name="projects" size={20} />
              <span>Projects</span>
            </a>

            <a href="#portfolio">
              <Icon name="portfolio" size={20} />
              <span>Portfolio</span>
            </a>

            <a href="#community">
              <Icon name="community" size={20} />
              <span>Community</span>
            </a>

            <a href="#opportunities">
              <Icon name="opportunities" size={20} />
              <span>Opportunities</span>
            </a>
          </nav>

          <div className="sidebar-bottom">
            <a href="#notifications">
              <Icon name="notifications" size={20} />
              <span>Notifications</span>
            </a>
            <a href="#settings">
              <Icon name="settings" size={20} />
              <span>Settings</span>
            </a>

            <div className="sidebar-profile-card sidebar-profile-wrapper">
              {showUserDropdown && (
                <div className="sidebar-profile-dropdown">
                  <div className="dropdown-user-header">
                    <img
                      className="dropdown-avatar-thumb"
                      src={account.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={account.name || "User"}
                    />
                    <div className="dropdown-user-text">
                      <strong>{account.name || "Daniel"}</strong>
                      <small>{account.email}</small>
                    </div>
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-logout-btn"
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
              <div
                className="sidebar-profile-inner"
                onClick={() => setShowUserDropdown((prev) => !prev)}
                title="Account menu"
              >
                <img
                  className="profile-img"
                  src={account.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt={account.name || "User"}
                />
                <div className="profile-info">
                  <strong>{account.name || "Daniel"}</strong>
                  <small>★ Level {userLevel} learner</small>
                </div>
                <span className="profile-arrow">{showUserDropdown ? "⌃" : "⌄"}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main className="dashboard-main">
          {/* Topbar */}
          <header className="dashboard-topbar">
            <label className="dashboard-search">
              <Icon name="search" size={18} className="search-icon" />
              <input
                placeholder="What do you want to learn?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>

            <div className="topbar-actions">
              <button className="icon-button notification-btn" aria-label="Notifications">
                <Icon name="bell" size={20} />
                <span className="notification-dot"></span>
              </button>

              <div className="topbar-profile">
                <img
                  className="profile-img-sm"
                  src={account.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt={account.name || "User"}
                />
                <span className="topbar-username">{account.name || "Daniel"}</span>
              </div>
            </div>
          </header>

          {/* VIEW 1: ONGOING COURSE PAGE (Matching Ongoing course.jpeg exactly) */}
          {dashboardView === "course" && (
            <section className="dashboard-content ongoing-course-view-content">
              <div className="ongoing-layout-grid">
                {/* Left/Center Column: Breadcrumb, Lesson Title, Video, About Card */}
                <div className="ongoing-main-col">
                  <div className="ongoing-breadcrumb-row">
                    <button className="ongoing-back-btn" onClick={() => setDashboardView("academy")}>
                      ←
                    </button>
                    <span className="ongoing-breadcrumb-title">
                      {currentOngoingCourse.title} · {currentOngoingCourse.module || "Designing User Interfaces"}
                    </span>
                  </div>

                  <h1 className="ongoing-lesson-title">{currentOngoingLesson.title}</h1>

                  {/* Polished Video Playback Tracker & Restart Controls */}
                  <div className="video-playback-tracker-bar">
                    <div className="playback-info">
                      <span className={`live-dot ${isVideoPlaying ? "is-playing" : "is-paused"}`}></span>
                      <div>
                        {!isVideoPlaying ? (
                          <span>
                            <span className="playback-paused-text">⏸ Paused at {formatSeconds(lessonWatchTimestamp)}</span>{" "}
                            <span className="playback-duration">· {liveVideoDuration || currentOngoingLesson.duration} total</span>
                          </span>
                        ) : lessonInitialStartTime > 4 ? (
                          <span>
                            <span className="playback-resuming-text">Resuming from {formatSeconds(lessonWatchTimestamp)}</span>{" "}
                            <span className="playback-duration">· {liveVideoDuration || currentOngoingLesson.duration} total</span>
                          </span>
                        ) : (
                          <span>
                            <span>Playing: {formatSeconds(lessonWatchTimestamp)}</span>{" "}
                            <span className="playback-duration">· {liveVideoDuration || currentOngoingLesson.duration} total</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {lessonWatchTimestamp > 4 && (
                      <button
                        className="restart-video-link"
                        onClick={() => {
                          setLessonInitialStartTime(0);
                          setLessonWatchTimestamp(0);
                          updateLessonSavedTimestamp(activeCourseId, safeActiveLessonIndex, 0);
                        }}
                        title="Restart this lesson from the beginning"
                      >
                        <span>↺</span>
                        <span>Restart from 0:00</span>
                      </button>
                    )}
                  </div>

                  <div className="ongoing-video-container">
                    <iframe
                      key={`${currentOngoingCourse.id}-${safeActiveLessonIndex}-${lessonInitialStartTime}`}
                      src={`${(currentOngoingLesson.videoUrl || currentOngoingCourse.videoUrl)}?enablejsapi=1&autoplay=1&rel=0${
                        lessonInitialStartTime > 4 ? `&start=${lessonInitialStartTime}` : ""
                      }`}
                      title={currentOngoingLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* About This Lesson Card */}
                  <div className="about-lesson-card">
                    <h3>About this lesson</h3>
                    <p>
                      {currentOngoingLesson.description ||
                        "A typeface sets the tone before a single word is read. Learn how to choose typefaces that match a product's personality, judge readability at different sizes, and pair a display face with a body face without clashing."}
                    </p>
                    <div className="lesson-tags-row">
                      {(currentOngoingLesson.tags || ["Readability", "Type Pairing", "Hierarchy"]).map((tag) => (
                        <span key={tag} className="lesson-tag-pill">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Module Progress, Lessons Curriculum, Action Button */}
                <div className="ongoing-side-col">
                  {/* Module Progress Card */}
                  <div className="module-progress-card">
                    <div className="module-progress-header">
                      <strong>Module Progress</strong>
                      <span>
                        {currentCourseDoneCount}/{currentCourseTotalCount}
                      </span>
                    </div>

                    <div className="meter purple-meter" style={{ marginBottom: ".5rem" }}>
                      <span style={{ width: `${currentCourseModulePct}%` }}></span>
                    </div>

                    <div className="module-meta-row">
                      <span className="ongoing-meta-pill">
                        ⏱ {currentOngoingLesson.done ? "Completed" : `${formatSeconds(currentLessonRemainingSec)} left`}
                      </span>
                      <span className="ongoing-meta-pill xp-pill">⭐ +60 XP</span>
                    </div>

                    <div className="module-instructor-box">
                      <img
                        src={
                          currentOngoingCourse.instructorAvatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        }
                        alt={currentOngoingCourse.instructor}
                      />
                      <div>
                        <strong>{currentOngoingCourse.instructor}</strong>
                        <small>{currentOngoingCourse.instructorRole}</small>
                      </div>
                    </div>
                  </div>

                  {/* Lessons List Card */}
                  <div className="ongoing-curriculum-card">
                    <h3>Lessons</h3>
                    <div className="ongoing-lessons-list">
                      {currentCurriculum.map((lesson, idx) => {
                        const isActive = idx === safeActiveLessonIndex;
                        const isDone = lesson.done;
                        const lessonSavedTime = Math.floor(lesson.savedTimestamp || 0);

                        let subtitleText = lesson.duration;
                        if (isDone) {
                          subtitleText = `Completed ✓ · ${lesson.duration}`;
                        } else if (isActive) {
                          const displayTotal = liveVideoDuration || lesson.duration;
                          subtitleText = !isVideoPlaying
                            ? `⏸ Paused at ${formatSeconds(lessonWatchTimestamp)} / ${displayTotal}`
                            : `▶ ${formatSeconds(lessonWatchTimestamp)} / ${displayTotal}`;
                        } else if (lessonSavedTime > 4) {
                          subtitleText = `Resumes at ${formatSeconds(lessonSavedTime)} / ${lesson.duration}`;
                        }

                        return (
                          <div
                            key={idx}
                            className={`ongoing-lesson-row ${isActive ? "is-active" : ""}`}
                            onClick={() => {
                              setActiveLessonIndex(idx);
                              const initialTime = Math.floor((lesson && lesson.savedTimestamp) || 0);
                              setLessonInitialStartTime(initialTime);
                              setLessonWatchTimestamp(initialTime);
                              setLiveVideoDurationSec(0);
                              setIsVideoPlaying(true);
                            }}
                          >
                            <div className="ongoing-lesson-row-left">
                              <span
                                className={`lesson-state-icon ${
                                  isDone ? "done" : isActive ? "active" : "upcoming"
                                }`}
                              >
                                {isDone ? "✓" : isActive ? "▶" : idx + 1}
                              </span>
                              <div className="lesson-row-info">
                                <h4>{lesson.title}</h4>
                                <small>{subtitleText}</small>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mark As Complete Button */}
                  <button
                    className={`ongoing-mark-complete-btn ${currentOngoingLesson.done ? "is-completed" : ""}`}
                    onClick={completeCurrentOngoingLesson}
                  >
                    {currentOngoingLesson.done ? "Lesson Completed ✓ (+60 XP)" : "Mark as complete →"}
                  </button>
                </div>
              </div>

              {/* Bottom motivational status banner */}
              <div className="dashboard-status-footer" style={{ marginTop: "3rem" }}>
                <p>
                  You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}.
                  <Icon name="pencil" size={16} className="footer-pencil-icon" />
                </p>
              </div>
            </section>
          )}

          {/* VIEW 2: MY LEARNING (Matching dashboard-my learning.jpeg) */}
          {dashboardView === "learning" && (
            <section className="dashboard-content my-learning-view-content">
              <div className="my-learning-header-block">
                <span className="my-learning-breadcrumb-label">My Learning</span>
                <h1 className="my-learning-main-title">Pick up where you left off</h1>
                <p className="my-learning-main-subtitle">
                  All the skills you're building, with your progress saved lesson by lesson.
                </p>
              </div>

              {ongoingCourses.length > 0 ? (
                <div className="my-learning-cards-list">
                  {ongoingCourses.map((course) => {
                    const progressPct = getCourseProgress(course);
                    const activeLesson =
                      (course.curriculum && course.curriculum.find((l) => !l.done)) ||
                      (course.curriculum && course.curriculum[0]) || { title: "Creating Effective Layouts" };
                    const activeLessonIdx =
                      course.curriculum ? course.curriculum.findIndex((l) => !l.done) : 0;

                    return (
                      <article
                        key={course.id}
                        className="ongoing-banner-card"
                        onClick={() => openCourseVideo(course, activeLessonIdx !== -1 ? activeLessonIdx : 0)}
                      >
                        <div className="ongoing-banner-thumb-box">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                        </div>

                        <div className="ongoing-banner-info">
                          <span className="ongoing-resuming-pill">Resuming</span>
                          <h2 className="ongoing-banner-title">{course.title}</h2>
                          <p className="ongoing-banner-module">
                            Module: {course.module || "Designing User Interfaces"} · Lesson:{" "}
                            {activeLesson ? activeLesson.title : "Creating Effective Layouts"}
                          </p>
                          <div className="ongoing-banner-progress-bar">
                            <div
                              className="ongoing-banner-progress-fill"
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          className="ongoing-banner-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCourseVideo(course, activeLessonIdx !== -1 ? activeLessonIdx : 0);
                          }}
                        >
                          <span>Continue</span>
                          <span>▶</span>
                        </button>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="no-learning-courses">
                  <h3>No ongoing courses right now!</h3>
                  <p>
                    Explore our courses in the Skill Academy, start learning, and your ongoing progress will automatically appear here.
                  </p>
                  <button
                    className="primary-button inline-purple-btn"
                    style={{ display: "inline-flex", margin: "0 auto" }}
                    onClick={() => setDashboardView("academy")}
                  >
                    Explore Skill Academy →
                  </button>
                </div>
              )}

              {/* Bottom motivational status banner */}
              <div className="dashboard-status-footer" style={{ marginTop: "3.5rem" }}>
                <p>
                  You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}.
                  <Icon name="pencil" size={16} className="footer-pencil-icon" />
                </p>
              </div>
            </section>
          )}

          {/* VIEW 3: SKILL ACADEMY (Matching dashdord-skill academy.jpeg) */}
          {dashboardView === "academy" && (
            <section className="dashboard-content academy-view-content">
              <div className="academy-header-block">
                <span className="academy-breadcrumb-label">Skill Academy</span>
                <h1 className="academy-main-title">Explore skills to learn</h1>
                <p className="academy-main-subtitle">
                  Hand-picked skill tracks to help you grow. Enroll in anything that sparks your curiosity.
                </p>

                {/* Category Pills Filter */}
                <div className="category-pill-group">
                  {categoriesList.map((category) => (
                    <button
                      key={category}
                      className={`category-pill ${academyCategory === category ? "active" : ""}`}
                      onClick={() => setAcademyCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Cards Grid */}
              <div className="academy-courses-grid">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const progress = getCourseProgress(course);
                    const isEnrolled = progress > 0;
                    const isCompleted = progress === 100;

                    let btnText = "Enroll Now";
                    let btnTheme = "btn-solid-purple";

                    if (isCompleted) {
                      btnText = "Completed (100%) ✓";
                      btnTheme = "btn-light-purple";
                    } else if (isEnrolled) {
                      btnText = `Continue (${progress}%)`;
                      btnTheme = "btn-light-purple";
                    }

                    return (
                      <article key={course.id} className="academy-course-card" onClick={() => openCourseVideo(course)}>
                        <div className="card-thumbnail-container">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="card-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          <div className="thumbnail-play-overlay">
                            <span className="play-circle">
                              <Icon name="play" size={20} />
                            </span>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="card-meta">
                            <Icon name="lessons" size={16} className="meta-icon" />
                            <span>{course.meta}</span>
                          </div>

                          <h3 className="card-title">{course.title}</h3>
                          <p className="card-desc">{course.description}</p>

                          <div className="card-footer-action">
                            <button
                              className={`card-action-btn ${btnTheme}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                openCourseVideo(course);
                              }}
                            >
                              <span>{btnText}</span>
                              <span className="action-arrow">→</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="no-courses-found">
                    <p>No skill tracks found matching your filter.</p>
                    <button className="primary-button inline-btn" onClick={() => { setAcademyCategory("All"); setSearchQuery(""); }}>
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom motivational status banner */}
              <div className="dashboard-status-footer">
                <p>
                  You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}.
                  <Icon name="pencil" size={16} className="footer-pencil-icon" />
                </p>
              </div>
            </section>
          )}

          {/* VIEW 4: HOME DASHBOARD (Matching Dashboard-home.jpeg exactly) */}
          {dashboardView === "home" && (
            <section className="dashboard-content home-view-content">
              {/* 1. Hero Banner */}
              <div className="dashboard-hero">
                <div className="hero-text-side">
                  <span className="hero-pill">
                    {streak === 0 ? "Start your daily streak" : (streak === 1 ? "On a 1 day streak" : `On a ${streak} day streak`)}
                  </span>
                  <h1>Good Morning, {account.name || "Daniel"}</h1>
                  <p>Small steps every day. Keep building the future you want.</p>
                  <small>You're making great progress this week. Keep your learning streak going.</small>
                  <div className="hero-actions">
                    <button
                      className="hero-btn-white"
                      onClick={() => {
                        if (featuredOngoingCourse) {
                          openCourseVideo(featuredOngoingCourse);
                        } else {
                          setDashboardView("academy");
                        }
                      }}
                    >
                      {featuredOngoingCourse ? "Resume Learning →" : "Start Learning →"}
                    </button>
                    <button className="hero-btn-outline" onClick={() => setDashboardView("academy")}>
                      Explore Skills →
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Top Summary 4 Cards (Weekly Streak, Level & Courses, Total XP, Projects) */}
              <div className="summary-grid-4">
                {/* Card 1: Weekly Streak */}
                <section className="summary-card streak-card">
                  <div className="card-top-badge">
                    <span className="card-label">🔥 Weekly Streak</span>
                    <span className="pill-xp">+{userXp} XP this week</span>
                  </div>
                  <strong className="summary-card-title">{streak} {streak === 1 ? "Day" : "Days"}</strong>
                  <div className="week-days-14">
                    <div className="week-days-row">
                      {["01", "02", "03", "04", "05", "06", "07"].map((day, index) => (
                        <span className={index < streak ? "done" : ""} key={day}>
                          {day}
                          <b>✓</b>
                        </span>
                      ))}
                    </div>
                    <div className="week-days-row">
                      {["08", "09", "10", "11", "12", "13", "14"].map((day, index) => (
                        <span className={index + 7 < streak ? "done" : ""} key={day}>
                          {day}
                          <b>✓</b>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`orange-button ${isStreakClaimedToday ? "disabled-btn" : ""}`}
                    onClick={incrementStreak}
                    disabled={isStreakClaimedToday}
                    title={isStreakClaimedToday ? "Streak already recorded for today! Come back tomorrow to continue your streak." : "Click to keep your daily streak going"}
                  >
                    {isStreakClaimedToday ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Streak Kept for Today!</span>
                      </>
                    ) : (
                      <>
                        <span className="streak-flame-icon">🔥</span>
                        <span>{streak === 0 ? "Start Daily Streak" : "Keep It Going"}</span>
                      </>
                    )}
                  </button>
                </section>

                {/* Card 2: Current Level & Active Courses */}
                <section className="summary-card level-courses-card">
                  <div className="level-top-half">
                    <div className="card-header-icon-row">
                      <div>
                        <div className="card-label">Current Level</div>
                        <strong className="summary-card-title">Level {userLevel || 4}</strong>
                      </div>
                      <span className="card-corner-icon purple-icon-box">
                        <Icon name="chart" size={16} />
                      </span>
                    </div>
                    <div className="meter-group">
                      <div className="meter-label-row">
                        <small>To Level {userLevel + 1}</small>
                        <b>{levelProgressPct}%</b>
                      </div>
                      <div className="meter purple-meter">
                        <span style={{ width: `${levelProgressPct}%` }}></span>
                      </div>

                      <div className="meter-label-row">
                        <small>Weekly XP Goal</small>
                        <b>{weeklyXpGoalPct}%</b>
                      </div>
                      <div className="meter orange-meter">
                        <span style={{ width: `${weeklyXpGoalPct}%` }}></span>
                      </div>
                    </div>
                  </div>

                  <div className="card-inner-divider"></div>

                  <div className="courses-bottom-half">
                    <div className="card-header-icon-row">
                      <div>
                        <div className="card-label">Courses</div>
                        <strong className="summary-card-title-sm">{ongoingCourses.length} Active</strong>
                      </div>
                      <span className="card-corner-icon blue-icon-box">
                        <Icon name="monitor" size={16} />
                      </span>
                    </div>
                    <div className="courses-dots-list">
                      {ongoingCourses.length === 0 ? (
                        <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "0.4rem 0", fontStyle: "italic" }}>
                          No active courses yet
                        </p>
                      ) : (
                        ongoingCourses.slice(0, 3).map((c, i) => {
                          const dotClasses = ["dot-purple", "dot-blue", "dot-dark-purple"];
                          return (
                            <div className="course-dot-item" key={c.id}>
                              <span><i className={dotClasses[i % dotClasses.length]}>●</i> {c.title}</span>
                              <b>{getCourseProgress(c)}%</b>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </section>

                {/* Card 3: Total XP & Chart */}
                <section className="summary-card xp-chart-card">
                  <div className="card-header-icon-row">
                    <div>
                      <div className="card-label">Total XP</div>
                      <strong className="summary-card-title">{userXp.toLocaleString()} <small>XP</small></strong>
                    </div>
                    <span className="card-corner-icon orange-icon-box">
                      <Icon name="trophy" size={16} />
                    </span>
                  </div>
                  <div className="meter-label-row" style={{ marginTop: ".3rem", marginBottom: ".55rem" }}>
                    <small>This Week</small>
                    <b style={{ color: "#4c4660" }}>+{userXp} XP</b>
                  </div>
                  <div className="xp-bar-chart-7">
                    <div className="xp-bar-col"><span style={{ height: "45%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "65%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "35%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "55%" }}></span></div>
                    <div className="xp-bar-col active"><span style={{ height: "95%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "30%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "40%" }}></span></div>
                  </div>
                </section>

                {/* Card 4: Projects */}
                <section className="summary-card projects-status-card">
                  <div className="card-header-icon-row">
                    <div>
                      <div className="card-label">Projects</div>
                      <strong className="summary-card-title">{projects.length} Completed</strong>
                    </div>
                    <span className="card-corner-icon green-icon-box">
                      <Icon name="check" size={16} />
                    </span>
                  </div>

                  <div className="card-inner-divider"></div>

                  <div className="projects-shipped-section">
                    <div className="card-label" style={{ marginBottom: ".45rem" }}>Recently Shipped</div>
                    {projects.length === 0 ? (
                      <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "0.4rem 0", fontStyle: "italic" }}>
                        No projects completed yet
                      </p>
                    ) : (
                      <ul className="shipped-projects-list">
                        {projects.slice(0, 3).map((p) => (
                          <li key={p.id}>
                            <span className="check-green-icon">✓</span>
                            <span>{p.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </div>

              {/* 3. Continue Learning Section (Dynamic: Empty when 0 ongoing courses, Real cards when enrolled) */}
              <section className="continue-learning-home-section" id="learning">
                <div className="section-heading">
                  <div>
                    <h2>Continue Learning</h2>
                    <p>{ongoingCourses.length > 0 ? "Pick up where you left off." : "You have not enrolled in any courses yet."}</p>
                  </div>
                  <a
                    href="#academy"
                    className="section-header-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setDashboardView("academy");
                    }}
                  >
                    View all courses →
                  </a>
                </div>

                {ongoingCourses.length === 0 ? (
                  <div className="continue-learning-empty-box">
                    <div className="empty-learning-icon-circle">
                      <Icon name="monitor" size={28} />
                    </div>
                    <h3>No courses in progress</h3>
                    <p>You haven't enrolled or started watching any courses yet. Explore our Skills Academy to begin your learning journey!</p>
                    <button
                      type="button"
                      className="empty-enroll-btn"
                      onClick={() => setDashboardView("academy")}
                    >
                      Explore Skills Academy →
                    </button>
                  </div>
                ) : (
                  <div className="continue-learning-grid-layout">
                    {/* Left Large Featured Card (Dynamic!) */}
                    {featuredOngoingCourse && (
                      <div
                        className="featured-course-banner-card"
                        onClick={() => openCourseVideo(featuredOngoingCourse)}
                      >
                        <div className="featured-thumb-laptop-mockup">
                          <img
                            src={featuredOngoingCourse.thumbnail}
                            alt={featuredOngoingCourse.title}
                          />
                          <div className="laptop-play-btn-circle">
                            <Icon name="play" size={24} />
                          </div>
                        </div>

                        <div className="featured-banner-content">
                          <div className="featured-header-row">
                            <h3>{featuredOngoingCourse.title}</h3>
                            <span className="duration-pill-lavender">⏱ {featuredOngoingCourse.duration || "18 Mins"}</span>
                          </div>
                          <p className="featured-module-label">
                            Module: <strong>{featuredOngoingCourse.curriculum && featuredOngoingCourse.curriculum[0] && featuredOngoingCourse.curriculum[0].tags ? featuredOngoingCourse.curriculum[0].tags[0] : "Core Track"}</strong>
                          </p>
                          <p className="featured-lesson-label">
                            Lesson: <strong>{featuredOngoingCourse.curriculum && featuredOngoingCourse.curriculum.find((l) => !l.done) ? featuredOngoingCourse.curriculum.find((l) => !l.done).title : (featuredOngoingCourse.curriculum[0] && featuredOngoingCourse.curriculum[0].title ? featuredOngoingCourse.curriculum[0].title : "Lesson 1")}</strong>
                          </p>

                          <div className="featured-course-progress-block">
                            <div className="progress-text-row">
                              <small>Course Progress</small>
                              <b>{getCourseProgress(featuredOngoingCourse)}%</b>
                            </div>
                            <div className="meter purple-meter">
                              <span style={{ width: `${getCourseProgress(featuredOngoingCourse)}%` }}></span>
                            </div>
                          </div>

                          <div className="featured-instructor-action-row">
                            <div className="instructor-mini-profile">
                              <img
                                src={featuredOngoingCourse.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                                alt={featuredOngoingCourse.instructor}
                              />
                              <div>
                                <strong>{featuredOngoingCourse.instructor}</strong>
                                <small>{featuredOngoingCourse.instructorRole || "Tutor"}</small>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="featured-continue-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openCourseVideo(featuredOngoingCourse);
                              }}
                            >
                              <span>Continue Learning</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Right Stacked Mini Ongoing Cards (Dynamic!) */}
                    <div className="mini-courses-stacked-col">
                      {otherOngoingCourses.length > 0 ? (
                        otherOngoingCourses.slice(0, 2).map((course) => {
                          const pct = getCourseProgress(course);
                          return (
                            <div
                              className="mini-ongoing-card"
                              key={course.id}
                              onClick={() => openCourseVideo(course)}
                            >
                              <div className="mini-card-thumb">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                />
                              </div>
                              <div className="mini-card-info">
                                <div className="mini-card-top-row">
                                  <h4>{course.title}</h4>
                                  <b className="blue-pct">{pct}%</b>
                                </div>
                                <small className="mini-category">{course.category}</small>
                                <div className="meter blue-meter">
                                  <span style={{ width: `${pct}%` }}></span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          className="mini-ongoing-card mini-enroll-prompt-card"
                          onClick={() => setDashboardView("academy")}
                        >
                          <div className="mini-prompt-content">
                            <h4>Explore More Skills</h4>
                            <small>Enroll in additional courses to expand your skill set.</small>
                            <span className="browse-more-link">Browse Academy →</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* 4. Middle 2-Column: "Your Next Step" & "Your Growth" */}
              <div className="next-growth-grid-2">
                {/* Left: Your Next Step */}
                <section className="dashboard-panel next-step-panel">
                  <span className="next-step-badge-pill">✦ Your Next Step</span>
                  {featuredOngoingCourse ? (
                    <>
                      <div className="next-step-content-row">
                        <div className="next-step-icon-square">
                          <Icon name="monitor" size={24} />
                        </div>
                        <div>
                          <h3>
                            {featuredOngoingCourse.curriculum && featuredOngoingCourse.curriculum.find((l) => !l.done)
                              ? featuredOngoingCourse.curriculum.find((l) => !l.done).title
                              : "Continue Your Course"}
                          </h3>
                          <p>
                            {featuredOngoingCourse.title} • {getCourseProgress(featuredOngoingCourse)}% completed
                          </p>
                        </div>
                      </div>

                      <div className="next-step-tags-row">
                        <span className="next-tag-pill">⏱ 15 Min</span>
                        <span className="next-tag-pill xp-orange-tag">⭐ +50 XP</span>
                      </div>

                      <button
                        type="button"
                        className="start-lesson-full-btn"
                        onClick={() => openCourseVideo(featuredOngoingCourse)}
                      >
                        ▶ Resume Lesson
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="next-step-content-row">
                        <div className="next-step-icon-square">
                          <Icon name="monitor" size={24} />
                        </div>
                        <div>
                          <h3>Start Your First Course</h3>
                          <p>Browse our curated tracks and start building real skills.</p>
                        </div>
                      </div>

                      <div className="next-step-tags-row">
                        <span className="next-tag-pill">⏱ 15 Min</span>
                        <span className="next-tag-pill xp-orange-tag">⭐ +50 XP</span>
                      </div>

                      <button
                        type="button"
                        className="start-lesson-full-btn"
                        onClick={() => setDashboardView("academy")}
                      >
                        ▶ Browse Courses
                      </button>
                    </>
                  )}
                </section>

                {/* Right: Your Growth */}
                <section className="dashboard-panel your-growth-panel">
                  <div className="growth-header-row">
                    <div>
                      <h2>Your Growth</h2>
                      <p>Level up by earning XP</p>
                    </div>
                  </div>

                  <div className="growth-body-row">
                    <div className="growth-level-donut-box">
                      <svg className="level-donut-svg" viewBox="0 0 100 100">
                        <circle
                          className="donut-bg-ring"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="8"
                        />
                        <circle
                          className="donut-fill-ring"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="8"
                          strokeDasharray={251.32}
                          strokeDashoffset={251.32 * (1 - levelProgressPct / 100)}
                        />
                      </svg>
                      <div className="donut-center-text">
                        <small>Level</small>
                        <strong>{userLevel || 4}</strong>
                      </div>
                    </div>

                    <div className="growth-xp-info-col">
                      <div className="growth-xp-number">
                        <strong>{userXp.toLocaleString()}</strong> <small>/3000 XP</small>
                      </div>
                      <div className="growth-xp-pill-bar">
                        <span>✦ {xpToNext} XP to Level {userLevel + 1}</span>
                        <div className="pill-meter-bar">
                          <span style={{ width: `${levelProgressPct}%` }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* 5. Recent Achievements */}
              <section className="dashboard-panel achievements-panel" id="portfolio">
                <div className="section-heading">
                  <div>
                    <h2>Recent Achievements</h2>
                    <p>Badges you've picked up on your journey</p>
                  </div>
                  <a href="#portfolio" className="section-header-link">
                    View All →
                  </a>
                </div>

                <div className="achievement-cards-row-4">
                  <article className="achievement-card">
                    <div className="achievement-icon-box orange-box">
                      <Icon name="badge-fire" size={32} />
                    </div>
                    <strong>{streak > 0 ? `${streak} Day Streak` : "Daily Streak"}</strong>
                    <small>{streak > 0 ? `Learned ${streak} ${streak === 1 ? "day" : "days"} straight` : "Log in daily to build streak"}</small>
                  </article>

                  <article className="achievement-card">
                    <div className="achievement-icon-box blue-box">
                      <Icon name="badge-project" size={32} />
                    </div>
                    <strong>First Project</strong>
                    <small>Shipped your first build</small>
                  </article>

                  <article className="achievement-card">
                    <div className="achievement-icon-box green-box">
                      <Icon name="badge-quiz" size={32} />
                    </div>
                    <strong>Quiz Champion</strong>
                    <small>Aced 5 quizzes in a row</small>
                  </article>

                  <article className="achievement-card">
                    <div className="achievement-icon-box purple-box">
                      <Icon name="badge-skill" size={32} />
                    </div>
                    <strong>Skill Explorer</strong>
                    <small>Tried 3 new skill tracks</small>
                  </article>
                </div>
              </section>

              {/* 6. Opportunities for You (Dark Card) */}
              <section className="opportunities-dark-container" id="opportunities">
                <div className="opp-header-row">
                  <div>
                    <h2>Opportunities for You</h2>
                    <p>Discover ways to put your skills to action</p>
                  </div>
                  <a href="#opportunities" className="browse-all-link">Browse All →</a>
                </div>

                <div className="opportunities-3-cards-grid">
                  <article className="opp-dark-card">
                    <div className="opp-top-tags-row">
                      <span className="opp-pill-tag purple-tag">Competition</span>
                      <span className="opp-meta-category">Design</span>
                    </div>
                    <h3>Young Creators Challenge</h3>
                    <p>Submit an original design project and win mentorship + prizes.</p>
                    <div className="opp-footer-row">
                      <span className="opp-deadline">⏱ Deadline: Sept 12</span>
                      <button className="opp-view-btn">View All →</button>
                    </div>
                  </article>

                  <article className="opp-dark-card">
                    <div className="opp-top-tags-row">
                      <span className="opp-pill-tag green-tag">Scholarships</span>
                      <span className="opp-meta-category">All Skills</span>
                    </div>
                    <h3>Future Leaders Scholarship</h3>
                    <p>Full funding for a year of premium skill tracks and workshops.</p>
                    <div className="opp-footer-row">
                      <span className="opp-deadline">⏱ Deadline: Sept 20</span>
                      <button className="opp-view-btn">View All →</button>
                    </div>
                  </article>

                  <article className="opp-dark-card">
                    <div className="opp-top-tags-row">
                      <span className="opp-pill-tag blue-tag">Workshop</span>
                      <span className="opp-meta-category">Marketing</span>
                    </div>
                    <h3>Digital Skills Workshop</h3>
                    <p>A hands-on live session on building your first online portfolio.</p>
                    <div className="opp-footer-row">
                      <span className="opp-deadline">⏱ Deadline: Sept 28</span>
                      <button className="opp-view-btn">View All →</button>
                    </div>
                  </article>
                </div>
              </section>

              {/* 7. Bottom 2-Column: Coming Up & Recent Updates */}
              <div className="coming-updates-grid-2">
                {/* Left: Coming Up */}
                <section className="dashboard-panel coming-up-panel">
                  <h2>Coming Up</h2>
                  <div className="coming-event-box">
                    <div className="calendar-date-badge">
                      <span>Tue</span>
                      <strong>17</strong>
                    </div>
                    <div className="event-info-side">
                      <div className="event-live-pill">📹 Live Design Q&A</div>
                      <div className="event-time-text">Tomorrow · 4pm</div>
                      <div className="event-instructor-row">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                          alt="Joseph Joestar"
                        />
                        <span>With Joseph Joestar</span>
                      </div>
                    </div>
                  </div>
                  <button className="view-details-outline-btn">View Details</button>
                </section>

                {/* Right: Recent Updates */}
                <section className="dashboard-panel recent-updates-panel">
                  <div className="section-heading">
                    <div>
                      <h2>Recent Updates</h2>
                    </div>
                    <a href="#updates" className="section-header-link">See all</a>
                  </div>
                  <div className="updates-list">
                    <div className="update-list-item">
                      <span className="update-circle-icon orange-circle">🔥</span>
                      <div className="update-content">
                        <p>{streak > 0 ? `You earned the ${streak} day streak` : "Start a learning streak today"}</p>
                        <small>2hrs ago</small>
                      </div>
                    </div>
                    <div className="update-list-item">
                      <span className="update-circle-icon blue-circle">💬</span>
                      <div className="update-content">
                        <p>Your tutor left feedback on your project.</p>
                        <small>5hrs ago</small>
                      </div>
                    </div>
                    <div className="update-list-item">
                      <span className="update-circle-icon green-circle">🌱</span>
                      <div className="update-content">
                        <p>A new opportunity matching your interests was added.</p>
                        <small>Yesterday</small>
                      </div>
                    </div>
                    <div className="update-list-item">
                      <span className="update-circle-icon purple-circle">🎓</span>
                      <div className="update-content">
                        <p>You completed Module 3.</p>
                        <small>Yesterday</small>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* 8. Bottom Motivational Status Footer */}
              <div className="dashboard-status-footer" style={{ marginTop: "2.5rem" }}>
                <p>
                  You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}. 🪄
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }

  // Auth / Welcome / Signup / Login Views
  return (
    <div className="welcome-page-shell">
      {/* 1. Top Navbar with logo image at the left end */}
      <header className="welcome-navbar">
        <div className="welcome-nav-inner">
          <a className="welcome-brand-link" href="index.html" title="Back to Home">
            <img
              src="./Images/logo.png"
              alt="MyDearTeenager"
              className="welcome-brand-logo-img"
            />
          </a>
          <div className="welcome-nav-user">
            <button
              className="welcome-profile-avatar-btn"
              onClick={() => {
                if (account) {
                  setView("dashboard");
                  window.location.hash = "home";
                } else {
                  setView(view === "login" ? "welcome" : "login");
                  setNotice("");
                }
              }}
              aria-label="Account"
              title={account ? `Logged in as ${account.name || "User"}` : "Log in"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Stage */}
      {view === "welcome" ? (
        /* Welcome Overview matching sign-up-page.png */
        <main className={`welcome-main-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Illustration Card */}
          <div className="welcome-card-wrap">
            <img
              className="welcome-card-img"
              src="./Images/sign-up-img.svg?v=3"
              alt="MyDearTeenager Learning Journey"
            />
          </div>

          {/* Heading */}
          <h1 className="welcome-title">
            Welcome to<br />
            <span className="welcome-brand-name">
              <span className="purple-text">MyDear</span>
              <span className="dark-text">Teenager</span>{" "}
              <span className="hand-emoji">👋</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="welcome-subtitle">
            Learn practical skills, build better habits, and prepare<br />
            for your future one step at a time.
          </p>

          {/* Buttons Stack */}
          <div className="welcome-actions">
            <button
              className="welcome-primary-btn"
              onClick={(e) => {
                e.currentTarget.classList.add("btn-launching");
                transitionToView("signup", "forward");
              }}
            >
              Let's Get Started →
            </button>

            <button
              className="welcome-secondary-btn"
              onClick={(e) => {
                e.currentTarget.classList.add("btn-launching");
                transitionToView("login", "forward");
              }}
            >
              I already have an account
            </button>
          </div>
        </main>
      ) : view === "signup" ? (
        /* Sign Up Form View - EXACT match to sign-up-form.png */
        <main className={`signup-flow-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Progress Stepper Bar matching sign-up-form.png */}
          <div className="signup-stepper-header">
            <span className="stepper-counter">02 / 07</span>
            <div className="stepper-segments">
              <span className="step-bar step-done"></span>
              <span className="step-bar step-done"></span>
              <span className="step-bar step-pending"></span>
              <span className="step-bar step-pending"></span>
              <span className="step-bar step-pending"></span>
              <span className="step-bar step-pending"></span>
              <span className="step-bar step-pending"></span>
            </div>
          </div>

          {/* Heading & Subtitle matching sign-up-form.png */}
          <div className="signup-heading-block">
            <h1 className="signup-title">Let's get you started</h1>
            <p className="signup-subtitle">
              Create your account and start building your learning journey.
            </p>
          </div>

          {/* Card Wrapper with exact background circles matching sign-up-form.png */}
          <div className="signup-card-wrapper">
            <div className="signup-bg-circle signup-bg-circle-top" aria-hidden="true"></div>
            <div className="signup-bg-circle signup-bg-circle-bottom" aria-hidden="true"></div>

            <form className="signup-card-container" onSubmit={submitAuth}>
            {/* Role Switcher Tabs */}
            <div className="role-selector-pills">
              <button
                type="button"
                className={`role-pill-btn ${userRole === "teenager" ? "active" : ""}`}
                onClick={() => setUserRole("teenager")}
              >
                I am a teenager / learner
              </button>
              <button
                type="button"
                className={`role-pill-btn ${userRole === "parent" ? "active" : ""}`}
                onClick={() => setUserRole("parent")}
              >
                I am a parent / mentor
              </button>
            </div>

            {/* Field 1: Full Name */}
            <div className="signup-field-group">
              <label className="signup-field-label">Full Name</label>
              <div className="signup-input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  name="name"
                  type="text"
                  className="signup-text-input"
                  value={form.name}
                  onChange={updateForm}
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            {/* Field 2: Email Address */}
            <div className="signup-field-group">
              <label className="signup-field-label">Email Address</label>
              <div className="signup-input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  name="email"
                  type="email"
                  className="signup-text-input"
                  value={form.email}
                  onChange={updateForm}
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>

            {/* Field 3: Password */}
            <div className="signup-field-group">
              <label className="signup-field-label">Password</label>
              <div className="signup-input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="signup-text-input"
                  value={form.password}
                  onChange={updateForm}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Field 4: Confirm Password */}
            <div className="signup-field-group">
              <label className="signup-field-label">Confirm Password</label>
              <div className="signup-input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                </span>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="signup-text-input"
                  value={form.confirmPassword}
                  onChange={updateForm}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox: Terms of Service */}
            <div className="signup-checkbox-row">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                className="signup-custom-checkbox"
                checked={form.agreeTerms || false}
                onChange={updateForm}
                required
              />
              <label htmlFor="agreeTerms" className="signup-checkbox-label">
                I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </label>
            </div>

            {notice && <p className="signup-notice-box" role="alert">{notice}</p>}

            {/* Hidden submit trigger so Enter key works inside inputs */}
            <button type="submit" style={{ display: "none" }} aria-hidden="true"></button>
          </form>
        </div>

          {/* Already have an account link */}
          <div className="signup-bottom-switch">
            Already have an account?{" "}
            <button
              type="button"
              className="signup-switch-link"
              onClick={() => transitionToView("login", "forward")}
            >
              Log in
            </button>
          </div>

          {/* Floating Bottom Action Dock matching sign-up-form.png */}
          <div className="signup-bottom-dock">
            <button
              type="button"
              className="dock-back-btn"
              onClick={() => transitionToView("welcome", "backward")}
            >
              ← Back
            </button>
            <button
              type="button"
              className="dock-create-btn"
              onClick={submitAuth}
            >
              Create My Account →
            </button>
          </div>
        </main>
      ) : (
        /* Login Form View - EXACT match to Images/login-page.png */
        <main className={`login-page-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          <div className="login-card-container">
            <h1 className="login-title">Welcome back!</h1>
            <p className="login-subtitle">
              Log in to your account and continue your learning journey.
            </p>

            <form onSubmit={submitAuth}>
              {/* Field 1: Email Address */}
              <div className="login-field-group">
                <label className="login-field-label">Email Address</label>
                <div className="login-input-wrapper">
                  <span className="input-prefix-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateForm}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="login-field-group">
                <label className="login-field-label">Password</label>
                <div className="login-input-wrapper">
                  <span className="input-prefix-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateForm}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="input-suffix-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password? Row */}
              <div className="login-options-row">
                <label className="remember-me-toggle">
                  <input
                    type="checkbox"
                    className="remember-me-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="remember-me-label">Remember me</span>
                </label>
                <a
                  href="#"
                  className="forgot-password-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setNotice("Password reset instruction has been sent to your email.");
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {notice && <p className="signup-notice-box" role="alert">{notice}</p>}

              {/* Primary Submit Button */}
              <button type="submit" className="login-submit-btn">
                Log In →
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider-row">
              <span className="login-divider-text">Or log in with</span>
            </div>

            {/* Social Logins designed as links for easy backend integration */}
            <a
              href="/auth/google"
              className="social-login-btn social-google-btn"
              onClick={(e) => {
                // If backend route is not hooked up yet, fall back to preview login
                if (e.currentTarget.getAttribute("href") === "/auth/google" || e.currentTarget.getAttribute("href") === "#") {
                  e.preventDefault();
                  const demoUser = usersDb[0] || defaultAccount;
                  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(demoUser));
                  setAccount(demoUser);
                  setView("dashboard");
                  setDashboardView("home");
                  window.location.hash = "home";
                }
              }}
              title="Continue with Google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google</span>
            </a>

            <a
              href="/auth/apple"
              className="social-login-btn social-apple-btn"
              onClick={(e) => {
                // If backend route is not hooked up yet, fall back to preview login
                if (e.currentTarget.getAttribute("href") === "/auth/apple" || e.currentTarget.getAttribute("href") === "#") {
                  e.preventDefault();
                  const demoUser = usersDb[0] || defaultAccount;
                  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(demoUser));
                  setAccount(demoUser);
                  setView("dashboard");
                  setDashboardView("home");
                  window.location.hash = "home";
                }
              }}
              title="Continue with Apple"
            >
              {/* Official Apple Logo SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-.99 1.7-.85 2.72.99.08 2-.51 2.55-1.22z"/>
              </svg>
              <span>Apple</span>
            </a>

            {/* Bottom Switch Text */}
            <p className="login-footer-copy">
              Don't have an account?{" "}
              <button
                type="button"
                className="login-switch-link"
                onClick={() => transitionToView("signup", "backward")}
              >
                Sign up
              </button>
            </p>
          </div>
        </main>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AuthPage />);
