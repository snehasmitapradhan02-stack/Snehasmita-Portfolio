/**
 * Project showcase data.
 *
 * RULES OBSERVED
 * - Project names and URLs are taken exactly as provided.
 * - Nothing about results, metrics, roles or unverified technology has been
 *   invented. Where the source information was incomplete, a TODO marker is
 *   kept and the UI renders a neutral, honest placeholder.
 * - `category` is derived strictly from the project name. Confirm each one
 *   before launch.
 * - `image` is resolved at runtime: the first file that actually exists in
 *   /public/projects is used, otherwise a themed placeholder is rendered.
 */

export const projects = [
  {
    id: 'indian-health-system',
    number: '01',
    name: 'Indian Health System',
    slug: 'indian-health-system',
    category: 'Client Web Platform',
    kind: 'client',
    // TODO: Add verified project description.
    description: 'A healthcare web platform built for an Indian health brand.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: 'https://indiahealthsystem.com/',
    githubUrl: '',
    // TODO: Add GitHub repository URL if the project is public.
    year: '',
    highlight: true,
  },
  {
    id: 'seafarers-association',
    number: '02',
    name: 'Seafarers Association',
    slug: 'seafarers-association',
    category: 'Client Web Platform',
    kind: 'client',
    // TODO: Add verified project description.
    description: 'A web presence for a seafarers association and its members.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: 'https://seafarersassociation.com/',
    githubUrl: '',
    year: '',
    highlight: true,
  },
  {
    id: 'omniorra',
    number: '03',
    name: 'Omniorra',
    slug: 'omniorra',
    category: 'Multi-Platform Business System',
    kind: 'client',
    // TODO: Add verified project description.
    description: 'A multi-service booking and business platform.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    year: '',
    highlight: true,
  },
  {
    id: 'spanco-tek',
    number: '04',
    name: 'Spanco Tek',
    slug: 'spanco-tek',
    category: 'Client Web Platform',
    kind: 'client',
    // TODO: Add verified project description.
    description: 'A business website developed for Spanco Tek.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: 'https://www.spancotek.com/',
    githubUrl: '',
    year: '',
  },
  {
    id: 'ecommerce',
    number: '05',
    name: 'E-Commerce Application',
    slug: 'ecommerce',
    category: 'Full-Stack Application',
    kind: 'technical',
    // TODO: Add verified project description and confirm these categories
    // before launch. The line below is only a restatement of the project
    // name — it asserts no features, results or metrics.
    description: 'An e-commerce application.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    year: '',
  },
  {
    id: 'restaurant-management',
    number: '06',
    name: 'Restaurant Management System',
    slug: 'restaurant-management',
    category: 'Full-Stack Application',
    kind: 'technical',
    // TODO: Add verified project description.
    description: 'A restaurant management system for day-to-day operations.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: 'https://restaurant-management-sepia.vercel.app/',
    githubUrl: '',
    year: '',
  },
  {
    id: 'daily-expenditure',
    number: '07',
    name: 'Daily Expenditure Tracking',
    slug: 'daily-expenditure',
    category: 'Full-Stack Application',
    kind: 'technical',
    // TODO: Add verified project description.
    description: 'A daily expenditure tracking application.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: 'https://daily-expenditure-tracking.vercel.app/',
    githubUrl: '',
    year: '',
  },
  {
    id: 'plot-selling',
    number: '08',
    name: 'Plot Selling Application',
    slug: 'plot-selling',
    category: 'Full-Stack Application',
    kind: 'technical',
    // TODO: Add verified project description and confirm the category before
    // launch. Restatement of the project name only — no features claimed.
    description: 'A plot selling application.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    year: '',
  },
  {
    id: 'biryani-express',
    number: '09',
    name: 'Biryani Express',
    slug: 'biryani-express',
    category: 'Full-Stack Application',
    kind: 'technical',
    // TODO: Add verified project description.
    description: 'A food ordering application for Biryani Express.',
    descriptionVerified: false,
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    year: '',
  },
];

/**
 * Image candidate paths, probed in order at runtime.
 * Drop a `.webp` (preferred), `.jpg` or `.png` with one of these names into
 * /public/projects and it will be picked up automatically.
 */
export const projectImageCandidates = (slug) => [
  `/projects/${slug}.webp`,
  `/projects/${slug}.jpg`,
  `/projects/${slug}.jpeg`,
  `/projects/${slug}.png`,
  `/projects/${slug}.avif`,
];

export const projectGroups = [
  { id: 'all', label: 'All Work' },
  { id: 'client', label: 'Client Platforms' },
  { id: 'technical', label: 'Full-Stack Builds' },
];

export default projects;
