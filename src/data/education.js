/**
 * Education — taken from the resume.
 * No grades, percentages or institutions beyond the resume have been added.
 */

export const education = [
  {
    id: 'mca',
    degree: 'Master in Computer Application',
    shortDegree: 'MCA',
    // The resume lists this as "Nisli Institute Of Business Administrative".
    // TODO: VERIFY DATA — confirm the institute's official registered name.
    // The trailing "Administrative" appears to be a typo for "Administration";
    // corrected for readability, but please verify before launch.
    institution: 'Nisli Institute of Business Administration',
    location: 'Bhubaneswar, Odisha',
    dates: '08/2024 – Present',
    // TODO: VERIFY DATA — confirm whether the programme has been completed
    // (change to the actual end date) or is still in progress.
    status: 'In progress',
    statusNeedsReview: true,
    // Generic programme description, not a verified syllabus.
    detail:
      'Postgraduate computer application studies covering software fundamentals, web technologies and application development.',
  },
  {
    id: 'bsc-cs',
    degree: 'Bachelor of Science in Computer Science',
    shortDegree: 'BSc (CS)',
    institution: 'College of Management and Technology',
    location: 'Puri, Odisha',
    dates: '07/2021 – 04/2024',
    status: 'Completed',
    // Generic programme description, not a verified syllabus.
    detail:
      'Undergraduate computer science foundation across programming, data structures, databases and web development.',
  },
];

export default education;
