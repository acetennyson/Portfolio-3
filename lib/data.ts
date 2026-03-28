export const siteConfig = {
  name: "Ado Daniel NJ",
  title: "Full-Stack Developer & Designer",
  tagline: "I Build Things\nPeople Love",
  bio: "Designer & developer crafting high-performance digital products. From concept to deployment — I make it real.",
  email: "alex@example.com",
  avatar: "https://z-p3-scontent.fdla2-1.fna.fbcdn.net/v/t39.30808-6/394442680_122106512000075496_1205902345219896500_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeFqjaTu824bKsFLadAlFzPXEs6aqHnIHvkSzpqoecge-bpGaA8V2sK8vWgrGAcllXZ01eDsbFfwQZiyWXQA9XF9&_nc_ohc=VMSscoBf9iYQ7kNvwFXvhSh&_nc_oc=Adomy1aHJUaQKeBivzIr7Kg_fnPoERBI9KpnHoYyoqlEqnqmUCXpyzT6eMpRP3ugbXA&_nc_zt=23&_nc_ht=z-p3-scontent.fdla2-1.fna&_nc_gid=DCA1T5YwgPPTdxGPobOkUA&_nc_ss=7a32e&oh=00_AfwMm2JxAeLDafNxDJznuW2vOE7Yyv8b4Am8UOe-nRdcwQ&oe=69CDDAE7",
  social: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
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
    name: "Luminary Dashboard",
    description: "Real-time analytics platform with AI-powered insights and beautiful data visualisations.",
    status: "live",
    tag: "SaaS",
    techs: ["Next.js", "TypeScript", "PostgreSQL"],
    url: "#",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: "p2",
    name: "Orbit Design System",
    description: "A comprehensive component library and design system used across 5 products.",
    status: "live",
    tag: "Design",
    techs: ["React", "Figma", "Storybook"],
    url: "#",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  },
  {
    id: "p3",
    name: "Pulse Mobile App",
    description: "Health & fitness tracker with personalized coaching and social challenges.",
    status: "live",
    tag: "Mobile",
    techs: ["React Native", "Firebase", "Node.js"],
    url: "#",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  },
];

export const staticBlogs = [
  {
    id: "b1",
    slug: "building-design-systems",
    title: "Building Design Systems That Scale",
    excerpt: "How I approached creating a token-based design system that works across web, iOS, and Android.",
    date: "Mar 20, 2026",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: "b2",
    slug: "nextjs-performance",
    title: "Next.js Performance Patterns in 2026",
    excerpt: "Deep dive into streaming, partial prerendering, and cache strategies that cut TTFB by 60%.",
    date: "Mar 12, 2026",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: "b3",
    slug: "ai-in-product",
    title: "Integrating AI Without Ruining UX",
    excerpt: "Lessons learned shipping AI features to 50k users — what worked, what flopped, and why.",
    date: "Feb 28, 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: "b4",
    slug: "dark-mode-done-right",
    title: "Dark Mode Done Right",
    excerpt: "A practical guide to theme systems using CSS custom properties, no flash, no jank.",
    date: "Feb 14, 2026",
    readTime: "4 min read",
    featured: false,
  },
];

export const skills = [
  "TypeScript", "React", "Next.js", "Node.js",
  "Figma", "Firebase", "PostgreSQL", "Tailwind CSS",
];

export const process = [
  { step: "01", title: "Discover", desc: "Deep dive into the problem space, user needs, and business goals." },
  { step: "02", title: "Design", desc: "Wireframes, prototypes, and design systems that guide the build." },
  { step: "03", title: "Build", desc: "Clean, performant code with a focus on accessibility and scale." },
  { step: "04", title: "Ship", desc: "Deploy, monitor, iterate. Products that keep getting better." },
];

export const testimonials = [
  {
    id: "t1",
    quote: "Alex delivered a product that exceeded every expectation. The attention to detail in both design and code is rare.",
    name: "Sarah Chen",
    role: "CTO at Luminary",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80",
  },
  {
    id: "t2",
    quote: "Working with Alex felt like having a co-founder. Fast, communicative, and the output was stunning.",
    name: "Marcus Webb",
    role: "Founder at Orbit",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80",
  },
  {
    id: "t3",
    quote: "The design system Alex built saved our team hundreds of hours. It's the backbone of everything we ship.",
    name: "Priya Nair",
    role: "Head of Product at Pulse",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80",
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
