/**
 * Project visual configuration.
 *
 * RULES OBSERVED
 * - This is ILLUSTRATION CONFIGURATION, not project data. It describes the
 *   interface concept that `src/components/projects/ProjectVisual.jsx` draws,
 *   so every project card leads with a visual instead of a text block.
 * - These are deliberately abstract UI mockups: flat panels, icon tiles and
 *   placeholder bars. They are NOT screenshots of a live product and are never
 *   presented as one — every rendered mockup is labelled "UI concept" in the
 *   card overlay.
 * - Nothing here asserts a feature, metric, technology, result or client detail
 *   that is not already stated in `src/data/projects.js`. All numeric-looking
 *   elements are drawn bars, never values.
 * - This is only ever a FALLBACK. The moment a real screenshot exists in
 *   /public/projects, `ProjectCard` renders that instead and this file is
 *   bypassed entirely.
 */

export const projectVisuals = {
  'indian-health-system': {
    template: 'dashboard',
    app: 'Health console',
    icon: 'shield',
    accent: 'var(--accent)',
    secondary: 'var(--accent-2)',
    chartLabel: 'Activity',
    stats: [
      { label: 'Appointments', icon: 'calendar' },
      { label: 'Patients', icon: 'user' },
      { label: 'Records', icon: 'file' },
    ],
    chart: [34, 58, 44, 72, 52, 88, 64, 78],
    rows: [
      { label: 'Appointment queue', icon: 'calendar' },
      { label: 'Patient records', icon: 'userPlus' },
      { label: 'Prescriptions', icon: 'file' },
    ],
  },

  'seafarers-association': {
    template: 'dashboard',
    app: 'Association portal',
    icon: 'compass',
    accent: 'var(--accent-2)',
    secondary: 'var(--accent)',
    chartLabel: 'Membership',
    stats: [
      { label: 'Members', icon: 'users' },
      { label: 'Vessels', icon: 'compass' },
      { label: 'Support', icon: 'shield' },
    ],
    chart: [62, 48, 70, 56, 82, 66, 74, 90],
    rows: [
      { label: 'Crew directory', icon: 'users' },
      { label: 'Medical support', icon: 'shield' },
      { label: 'Certificates', icon: 'badge' },
    ],
  },

  'spanco-tek': {
    template: 'dashboard',
    app: 'Equipment console',
    icon: 'cpu',
    accent: 'var(--accent-2)',
    secondary: 'var(--accent-3)',
    chartLabel: 'Utilisation',
    stats: [
      { label: 'Equipment', icon: 'cpu' },
      { label: 'Inventory', icon: 'database' },
      { label: 'Service', icon: 'gauge' },
    ],
    chart: [46, 70, 38, 84, 60, 52, 76, 68],
    rows: [
      { label: 'Equipment register', icon: 'layers' },
      { label: 'Stock levels', icon: 'database' },
      { label: 'Service logs', icon: 'workflow' },
    ],
  },

  omniorra: {
    template: 'booking',
    app: 'Omniorra',
    icon: 'calendar',
    accent: 'var(--accent-3)',
    secondary: 'var(--accent-2)',
    services: ['Consulting', 'Therapy', 'Coaching'],
    days: ['M', 'T', 'W', 'T', 'F', 'S'],
    slots: ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30'],
  },

  ecommerce: {
    template: 'listing',
    app: 'Storefront',
    icon: 'layoutGrid',
    accent: 'var(--accent)',
    secondary: 'var(--accent-2)',
    search: 'Search products',
    items: [
      { label: 'Product card', tag: 'New' },
      { label: 'Product card', tag: '' },
      { label: 'Product card', tag: '' },
      { label: 'Product card', tag: 'Sale' },
    ],
    cart: 'Cart',
  },

  'plot-selling': {
    template: 'listing',
    app: 'Plots portal',
    icon: 'layout',
    accent: 'var(--accent-3)',
    secondary: 'var(--accent)',
    search: 'Search plots',
    items: [
      { label: 'Plot listing', tag: '' },
      { label: 'Plot listing', tag: 'New' },
      { label: 'Plot listing', tag: '' },
      { label: 'Plot listing', tag: '' },
    ],
    cart: 'Enquiry',
  },

  'biryani-express': {
    template: 'menu',
    app: 'Biryani Express',
    icon: 'layers',
    accent: 'var(--accent-4)',
    secondary: 'var(--accent-2)',
    categories: ['Biryani', 'Starters', 'Desserts'],
    dishes: ['Dum Biryani', 'Chicken 65', 'Kulfi Falooda'],
    order: 'Order summary',
  },

  'restaurant-management': {
    template: 'dashboard',
    app: 'Restaurant console',
    icon: 'layers',
    accent: 'var(--accent-4)',
    secondary: 'var(--accent-2)',
    chartLabel: 'Orders',
    stats: [
      { label: 'Orders', icon: 'file' },
      { label: 'Menu', icon: 'layers' },
      { label: 'Tables', icon: 'layoutGrid' },
    ],
    chart: [40, 62, 78, 52, 86, 64, 58, 80],
    rows: [
      { label: 'Live orders', icon: 'workflow' },
      { label: 'Menu items', icon: 'layers' },
      { label: 'Table status', icon: 'layoutGrid' },
    ],
  },

  'daily-expenditure': {
    template: 'tracker',
    app: 'Expenditure tracker',
    icon: 'gauge',
    accent: 'var(--accent-2)',
    secondary: 'var(--accent)',
    chartLabel: 'This month',
    legend: [
      { label: 'Food', tint: 'var(--accent)' },
      { label: 'Travel', tint: 'var(--accent-2)' },
      { label: 'Bills', tint: 'var(--accent-3)' },
    ],
    bars: [30, 52, 44, 68, 58, 76, 62, 84, 70, 90, 66, 78],
    rows: [
      { label: 'Category breakdown', icon: 'filter' },
      { label: 'Recent entries', icon: 'file' },
      { label: 'Recurring', icon: 'calendar' },
    ],
  },

  /* Used for any project without an explicit concept above. */
  default: {
    template: 'dashboard',
    app: 'Project',
    icon: 'layout',
    accent: 'var(--accent)',
    secondary: 'var(--accent-2)',
    chartLabel: 'Overview',
    stats: [
      { label: 'Overview', icon: 'layout' },
      { label: 'Modules', icon: 'layers' },
      { label: 'Reports', icon: 'file' },
    ],
    chart: [40, 60, 48, 72, 56, 66, 50, 74],
    rows: [
      { label: 'Primary module', icon: 'layoutGrid' },
      { label: 'Secondary module', icon: 'workflow' },
      { label: 'Reporting', icon: 'gauge' },
    ],
  },
};

export default projectVisuals;
