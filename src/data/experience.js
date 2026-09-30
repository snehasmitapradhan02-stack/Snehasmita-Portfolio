/**
 * Professional experience — resume entries, plus the current role verified from
 * the public LinkedIn profile.
 *
 * DATA INTEGRITY NOTES
 * - No dates, companies or titles have been altered.
 * - The Orthospine Care date range is inconsistent in the source resume and
 *   is reproduced exactly as provided, flagged with a TODO for review.
 * - The SULAG entry carries ONLY what is publicly verifiable:
 *     • employer ................ SULAG
 *     • title .................. HR Consultant
 *     • start .................. August 2026
 *     • employer sector ........ Staffing and Recruiting
 *     • employer base .......... Khurda, Odisha (corporate office Bhubaneswar)
 *   The start month is taken from SULAG's own public LinkedIn announcement
 *   welcoming Snehasmita Pradhan to the team as HR Consultant (07 Aug 2026),
 *   which is the same month her profile shows the role beginning. Individual
 *   responsibilities are not published, so none are invented — see the entry.
 * - Nothing from any other person has been merged into this file.
 * - Ordering reflects the resume sequence.
 */

export const experience = [
  {
    id: 'sulag',
    company: 'SULAG',
    role: 'HR Consultant',
    // VERIFIED — August 2026 start. SULAG publicly announced the appointment
    // ("Welcome to the SULAG Team, Snehasmita! … as an HR Consultant",
    // posted 07 Aug 2026), and her profile lists the role as current from the
    // same month. The "dates need review" flag has been removed because the
    // range is now published rather than assumed.
    dates: '08/2026 – Present',
    // SULAG's corporate office is in Bhubaneswar (public company page), which
    // is also the profile location. The role itself does not publish a city.
    location: 'Bhubaneswar, Odisha',
    type: 'Current Role',
    // No stack is listed for this role, so no technologies are attached.
    stack: [],
    companyNote:
      'SULAG is a staffing and recruiting company headquartered in Odisha, India, with its corporate office in Bhubaneswar.',
    // Deliberately sparse: the title, employer and start month are the only
    // published facts. No duties, achievements, clients or team size are
    // claimed, because none of it is publicly stated.
    responsibilities: [
      'HR Consultant at SULAG — a staffing and recruiting company based in Odisha, India.',
      'Individual responsibilities are not published on the public profile, so nothing further is claimed here.',
    ],
  },
  {
    id: 'mern-intern',
    company: 'MERN Stack Internship',
    // TODO: VERIFY DATA — confirm the exact internship / organisation name.
    companyNote:
      'Internship programme. Organisation name was not specified in the resume.',
    role: 'MERN Stack Intern',
    dates: '07/2025 – 10/2025',
    location: 'Bhubaneswar, Odisha',
    type: 'Internship',
    stack: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Git'],
    responsibilities: [
      'Developed responsive web applications using React.js, JavaScript, HTML and CSS.',
      'Built REST APIs with Node.js and Express.js.',
      'Managed MongoDB databases.',
      'Implemented JWT authentication and authorization.',
      'Worked on real-world projects, debugging and optimization.',
      'Collaborated with developers using Git/GitHub and Agile practices.',
    ],
  },
  {
    id: 'orthospine',
    company: 'Orthospine Care',
    role: 'Front-End Developer',
    // TODO: Verify Orthospine Care employment dates from latest resume/LinkedIn.
    // The source resume lists "02/2026 – 07/2025", which is not a valid range.
    // Reproduced verbatim on purpose — please confirm the correct dates and
    // update ONLY this string. Do not delete the TODO before verifying.
    dates: '02/2026 – 07/2025',
    datesNeedReview: true,
    datesNote: 'Date range as listed in the resume — verification required.',
    location: 'Bhubaneswar, Odisha',
    type: 'Client Project',
    stack: ['React.js', 'JavaScript', 'HTML5', 'CSS3'],
    responsibilities: [
      'Developed responsive healthcare web interfaces.',
      'Used React.js, JavaScript, HTML5 and CSS3.',
      'Built reusable React components.',
      'Implemented responsive UI features.',
      'Collaborated with clients.',
      'Performed UI testing, debugging and browser compatibility optimization.',
    ],
  },
];

export default experience;
