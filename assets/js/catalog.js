/* Skill Academy catalogue. Draft learning paths carried over from the earlier prototype.
   Edit here: titles, lengths and modules all render from this list. Everything is marked "In development" on the site. */
window.MDT_COURSES = [
  {
    id: "ui-ux-design", title: "UI/UX Design Fundamentals", cat: "design", level: "Beginner", length: "4 weeks", icon: "design_services", cover: "--book",
    blurb: "Design apps and websites people enjoy using.",
    about: "Learn how good screens are put together, from type and spacing to colour and layout, then turn a paper sketch into a clickable prototype.",
    modules: [["What is typography", "Font weights, sizes and how text shapes what people feel."], ["Layouts, spacing and grids", "Why some screens feel calm and others feel messy."], ["Colour that everyone can read", "Pick palettes that pass contrast checks and still look good."], ["From wireframe to prototype", "Turn sketches into a clickable design in Figma."]],
    make: "A landing page design for a real local business"
  },
  {
    id: "content-creation", title: "Digital Content Creation", cat: "media", level: "Intermediate", length: "6 weeks", icon: "videocam", cover: "--book-2",
    blurb: "Shoot, edit and publish videos people watch to the end.",
    about: "Storytelling for video, audio and social media, shot and edited on the phone you already have.",
    modules: [["Camera angles, lighting and phone set-ups", "Frame good shots with light you can find at home."], ["Storyboards and the first three seconds", "Hooks, story arcs and pacing that keep people watching."], ["Editing in CapCut", "Cuts, transitions, sound effects and colour."], ["Sound, music and publishing", "Copyright-free music, clean voiceovers and thumbnails."]],
    make: "A three-minute mini documentary about your neighbourhood"
  },
  {
    id: "coding-basics", title: "Coding Basics", cat: "tech", level: "Beginner", length: "8 weeks", icon: "code", cover: "--book-3",
    blurb: "Build your first website from scratch.",
    about: "HTML, CSS and JavaScript from zero. Understand how the web works and put your own site online.",
    modules: [["How the web works", "What actually happens when you open a website."], ["Styling with modern CSS", "Colours, fonts and layouts that work on any screen."], ["Interactive JavaScript basics", "Make buttons, menus and pages respond."], ["Putting your site online", "Publish to a free host with your own link."]],
    make: "Your own portfolio website, live on the internet"
  },
  {
    id: "teen-entrepreneurship", title: "Teen Entrepreneurship 101", cat: "business", level: "Beginner", length: "5 weeks", icon: "lightbulb", cover: "--book-2",
    blurb: "Turn an idea into something people will pay for.",
    about: "Find problems worth solving, test ideas quickly and cheaply, and learn how to pitch.",
    modules: [["Finding problems worth solving", "Spot everyday frustrations people would pay to fix."], ["The one-page business plan", "Customers, value, channels and money on a single page."], ["Your first simple product", "Build a quick version and test it with real people."], ["Getting your first 10 customers", "Direct outreach, word of mouth and early-bird offers."]],
    make: "A pitch and a small pilot for your own venture"
  },
  {
    id: "ai-tools", title: "AI and Prompting", cat: "tech", level: "Intermediate", length: "4 weeks", icon: "smart_toy", cover: "--book",
    blurb: "Use AI tools well, and know their limits.",
    about: "How modern AI tools work, how to ask them good questions, and how to use them responsibly for study and creative work.",
    modules: [["How AI tools work", "What's going on behind the chat box, in plain words."], ["Prompting that gets results", "Clear instructions, examples and checking the answers."], ["Building a simple AI helper", "Set up a tool that helps with one real task."], ["Safety, ethics and honesty", "Bias, privacy, and when not to use AI."]],
    make: "A study helper that solves a problem you actually have"
  },
  {
    id: "money-smarts", title: "Money Smarts", cat: "money", level: "Beginner", length: "4 weeks", icon: "savings", cover: "--book-3",
    blurb: "Budget, save and understand money early.",
    about: "Practical money skills: budgeting that fits real life, saving towards goals and avoiding the traps that catch people later.",
    modules: [["Budgeting that fits your real life", "Track what comes in and goes out, without stress."], ["Saving towards a goal", "Plan for something you want and hit the target."], ["Avoiding debt traps", "Spot bad deals, scams and borrowing that costs too much."], ["How investing works", "The basics of growth over time, explained simply."]],
    make: "A personal budget and savings plan"
  },
  {
    id: "habits", title: "High Performance Habits", cat: "growth", level: "Beginner", length: "3 weeks", icon: "self_improvement", cover: "--book",
    blurb: "Focus better and beat procrastination.",
    about: "Build routines that keep you ahead without burning out, from study set-ups to rest.",
    modules: [["Designing a focus space", "Small changes to your space that help you concentrate."], ["Beating procrastination", "Why we put things off and what actually helps."], ["Study routines that stick", "Plan your week so the important things happen."]],
    make: "A two-week habit plan you actually follow"
  },
  {
    id: "public-speaking", title: "Public Speaking and Leadership", cat: "comms", level: "Beginner", length: "4 weeks", icon: "record_voice_over", cover: "--book-2",
    blurb: "Speak with confidence and lead a team.",
    about: "Get comfortable in front of people, explain your ideas clearly and work well with others.",
    modules: [["Beating stage fright", "Breathing, body language and preparation."], ["Telling a clear story", "Structure a talk people remember."], ["Everyday influence", "Persuade kindly and reach out to new people."], ["Leading a team", "Plan together, share tasks and give feedback."]],
    make: "A three-minute talk on something you care about"
  },
  {
    id: "digital-marketing", title: "Digital Marketing", cat: "business", level: "Beginner", length: "3 weeks", icon: "campaign", cover: "--book-3",
    blurb: "Grow an audience with a plan, not luck.",
    about: "How brands and creators find their audience online, plan their content and learn from the numbers.",
    modules: [["How online marketing works", "Where audiences hang out and how they find things."], ["Building a content calendar", "Content pillars and a schedule you can keep."], ["Reading the numbers", "Views, reach and engagement, and what to change."]],
    make: "A 30-day social media plan for a brand"
  },
  {
    id: "personal-branding", title: "Personal Branding", cat: "design", level: "Intermediate", length: "4 weeks", icon: "badge", cover: "--book-2",
    blurb: "Show your work so the right people notice.",
    about: "Find your style, tell the story behind your projects and build an online presence you're proud of.",
    modules: [["Your creative identity", "Strengths, style and the people you want to reach."], ["Writing a case study", "Show how you solved a problem, step by step."], ["Building your portfolio space", "Choose a platform and lay out your best work."]],
    make: "A brand identity for a teen-run podcast"
  },
  {
    id: "creative-thinking", title: "Creative Thinking", cat: "growth", level: "Beginner", length: "3 weeks", icon: "psychology", cover: "--book-3",
    blurb: "Get more ideas and get unstuck faster.",
    about: "Practical ways to come up with more ideas, push through creative blocks and connect things in new ways.",
    modules: [["Thinking wide before narrow", "Generate lots of options before choosing one."], ["Getting past creative blocks", "What to do when you feel stuck."], ["Mind maps and lateral jumps", "Connect unrelated ideas to find new ones."]],
    make: "An idea journal with your best three ideas worked out"
  }
];
