/**
 * HR & Recruitment capabilities.
 *
 * This is the PRIMARY identity of the portfolio, so the visual weight of the
 * HR sections intentionally outweighs the technical sections.
 *
 * `icon` must be a key exported from `src/components/ui/Icon.jsx`.
 */

export const hrCapabilities = [
  {
    id: 'talent-sourcing',
    icon: 'search',
    title: 'Talent Sourcing',
    description:
      'Building candidate pipelines through job portals, referrals and direct outreach, then keeping them fresh.',
  },
  {
    id: 'candidate-screening',
    icon: 'filter',
    title: 'Candidate Screening',
    description:
      'Reviewing profiles against the actual requirement so only genuinely relevant profiles reach the client.',
  },
  {
    id: 'candidate-acquisition',
    icon: 'userPlus',
    title: 'Candidate Acquisition',
    description:
      'Approaching qualified candidates, explaining the role honestly and closing the loop both ways.',
  },
  {
    id: 'recruitment-coordination',
    icon: 'workflow',
    title: 'Recruitment Coordination',
    description:
      'Owning the full cycle — requirement to offer — so nothing stalls between stakeholders.',
  },
  {
    id: 'interview-scheduling',
    icon: 'calendar',
    title: 'Interview Scheduling',
    description:
      'Coordinating panels, calendars and candidate availability without double bookings or delays.',
  },
  {
    id: 'requirement-analysis',
    icon: 'compass',
    title: 'Requirement Analysis',
    description:
      'Turning a vague hiring need into a clear brief: skills, responsibilities and realistic timelines.',
  },
  {
    id: 'client-communication',
    icon: 'messages',
    title: 'Client Communication',
    description:
      'Consistent, honest updates to hiring partners, including the difficult feedback delivered early.',
  },
  {
    id: 'candidate-followup',
    icon: 'phoneCall',
    title: 'Candidate Follow-up',
    description:
      'Keeping candidates informed at every stage, including a timely result once a decision is made.',
  },
  {
    id: 'relationship-management',
    icon: 'handshake',
    title: 'Relationship Management',
    description:
      'Building durable relationships with candidates and clients rather than treating them as a transaction.',
  },
  {
    id: 'job-coordination',
    icon: 'briefcase',
    title: 'Job Coordination',
    description:
      'Tracking every open role, where it stands and what needs to happen next to move it forward.',
  },
];

/**
 * Soft HR skills — shown as the secondary HR band.
 */
export const hrSoftSkills = [
  { id: 'teamwork', label: 'Teamwork' },
  { id: 'communication', label: 'Communication' },
  { id: 'time-management', label: 'Time Management' },
  { id: 'problem-solving', label: 'Problem Solving' },
  { id: 'fast-learning', label: 'Fast Learning' },
];

/**
 * The recruitment pipeline, in order. Rendered as a cinematic vertical
 * activation sequence driven by GSAP ScrollTrigger.
 */
export const recruitmentPipeline = [
  {
    id: 'requirement',
    step: '01',
    title: 'Requirement',
    description: 'Understand the role, the team and the real problem the hire solves for.',
    detail: ['Intake call with the hiring partner', 'Skills and responsibilities mapped', 'Timeline and salary band confirmed'],
  },
  {
    id: 'sourcing',
    step: '02',
    title: 'Sourcing',
    description: 'Open the right channels and build a pipeline instead of waiting for applications.',
    detail: ['Portals, referrals and direct outreach', 'Passive candidate search', 'Pipeline tracked per role'],
  },
  {
    id: 'screening',
    step: '03',
    title: 'Screening',
    description: 'Filter quickly and honestly so the client only sees relevant, available profiles.',
    detail: ['Profile and experience validation', 'Notice period and location check', 'Salary expectation alignment'],
  },
  {
    id: 'shortlisting',
    step: '04',
    title: 'Shortlisting',
    description: 'Present a small, credible shortlist with context behind every profile.',
    detail: ['Curated shortlist, not a bulk dump', 'Honest strengths and gaps', 'Clear recommendation per candidate'],
  },
  {
    id: 'interview',
    step: '05',
    title: 'Interview',
    description: 'Coordinate the panel, the schedule and the feedback loop without delays.',
    detail: ['Panel and slot coordination', 'Candidate prep and reminders', 'Feedback collected and consolidated'],
  },
  {
    id: 'selection',
    step: '06',
    title: 'Selection',
    description: 'Manage the decision, communicate it clearly and handle the offer discussion.',
    detail: ['Offer discussion support', 'Expectation and negotiation clarity', 'Decision communicated promptly'],
  },
  {
    id: 'followup',
    step: '07',
    title: 'Follow-up',
    description: 'Keep candidates and clients informed — especially when there is no immediate news.',
    detail: ['Status updates to both sides', 'Counter-offer and withdrawal handling', 'Candidate experience protected'],
  },
  {
    id: 'onboarding',
    step: '08',
    title: 'Onboarding',
    description: 'Stay involved until the hire is settled, then close the loop properly.',
    detail: ['Pre-joining coordination', 'Confirmation of joining', 'Post-hire check-in'],
  },
];

/**
 * The PEOPLE × TECHNOLOGY differentiator.
 */
export const peopleTechnology = {
  headline: 'People × Technology',
  statement:
    'I understand both the candidate and the technology. That means fewer surprises, faster alignment and hiring decisions that hold up.',
  people: {
    label: 'People',
    description:
      'Sourcing, screening, communication, coordination and follow-up — the part of recruitment that depends entirely on how you work with a person.',
    items: ['Recruitment', 'Communication', 'Screening', 'Coordination', 'Relationship'],
  },
  technology: {
    label: 'Technology',
    description:
      'The stack I have actually built with, so I can read a requirement, understand a tech stack and speak to engineers directly.',
    items: ['React', 'JavaScript', 'Node', 'MongoDB', 'APIs'],
  },
};

export default hrCapabilities;
