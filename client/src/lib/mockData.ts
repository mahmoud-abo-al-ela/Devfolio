export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Neon Finance Dashboard",
    description: "A high-performance crypto trading dashboard with real-time data visualization.",
    tags: ["React", "TypeScript", "D3.js", "Tailwind"],
    imageUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2532&auto=format&fit=crop",
    link: "#"
  },
  {
    id: "2",
    title: "Aether Social",
    description: "Decentralized social media platform focused on privacy and user ownership.",
    tags: ["Next.js", "GraphQL", "Prisma"],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    link: "#"
  },
  {
    id: "3",
    title: "Orbit Design System",
    description: "Comprehensive component library for enterprise SaaS applications.",
    tags: ["Storybook", "React", "A11y"],
    imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2464&auto=format&fit=crop",
    link: "#"
  },
  {
    id: "4",
    title: "Quantum E-Commerce",
    description: "Headless e-commerce solution with AI-driven product recommendations.",
    tags: ["Vue", "Nuxt", "Stripe"],
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2340&auto=format&fit=crop",
    link: "#"
  }
];

export const skills = [
  { name: "React", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js", level: 85 },
  { name: "Design Systems", level: 88 },
  { name: "UI/UX", level: 80 },
  { name: "GraphQL", level: 75 },
];

export const stats = [
  { label: "Total Views", value: "12,450", change: "+12%" },
  { label: "Project Clicks", value: "840", change: "+5%" },
  { label: "Contact Inquiries", value: "24", change: "+2%" },
  { label: "Active Projects", value: "4", change: "0%" },
];
