/**
 * Asset path resolution helpers.
 *
 * The portfolio ships without binary assets. Instead of hardcoding a
 * filename, every image is probed at runtime: drop a file into the matching
 * /public folder and it appears automatically. When nothing is found the UI
 * renders a designed placeholder rather than a broken image.
 */

const EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'avif'];

/** Builds `/dir/name.ext` candidates for each supported extension. */
function candidates(dir, name) {
  const prefix = dir ? `/${dir.replace(/^\/+|\/+$/g, '')}` : '';
  return EXTENSIONS.map((extension) => `${prefix}/${name}.${extension}`);
}

export const PROFILE_IMAGE_CANDIDATES = [
  ...candidates('profile', 'profile'),
  ...candidates('profile', 'portrait'),
  ...candidates('profile', 'snehasmita'),
  ...candidates('profile', 'snehasmita-pradhan'),
  // Matches `sneha profile.png` and the hyphenated spelling. The space is
  // encoded because the name reaches the network layer as a URL.
  ...candidates('profile', 'sneha%20profile'),
  ...candidates('profile', 'sneha-profile'),
  ...candidates('profile', 'sneha'),
  ...candidates('profile', 'photo'),
  ...candidates('profile', 'me'),
  ...candidates('profile', 'headshot'),
  ...candidates('profile', 'head'),
  ...candidates('profile', 'face'),
  ...candidates('profile', 'image'),
  ...candidates('profile', 'img'),
  ...candidates('', 'profile'),
  ...candidates('', 'portrait'),
  ...candidates('', 'snehasmita'),
];

export const RESUME_CANDIDATES = [
  process.env.NEXT_PUBLIC_RESUME_FILE || '/resume/Snehasmita-Pradhan-Resume.pdf',
  '/resume/resume.pdf',
  '/resume/Snehasmita-Pradhan-Resume.pdf',
];

export { candidates };
