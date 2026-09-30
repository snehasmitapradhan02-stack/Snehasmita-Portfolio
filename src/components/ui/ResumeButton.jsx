'use client';

import MagneticButton from './MagneticButton';
import Icon from './Icon';
import useAsset from '@/hooks/useAsset';
import useMounted from '@/hooks/useMounted';
import { RESUME_CANDIDATES } from '@/lib/assets';
import { contact } from '@/data/contact';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * "Download Resume" CTA.
 *
 * If a resume PDF is present in /public/resume it downloads. If not, it
 * degrades to a link to the contact section rather than 404-ing — nothing
 * is faked, and the visitor always gets a way forward.
 */
export default function ResumeButton({
  children = 'Download Resume',
  className,
  variant = 'ghost',
  size = 'md',
}) {
  const { src, hasAsset } = useAsset(RESUME_CANDIDATES, { enabled: true, kind: 'document' });
  const mounted = useMounted();

  if (hasAsset && src) {
    return (
      <MagneticButton
        as="a"
        href={src}
        download
        target="_blank"
        rel="noreferrer noopener"
        variant={variant}
        size={size}
        className={className}
      >
        <Icon name="download" className="size-4" strokeWidth={1.8} />
        {children}
      </MagneticButton>
    );
  }

  // Not uploaded yet → offer a direct line instead of a dead download.
  const fallbackHref =
    buildWhatsAppUrl(contact.whatsapp.number, contact.whatsapp.defaultMessage) ?? '#contact';

  return (
    <MagneticButton
      as="a"
      href={fallbackHref}
      target={fallbackHref.startsWith('http') ? '_blank' : undefined}
      rel={fallbackHref.startsWith('http') ? 'noreferrer noopener' : undefined}
      variant={variant}
      size={size}
      className={className}
      title={
        mounted
          ? 'No resume PDF found in /public/resume — send a message and I will share it directly.'
          : undefined
      }
      data-resume-state={mounted && !hasAsset ? 'missing' : 'probing'}
    >
      <Icon name="file" className="size-4" strokeWidth={1.8} />
      {children}
    </MagneticButton>
  );
}
