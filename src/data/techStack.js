/**
 * Technical foundation.
 *
 * Deliberately presented as a SUPPORTING strength — never larger than the
 * HR sections. These are technologies Snehasmita has actually worked with.
 */

export const techStack = [
  {
    id: 'react',
    name: 'React.js',
    group: 'Frontend',
    blurb: 'Component-driven interfaces, reusable UI and state management.',
    level: 'Core',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    group: 'Language',
    blurb: 'The base language behind every layer of the stack.',
    level: 'Core',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    group: 'Backend',
    blurb: 'Server-side JavaScript for application logic and APIs.',
    level: 'Core',
  },
  {
    id: 'express',
    name: 'Express.js',
    group: 'Backend',
    blurb: 'Routing, middleware and REST API construction.',
    level: 'Core',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    group: 'Database',
    blurb: 'Document databases, schemas and aggregation queries.',
    level: 'Core',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    group: 'Framework',
    blurb: 'App-router applications, SSR and performance-oriented builds.',
    level: 'Working',
  },
  {
    id: 'html5',
    name: 'HTML5',
    group: 'Frontend',
    blurb: 'Semantic, accessible markup as the structural base.',
    level: 'Core',
  },
  {
    id: 'css3',
    name: 'CSS3',
    group: 'Frontend',
    blurb: 'Layout, responsive behaviour, animation and theming.',
    level: 'Core',
  },
  {
    id: 'rest-api',
    name: 'REST APIs',
    group: 'Backend',
    blurb: 'Designing, consuming and debugging API contracts.',
    level: 'Core',
  },
  {
    id: 'crud',
    name: 'CRUD',
    group: 'Backend',
    blurb: 'Full create-read-update-delete flows against real data.',
    level: 'Core',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    group: 'Database',
    blurb: 'Relational modelling, joins and structured queries.',
    level: 'Working',
  },
  {
    id: 'react-native',
    name: 'React Native',
    group: 'Mobile',
    blurb: 'Cross-platform mobile interfaces from a shared React base.',
    level: 'Working',
  },
  {
    id: 'git',
    name: 'Git',
    group: 'Tooling',
    blurb: 'Version control, branching and clean collaboration habits.',
    level: 'Core',
  },
  {
    id: 'github',
    name: 'GitHub',
    group: 'Tooling',
    blurb: 'Repositories, pull requests and team workflows.',
    level: 'Core',
  },
];

/**
 * The subset rendered inside the orbit network around "SNEHASMITA".
 * Kept small on purpose so the graphic stays legible.
 */
export const techOrbit = [
  { id: 'react', name: 'React', x: 50, y: 4 },
  { id: 'nodejs', name: 'Node.js', x: 86, y: 18 },
  { id: 'javascript', name: 'JavaScript', x: 96, y: 50 },
  { id: 'mongodb', name: 'MongoDB', x: 82, y: 82 },
  { id: 'mysql', name: 'MySQL', x: 50, y: 96 },
  { id: 'nextjs', name: 'Next.js', x: 18, y: 82 },
  { id: 'react-native', name: 'React Native', x: 4, y: 50 },
  { id: 'express', name: 'Express', x: 14, y: 18 },
  { id: 'rest-api', name: 'REST APIs', x: 68, y: 34 },
  { id: 'github', name: 'GitHub', x: 32, y: 66 },
];

/**
 * Capability tags grouped for the technical section.
 */
export const techCapabilities = [
  { id: 'fullstack', label: 'Full-Stack Application Development', icon: 'layers' },
  { id: 'api', label: 'API Integration', icon: 'plug' },
  { id: 'responsive', label: 'Responsive UI', icon: 'layout' },
  { id: 'ai', label: 'AI Integrations', icon: 'sparkles' },
];

export default techStack;
