/**
 * Certifications — exactly as listed on the resume.
 * No certificate IDs, issue dates or credential URLs have been invented;
 * the `credentialId` field stays empty and the UI hides it when empty.
 *
 * `focus` is a short, generic restatement of each certificate's own title —
 * no dates, scores, hours or outcomes are claimed. `group` is a display-only
 * bucket. Replace either with verified detail when it is available.
 */

export const certifications = [
  {
    id: 'gen-ai-specialization',
    title: 'Generative AI Specialization',
    issuer: 'Coursera',
    year: '',
    credentialId: '',
    credentialUrl: '',
    focus: 'Applied generative AI workflows for building modern applications.',
    group: 'AI',
  },
  {
    id: 'html-css-spa',
    title: 'HTML and CSS: Building a Single-Page Website',
    issuer: 'Coursera Project Network',
    year: '',
    credentialId: '',
    credentialUrl: '',
    focus: 'Single-page website structure, layout and responsive styling.',
    group: 'Web',
  },
  {
    id: 'intro-generative-ai',
    title: 'Introduction to Generative AI',
    issuer: 'Google Cloud',
    year: '',
    credentialId: '',
    credentialUrl: '',
    focus: 'Foundations of generative AI, models and responsible use.',
    group: 'AI',
  },
  {
    id: 'js-algorithms',
    title: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    year: '',
    credentialId: '',
    credentialUrl: '',
    focus: 'Core JavaScript, algorithmic problem solving and data structures.',
    group: 'Web',
  },
  {
    id: 'responsive-web-design',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    year: '',
    credentialId: '',
    credentialUrl: '',
    focus: 'Responsive layouts, modern CSS and accessible page structure.',
    group: 'Web',
  },
  {
    id: 'java-fullstack',
    title: 'Java Full Stack Development — Advanced Program',
    issuer: 'AUDIP Foundation',
    year: '',
    credentialId: '',
    credentialUrl: '',
    // Restatement of the title only — no claim that it was an internship.
    focus: 'Advanced full-stack programming programme in Java.',
    group: 'Programming',
  },
];

export default certifications;
