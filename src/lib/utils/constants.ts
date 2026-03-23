export const SECTION_IDS = {
  hero: "hero",
  showreel: "showreel",
  about: "about",
  work: "work",
  experience: "experience",
  skills: "skills",
  contact: "contact",
} as const;

export const NAV_LINKS = [
  { label: "Work", href: `#${SECTION_IDS.work}` },
  { label: "About", href: `#${SECTION_IDS.about}` },
  { label: "Experience", href: `#${SECTION_IDS.experience}` },
  { label: "Contact", href: `#${SECTION_IDS.contact}` },
] as const;

export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/kautilya-yashovardhan",
  artstation: "https://artstation.com/kautilya",
  instagram: "https://instagram.com/kautilya",
  email: "mailto:kautilya1011@gmail.com",
} as const;

export const PROJECTS_DATA = [
  {
    title: "Analog Radio Model",
    slug: "analog-radio",
    category: "Product Visualization",
    description: "Realistic analog radio designed in Autodesk Maya with detailed 3D modeling, lighting, and texturing for high-quality product visualization.",
    thumbnail: "/images/portfolio/radio1.jpg",
    featured: true,
  },
  {
    title: "Breakfast Table & Cutlery",
    slug: "breakfast-table",
    category: "Product Visualization",
    description: "Detailed breakfast table scene created in Maya with plates, cutlery, food items, textured in Substance Painter with natural lighting.",
    thumbnail: "/images/portfolio/spoon.jpg",
    featured: true,
  },
  {
    title: "Retro TV",
    slug: "retro-tv",
    category: "Product Visualization",
    description: "Classic retro television model with authentic proportions and studio lighting setup.",
    thumbnail: "/images/portfolio/tv1.jpg",
    featured: false,
  },
  {
    title: "Pressure Cooker Set",
    slug: "pressure-cooker",
    category: "Product Visualization",
    description: "Photorealistic pressure cooker set with metallic materials and professional studio lighting.",
    thumbnail: "/images/portfolio/Cooker_1.jpg",
    featured: false,
  },
  {
    title: "Cosmetic Product Display",
    slug: "cosmetic-display",
    category: "Product Visualization",
    description: "Luxury cosmetic product arrangement on golden cylindrical pedestals with dramatic warm lighting.",
    thumbnail: "/images/portfolio/product_1.jpg",
    featured: false,
  },
  {
    title: "Horror Classroom",
    slug: "horror-classroom",
    category: "Architectural",
    description: "A typical classroom transformed into a chilling scene with flickering lights, eerie shadows, and unsettling atmospheric lighting.",
    thumbnail: "/images/portfolio/classroom_img.jpg",
    featured: true,
  },
  {
    title: "Hospital Corridor",
    slug: "hospital-corridor",
    category: "Architectural",
    description: "Atmospheric hospital hallway with dramatic ceiling lighting and clinical ambiance.",
    thumbnail: "/images/portfolio/hospital1edit.jpg",
    featured: false,
  },
  {
    title: "Interior Hall",
    slug: "interior-hall",
    category: "Architectural",
    description: "Moody interior scene with warm bulb lighting, moonlit window, and sophisticated shadow play.",
    thumbnail: "/images/portfolio/hall.jpg",
    featured: false,
  },
  {
    title: "Dark Forest",
    slug: "dark-forest",
    category: "Environments",
    description: "Ethereal dark forest environment with misty teal atmosphere, volumetric lighting, and detailed vegetation.",
    thumbnail: "/images/portfolio/forest.jpg",
    featured: true,
  },
  {
    title: "Elden Ring Landscape",
    slug: "elden-ring",
    category: "Environments",
    description: "Epic fantasy landscape inspired by Elden Ring, featuring a sword on a rock formation with golden hour lighting.",
    thumbnail: "/images/portfolio/elden_ring.jpg",
    featured: false,
  },
  {
    title: "Metallic Chess Set",
    slug: "chess-set",
    category: "Creative",
    description: "Stylized metallic chess pieces with red and cyan color palette on a dramatic checkered board.",
    thumbnail: "/images/portfolio/chess.png",
    featured: true,
  },
  {
    title: "Battle Axe",
    slug: "battle-axe",
    category: "Creative",
    description: "Detailed battle axe model with realistic materials and dramatic studio presentation.",
    thumbnail: "/images/portfolio/axe.jpg",
    featured: false,
  },
] as const;

export const EXPERIENCE_DATA = [
  {
    company: "Forus Electric Pvt Ltd",
    role: "Animation Designer",
    period: "2025 - Present",
    description: "Design high-quality product animations, 3D visualizations, and motion graphics. Integrate AI in video and image generation workflows.",
  },
  {
    company: "Hexerve Solution",
    role: "3D Artist",
    period: "2024",
    description: "Created high-quality product models, 3D animations, and motion graphics for visual storytelling.",
  },
  {
    company: "Technicolor Creative Studio",
    role: "Cloth Simulation Artist & Groom Artist",
    period: "2022 - 2023",
    description: "Spearheaded cloth simulations, sculpted hair and fur elements, and finalized shorts with lighting, texturing, and animation.",
  },
] as const;

export const SKILLS_DATA = [
  { name: "Autodesk Maya", category: "3D & Modeling", proficiency: 5 },
  { name: "Blender", category: "3D & Modeling", proficiency: 4 },
  { name: "Houdini", category: "3D & Modeling", proficiency: 3 },
  { name: "3ds Max", category: "3D & Modeling", proficiency: 3 },
  { name: "Substance Painter", category: "Texturing", proficiency: 5 },
  { name: "Mudbox", category: "Texturing", proficiency: 3 },
  { name: "Adobe After Effects", category: "Compositing", proficiency: 4 },
  { name: "Adobe Photoshop", category: "Compositing", proficiency: 4 },
  { name: "Unreal Engine", category: "Game Engines", proficiency: 3 },
  { name: "AutoCAD", category: "3D & Modeling", proficiency: 3 },
] as const;

export const CATEGORIES = ["All", "Product Visualization", "Architectural", "Environments", "Creative"] as const;
