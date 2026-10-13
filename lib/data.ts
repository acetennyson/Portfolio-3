export const siteConfig = {
  name: "Ado Daniel NJ",
  title: "Full-Stack Developer & Designer",
  tagline: "I Build Things\nPeople Love",
  bio: "Interested in what makes software actually work — how its parts communicate, how its logic holds up, and how an idea becomes something people can use.",
  email: "danybeloved@gmail.com",
  avatar: "https://scontent-los4-1.xx.fbcdn.net/v/t39.30808-1/671876161_1511922483856485_4280946337718525779_n.jpg?stp=dst-jpg_tt6&cstp=mx720x720&ctp=s480x480&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGun_HMyrDSSWFxj1zuZ-73LY4_C-IRhdgtjj8L4hGF2Pd9K9uuai_jsH2kShAm3t7Jr0ac60fwPNFjRDidpzfX&_nc_ohc=co0o_KpR0sYQ7kNvwG0ZaFo&_nc_oc=AdpxrgkB9qA-6MiylNG3zFy1gHX888rseY2ufJQTidfmrcdgccOfVYuh7yni-7ON184&_nc_zt=24&_nc_ht=scontent-los4-1.xx&_nc_gid=WPFsVgf0EAMJJOUIx-rYEQ&_nc_ss=7b2a8&oh=00_Af-ErsjXzyJkD3bJi2MhFBGqvFvuCY2xuKvcTSvJuJZiqw&oe=6A3EF874",
  social: {
    github: "https://github.com/acetennyson",
    twitter: "https://x.com/AdoNj84371",
    linkedin: "https://www.linkedin.com/in/iamsupreme/",
    facebook: "https://www.facebook.com/iamsupreme0",
    dev: "https://dev.to/adodanieln",
  },
  stats: [
    { value: "12+", label: "Projects Shipped" },
    { value: "4+", label: "Years Experience" },
    { value: "50k+", label: "Users Reached" },
  ],
};

export const roles = ["Full-Stack Developer", "UI/UX Designer", "Open Source Contributor", "Product Builder"];

export const staticProjects = [
  {
    id: "p1",
    title: "Luminary Dashboard",
    description: "Real-time analytics platform with AI-powered insights and beautiful data visualisations.",
    featured: true,
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    liveUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: "p2",
    title: "Orbit Design System",
    description: "A comprehensive component library and design system used across 5 products.",
    featured: false,
    technologies: ["React", "Figma", "Storybook"],
    liveUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  },
  {
    id: "p3",
    title: "Pulse Mobile App",
    description: "Health & fitness tracker with personalized coaching and social challenges.",
    featured: false,
    technologies: ["React Native", "Firebase", "Node.js"],
    liveUrl: "#",
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  },
];

export const staticBlogs = [
  {
    id: "b1",
    slug: "building-design-systems",
    title: "Building Design Systems That Scale",
    excerpt: "How I approached creating a token-based design system that works across web, iOS, and Android.",
    published: true,
  },
  {
    id: "b2",
    slug: "nextjs-performance",
    title: "Next.js Performance Patterns in 2026",
    excerpt: "Deep dive into streaming, partial prerendering, and cache strategies that cut TTFB by 60%.",
    published: true,
  },
  {
    id: "b3",
    slug: "ai-in-product",
    title: "Integrating AI Without Ruining UX",
    excerpt: "Lessons learned shipping AI features to 50k users — what worked, what flopped, and why.",
    published: true,
  },
  {
    id: "b4",
    slug: "dark-mode-done-right",
    title: "Dark Mode Done Right",
    excerpt: "A practical guide to theme systems using CSS custom properties, no flash, no jank.",
    published: true,
  },
];

export const skills = [
  "TypeScript", "React", "Next.js", "Node.js",
  "Figma", "Firebase", "PostgreSQL", "Tailwind CSS",
];

export const process = [
  { step: "01", title: "Discover", desc: "Understand the problem, constraints, and expected outcome before deciding what to build." },
  { step: "02", title: "Design", desc: "Define the user experience, system boundaries, and implementation approach before complexity starts spreading." },
  { step: "03", title: "Build", desc: "Implement the system, connect its moving parts, and test the behavior that matters." },
  { step: "04", title: "Ship", desc: "Deploy, observe how it behaves, fix what breaks, and improve it based on what the product needs next." },
];

export const testimonials = [
  {
    id: "t1",
    quote: "Attention to detail in both design and code that's rare to find in a single person.",
  },
  {
    id: "t2",
    quote: "Feels like having a co-founder on the build — fast, communicative, and the output speaks for itself.",
  },
  {
    id: "t3",
    quote: "Design systems built to last, saving teams hundreds of hours down the line.",
  },
];

export const timeline = [
  { year: "2026", title: "Senior Engineer @ Stealth Startup", desc: "Leading product engineering for a Series A fintech." },
  { year: "2024", title: "Freelance & Open Source", desc: "Shipped 6 client products and grew an OSS design system to 2k stars." },
  { year: "2022", title: "Frontend Lead @ Orbit", desc: "Built and scaled the design system from 0 to 50+ components." },
  { year: "2020", title: "Started as a Developer", desc: "First job out of university. Fell in love with the craft." },
];

export const currentlyBuilding = {
  name: "Nexus — AI Workspace",
  desc: "An AI-native workspace that connects your tools, docs, and team in one place.",
  progress: 65,
  image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
};

export const services = [
  { n: "01", title: "Design", blurb: "Interfaces shaped around the problem, the people using them, and the system behind them.", items: ["UI / UX design", "Design systems", "Prototyping", "Motion direction"] },
  { n: "02", title: "Development", blurb: "Building web applications, APIs, integrations, and backend systems with attention to performance, maintainability, and real-world constraints.", items: ["Next.js & React", "Node & Firebase", "WebGL / three.js", "Performance & SEO"] },
  { n: "03", title: "Product", blurb: "Turning requirements into working software, making practical trade-offs, and improving the product as its needs evolve.", items: ["Scoping & roadmaps", "MVPs", "Launch & monitoring", "Iteration"] },
];

export const labTools = [
  { name: "Calculator", desc: "A sleek calculator for quick maths.", href: "/tools/calculator" },
  { name: "Dice Roller", desc: "3D physics-based dice roller.", href: "/tools/dice" },
  { name: "Weather", desc: "City, ZIP, IP or coordinates. 7-day forecast.", href: "/tools/weather" },
  { name: "Compass", desc: "Real-time compass from device orientation.", href: "/tools/compass" },
  { name: "Converter", desc: "Currency, length, weight, temperature, time.", href: "/tools/converter" },
  { name: "World Clock", desc: "Multiple timezones in four clock styles.", href: "/tools/world-clock" },
  { name: "BMI Tracker", desc: "BMI gauge, healthy range and tips.", href: "/tools/bmi" },
];
