/**
 * Central identity + positioning data.
 * Edit this file to change how the portfolio introduces Snehasmita.
 * No UI component should hardcode copy that belongs here.
 */

export const profile = {
  firstName: 'Snehasmita',
  lastName: 'Pradhan',
  fullName: 'Snehasmita Pradhan',
  /** Display casing used in the navigation bar. */
  navName: 'SNEHASMITA PRADHAN',
  shortName: 'Snehasmita',
  initials: 'SP',

  /**
   * Positioning — HR is the primary identity, technology is the differentiator.
   * `primary` drives the hero, `secondary` is the supporting credential.
   */
  primaryRole: 'HR & Recruitment Specialist',
  secondaryRole: 'Full-Stack Developer',
  roles: ['HR & Recruitment Specialist', 'Full-Stack Developer'],
  roleLine: ['HR & Recruitment', 'Specialist'],

  tagline: 'Connecting people, technology and opportunities.',

  /** Short hero paragraph — kept factual, no exaggeration. */
  heroStatement:
    'HR & Recruitment professional with hands-on experience in talent acquisition, candidate coordination, client communication and modern web development.',

  /** About section narrative. */
  summary: [
    'I work in HR and recruitment — sourcing candidates, screening profiles, coordinating interviews and keeping both candidates and clients informed at every stage of the process.',
    'Alongside that, I build real software. My development background means I can read a requirement, understand what a technical team actually needs, and speak to both candidates and engineers without a translation layer in between.',
  ],

  /** The differentiator statement, pulled out as a highlight. */
  differentiator:
    'Because of my software development background, I understand technical requirements and can communicate effectively with technical teams and candidates.',

  location: {
    city: 'Bhubaneswar',
    state: 'Odisha',
    country: 'India',
    label: 'Bhubaneswar, Odisha',
  },

  /** Shown on the About panel as professional metadata. */
  metadata: [
    { label: 'Role', value: 'HR & Recruitment Specialist' },
    { label: 'Technical Background', value: 'Full-Stack Developer' },
    { label: 'Location', value: 'Bhubaneswar, Odisha' },
    { label: 'Focus', value: 'Recruitment · Technology · People' },
  ],

  focusAreas: [
    { label: 'Talent Sourcing', detail: 'Building and refreshing pipelines across channels.' },
    { label: 'Candidate Screening', detail: 'Filtering profiles against real requirements.' },
    { label: 'Recruitment Coordination', detail: 'Keeping the process moving end to end.' },
    { label: 'Client Communication', detail: 'Clear, timely updates for hiring partners.' },
    { label: 'Requirement Analysis', detail: 'Translating business needs into a search brief.' },
    { label: 'Technical Fluency', detail: 'React, Node, Express, MongoDB, REST APIs.' },
  ],

  /**
   * The 01 / 02 / 03 / 04 loading sequence.
   */
  loaderSequence: [
    { index: '01', label: 'Identity' },
    { index: '02', label: 'People' },
    { index: '03', label: 'Technology' },
    { index: '04', label: 'Ready' },
  ],

  seo: {
    title: 'Snehasmita Pradhan — HR & Recruitment Specialist | Full-Stack Developer',
    description:
      'HR & Recruitment professional with hands-on full-stack development experience. Talent sourcing, candidate screening, recruitment coordination and client communication for technical hiring.',
    keywords: [
      'HR Recruiter Bhubaneswar',
      'Talent Sourcing Odisha',
      'Recruitment Coordinator',
      'HR & Recruitment Specialist',
      'Full Stack Developer React Node',
      'MERN Stack Developer',
    ],
  },
};

export default profile;
