'use client';

import {
  Award,
  BadgeCheck,
  Binary,
  Briefcase,
  Calendar,
  Check,
  Compass,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Fingerprint,
  Gauge,
  GraduationCap,
  Layout,
  LayoutGrid,
  Layers,
  MessageCircle,
  MessageSquareText,
  MoveRight,
  Network,
  Orbit,
  PhoneCall,
  Plug,
  Plus,
  ScanLine,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  Users,
  Waypoints,
  Workflow,
} from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Named brand marks. Lucide dropped brand glyphs in v1, so the social
 * platforms are inlined here. They inherit `currentColor` like every other
 * icon, so they theme correctly in both modes.
 */
const LinkedinMark = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0" />
  </svg>
);

const InstagramMark = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 0C8.74 0 8.33.01 7.05.02 5.78.03 4.9.07 4.14.19 3.38.3 2.73.48 2.17.63a4.9 4.9 0 0 0-1.77 1.16A4.9 4.9 0 0 0 4.24 3.56 4.9 4.9 0 0 0 3.07 5.3c-.15.55-.32 1.2-.43 1.97C2.53 8.43 2.52 8.84 2.52 12s.01 3.57.12 4.73c.11.77.28 1.42.43 1.97a4.9 4.9 0 0 0 1.17 1.77 4.9 4.9 0 0 0 1.77 1.16c.56.16 1.21.29 1.97.43.85.11 1.26.12 4.42.12s3.57-.01 4.73-.12c.77-.11 1.42-.28 1.97-.43a4.9 4.9 0 0 0 1.77-1.17 4.9 4.9 0 0 0 1.16-1.77c.16-.56.29-1.21.43-1.97.11-.85.12-1.26.12-4.42s-.01-3.57-.12-4.73c-.11-.77-.28-1.42-.43-1.97a4.9 4.9 0 0 0-1.16-1.77 4.9 4.9 0 0 0-1.77-1.16c-.56-.16-1.21-.29-1.97-.43C15.57 0 15.16 0 12 0m0 1.98c3.13 0 3.5.01 4.73.11.77.04 1.19.17 1.47.28.37.14.63.31.91.59.28.28.45.54.59.91.11.28.24.7.28 1.47.1 1.23.11 1.6.11 4.73s-.01 3.5-.11 4.73c-.04.77-.17 1.19-.28 1.47a2.44 2.44 0 0 1-.59.91c-.28.28-.54.45-.91.59-.28.11-.7.24-1.47.28-1.23.1-1.6.11-4.73.11s-3.5-.01-4.73-.11c-.77-.04-1.19-.17-1.47-.28a2.44 2.44 0 0 1-.91-.59 2.44 2.44 0 0 1-.59-.91c-.11-.28-.24-.7-.28-1.47C3.5 15.5 3.49 15.13 3.49 12s.01-3.5.11-4.73c.04-.77.17-1.19.28-1.47.14-.37.31-.63.59-.91.28-.28.54-.45.91-.59.28-.11.7-.24 1.47-.28C8.5 2.01 8.87 2 12 2m0 3.62A6.38 6.38 0 1 0 12 18.38 6.38 6.38 0 0 0 12 5.62m0 10.5a4.13 4.13 0 1 1 0-8.25 4.13 4.13 0 0 1 0 8.25m6.4-11.85a1.49 1.49 0 1 0 0 2.98 1.49 1.49 0 0 0 0-2.98" />
  </svg>
);

const GithubMark = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);

const WhatsappMark = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01 9.44 9.44 0 0 1 15.77-7.03 9.36 9.36 0 0 1 2.76 6.62 9.44 9.44 0 0 1-9.12 9.83M20.52 3.49A11.8 11.8 0 0 0 12.04 0C5.5 0 .19 5.31.19 11.84c0 2.09.55 4.13 1.59 5.93L.09 24l6.37-1.67a11.82 11.82 0 0 0 5.58 1.42h.01c6.54 0 11.85-5.31 11.85-11.84 0-3.17-1.24-6.15-3.48-8.39" />
  </svg>
);

export const brandIcons = {
  linkedin: LinkedinMark,
  instagram: InstagramMark,
  github: GithubMark,
  whatsapp: WhatsappMark,
};

const icons = {
  award: Award,
  badge: BadgeCheck,
  binary: Binary,
  briefcase: Briefcase,
  calendar: Calendar,
  check: Check,
  compass: Compass,
  cpu: Cpu,
  database: Database,
  download: Download,
  external: ExternalLink,
  file: FileText,
  filter: Filter,
  fingerprint: Fingerprint,
  gauge: Gauge,
  graduation: GraduationCap,
  layout: Layout,
  layoutGrid: LayoutGrid,
  layers: Layers,
  message: MessageCircle,
  messages: MessageSquareText,
  moveRight: MoveRight,
  network: Network,
  orbit: Orbit,
  phoneCall: PhoneCall,
  plug: Plug,
  plus: Plus,
  scan: ScanLine,
  search: Search,
  send: Send,
  shield: ShieldCheck,
  sparkles: Sparkles,
  userPlus: UserPlus,
  user: UserRound,
  users: Users,
  waypoints: Waypoints,
  workflow: Workflow,
  ...brandIcons,
};

export function Icon({ name, className, strokeWidth = 1.5, ...props }) {
  const Component = icons[name] ?? Fingerprint;
  const isBrand = brandIcons[name];
  return (
    <Component
      className={cn('size-5 shrink-0', className)}
      strokeWidth={isBrand ? undefined : strokeWidth}
      {...(isBrand ? { fill: 'currentColor' } : {})}
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export default Icon;
