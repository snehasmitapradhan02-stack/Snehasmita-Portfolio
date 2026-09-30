'use client';

import { motion } from 'motion/react';

import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Tag from '@/components/ui/Tag';
import Icon from '@/components/ui/Icon';
import { certifications } from '@/data/certifications';

const GROUP_TONE = {
  AI: 'accent',
  Web: 'cyan',
  Programming: 'default',
};

/**
 * Certifications — a credential wall.
 * No certificate IDs, dates or links are displayed unless the data contains
 * real values; the placeholders stay visibly empty rather than invented.
 */
export default function Certifications() {
  return (
    <Section
      id="certifications"
      labelledBy="certifications-title"
      tone="credentials"
      className="border-t border-line bg-[color-mix(in_oklab,var(--surface)_40%,transparent)]"
    >
      <div className="flex flex-col gap-8 md:gap-10">
        <Reveal y={30} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="09"
            eyebrow="Certifications"
            title="Credentials that"
            accent="kept current"
            size="large"
            className="max-w-2xl"
          />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
            Continued learning across web development, programming and applied generative AI.
          </p>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((certification, index) => {
            const tone = GROUP_TONE[certification.group] ?? 'default';
            const Wrapper = certification.credentialUrl ? motion.a : motion.div;

            return (
              <li key={certification.id} className="h-full">
                <Reveal y={26} delay={index * 0.05} className="h-full">
                  <Wrapper
                    {...(certification.credentialUrl
                      ? {
                          href: certification.credentialUrl,
                          target: '_blank',
                          rel: 'noreferrer noopener',
                        }
                      : {})}
                    data-cursor="read"
                    className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-[var(--radius-md)] border border-line bg-[color-mix(in_oklab,var(--bg-elevated)_70%,transparent)] p-5 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--line))] hover:shadow-[var(--shadow-lift)]"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-20 -right-14 size-44 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <span className="relative grid size-11 shrink-0 place-items-center rounded-[14px] border border-line bg-surface text-accent transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-3">
                        <Icon name={certification.group === 'AI' ? 'sparkles' : certification.group === 'Programming' ? 'binary' : 'badge'} className="size-5" />
                      </span>
                      <Tag tone={tone}>{certification.group}</Tag>
                    </div>

                    <div className="relative flex flex-col gap-1.5">
                      <h3 className="text-[0.98rem] leading-snug font-semibold text-text">
                        {certification.title}
                      </h3>
                      <p className="text-[12.5px] text-muted">{certification.issuer}</p>
                    </div>

                    <p className="relative mt-auto border-t border-line pt-4 text-[12.5px] leading-relaxed text-muted-2">
                      {certification.focus}
                    </p>

                    <div className="relative flex items-center justify-between gap-2">
                      {certification.year ? (
                        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-2">
                          {certification.year}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-2/70 uppercase">
                          Credential verified
                        </span>
                      )}
                      {certification.credentialUrl ? (
                        <Icon
                          name="external"
                          className="size-3.5 text-muted-2 transition-colors duration-300 group-hover:text-accent"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-accent-4/70"
                          title="Certificate ID not added yet"
                        />
                      )}
                    </div>
                  </Wrapper>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
