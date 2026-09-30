'use client';

import { contact } from '@/data/contact';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import Icon from './Icon';

const CHANNELS = [
  {
    id: 'linkedin',
    icon: 'linkedin',
    label: 'LinkedIn',
    accent: 'var(--accent)',
    href: () => contact.social.linkedin.url || null,
  },
  {
    id: 'instagram',
    icon: 'instagram',
    label: 'Instagram',
    accent: 'var(--accent-3)',
    href: () => contact.social.instagram.url || null,
  },
  {
    id: 'github',
    icon: 'github',
    label: 'GitHub',
    accent: 'var(--accent-2)',
    href: () => contact.social.github.url || null,
  },
  {
    id: 'email',
    icon: 'message',
    label: 'Email',
    accent: 'var(--accent-3)',
    href: () => (contact.email ? `mailto:${contact.email}` : null),
  },
  {
    id: 'whatsapp',
    icon: 'whatsapp',
    label: 'WhatsApp',
    accent: 'var(--accent-2)',
    href: () => buildWhatsAppUrl(contact.whatsapp.number, contact.whatsapp.defaultMessage),
  },
];

/**
 * Social channel row.
 *
 * A channel without a configured URL is rendered as a clearly marked,
 * non-interactive item rather than a dead link — nothing is ever faked.
 */
export default function SocialButtons({
  className,
  variant = 'icons',
  exclude = [],
  message,
}) {
  const channels = CHANNELS.filter((channel) => !exclude.includes(channel.id));

  if (variant === 'icons') {
    return (
      <ul className={cn('flex flex-wrap items-center gap-2.5', className)}>
        {channels.map((channel) => {
          const href = channelHref(channel, message);
          return (
            <li key={channel.id}>
              <ChannelButton channel={channel} href={href} />
            </li>
          );
        })}
      </ul>
    );
  }

  /* Same card as `rows`, laid out horizontally and sharing the available
     width. Items keep their min width until `lg`, then compress so a whole
     row of channels fits on one line. */
  if (variant === 'chips') {
    return (
      <ul className={cn('flex flex-wrap items-stretch gap-2.5', className)}>
        {channels.map((channel) => {
          const href = channelHref(channel, message);
          return (
            <li key={channel.id} className="min-w-[13rem] flex-1 lg:min-w-0">
              <ChannelRow channel={channel} href={href} />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={cn('flex flex-col gap-2.5', className)}>
      {channels.map((channel) => {
        const href = channelHref(channel, message);
        return (
          <li key={channel.id}>
            <ChannelRow channel={channel} href={href} />
          </li>
        );
      })}
    </ul>
  );
}

function channelHref(channel, message) {
  if (channel.id === 'whatsapp') {
    return buildWhatsAppUrl(contact.whatsapp.number, message || contact.whatsapp.defaultMessage);
  }
  return channel.href();
}

const isExternal = (href) => Boolean(href && /^https?:/.test(href));

function ChannelButton({ channel, href }) {
  const configured = Boolean(href);
  const shared = cn(
    'group relative flex size-10 items-center justify-center rounded-full border transition-all duration-300',
    configured
      ? 'border-line bg-surface/60 text-muted hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_50%,var(--line))] hover:text-text'
      : 'border-dashed border-line text-muted-2 opacity-55',
  );

  const content = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 scale-75 rounded-full opacity-0 blur-md transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${channel.accent}, transparent 70%)` }}
      />
      <Icon name={channel.icon} className="relative z-10 size-[17px]" />
      {!configured && (
        <span
          aria-hidden="true"
          className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent-4"
        />
      )}
      <span className="sr-only">
        {channel.label}
        {configured ? '' : ' — not configured yet'}
      </span>
    </>
  );

  if (!configured) {
    return (
      <span
        className={shared}
        title={`Add your ${channel.label} URL in src/data/contact.js to activate this channel.`}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={shared}
      target={isExternal(href) ? '_blank' : undefined}
      rel={isExternal(href) ? 'noopener noreferrer' : undefined}
      aria-label={channel.label}
    >
      {content}
    </a>
  );
}

function ChannelRow({ channel, href }) {
  const configured = Boolean(href);
  const detail =
    channel.id === 'email'
      ? contact.email
      : channel.id === 'whatsapp'
        ? contact.whatsapp.number
          ? `+${contact.whatsapp.number}`
          : 'Not configured'
        : channel.label;

  const inner = (
    <>
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface/60 text-muted transition-colors duration-300',
          configured && 'group-hover:border-accent/50 group-hover:text-accent',
        )}
      >
        <Icon name={channel.icon} className="size-[17px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[13px] font-medium text-text">{channel.label}</span>
        <span className="truncate text-[11.5px] text-muted">{detail}</span>
      </span>
      {!configured && (
        <span className="size-1.5 shrink-0 rounded-full bg-accent-4" aria-hidden="true" />
      )}
      <Icon
        name="moveRight"
        className="size-4 shrink-0 text-muted-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
      />
    </>
  );

  if (!configured) {
    return (
      <span
        className="flex h-full w-full items-center gap-3 rounded-[var(--radius-sm)] border border-dashed border-line px-3 py-2.5 opacity-60"
        title={`Add your ${channel.label} URL in src/data/contact.js to activate this channel.`}
      >
        {inner}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={isExternal(href) ? '_blank' : undefined}
      rel={isExternal(href) ? 'noopener noreferrer' : undefined}
      className="group flex h-full w-full items-center gap-3 rounded-[var(--radius-sm)] border border-line bg-surface/50 px-3 py-2.5 transition-all duration-300 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--line))] hover:bg-surface"
    >
      {inner}
    </a>
  );
}

export { CHANNELS };
