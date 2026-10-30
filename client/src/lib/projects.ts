export type ProjectCategory = "Websites" | "Landing pages" | "App design";
export type Project = {
  id: string;
  name: string;
  business: string;
  category: ProjectCategory;
  theme: "coffee" | "interior" | "wellness";
  image: string;
  headline: string;
  description: string;
  goal: string;
  decisions: string[];
};

export const projects: Project[] = [
  {
    id: "sunday",
    name: "Sunday Coffee",
    business: "Independent café",
    category: "Websites",
    theme: "coffee",
    image: "/manus-storage/async-images/uEqE5bK5czAmPuWqFzHLoq/image-1.webp",
    headline: "Good coffee. Better mornings.",
    description:
      "A warm, characterful home for a neighborhood café. From the first impression to the first visit.",
    goal: "Turn local discovery into an in-person visit.",
    decisions: [
      "Put the café's personality front and center.",
      "Make the menu, opening hours and directions easy to find.",
      "Keep the mobile journey short, readable and welcoming.",
    ],
  },
  {
    id: "forma",
    name: "Forma Studio",
    business: "Architecture & interiors",
    category: "Landing pages",
    theme: "interior",
    image: "/manus-storage/async-images/uEqE5bK5czAmPuWqFzHLoq/image-2.webp",
    headline: "Spaces to feel at home in.",
    description:
      "An editorial landing page that lets considered spaces do the talking, with a clear path to a consultation.",
    goal: "Help prospective clients understand the aesthetic and enquire with confidence.",
    decisions: [
      "Use generous photography to communicate the design approach.",
      "Explain the service before asking for a commitment.",
      "Give every section a natural route to a project enquiry.",
    ],
  },
  {
    id: "bloom",
    name: "Bloom Movement",
    business: "Wellness & movement",
    category: "App design",
    theme: "wellness",
    image: "/manus-storage/async-images/uEqE5bK5czAmPuWqFzHLoq/image-3.webp",
    headline: "A little space for yourself.",
    description:
      "A calm studio discovery and class-selection concept. A thoughtful interface, without an overwhelming booking journey.",
    goal: "Make choosing the right movement class feel simple.",
    decisions: [
      "Use clear class descriptions and readable schedules.",
      "Show selected states with text and color, not color alone.",
      "Avoid pressure tactics and explain the next step.",
    ],
  },
];
