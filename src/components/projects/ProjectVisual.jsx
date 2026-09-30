'use client';

import Icon from '@/components/ui/Icon';
import { projectVisuals } from '@/data/projectVisuals';
import { cn } from '@/lib/utils';

/**
 * Project visual system.
 *
 * `ProjectCard` renders a real screenshot whenever one exists in
 * /public/projects. Until then this draws a project-specific interface concept
 * so the visual — not a paragraph of text — is the first thing a visitor reads.
 *
 * These are deliberately abstract UI illustrations: flat panels, icon tiles and
 * placeholder bars drawn from the existing `Icon` set. They are never presented
 * as screenshots of a live product, they contain no real data, and the card
 * labels them "UI concept" so the distinction is explicit. The concept config
 * lives in `src/data/projectVisuals.js`.
 *
 * Cost: pure markup driven by the theme tokens, so a card adds no image
 * request, no canvas and no additional bundle weight in either colour mode.
 */
export default function ProjectVisual({ project, className }) {
  const visual = projectVisuals[project.slug] ?? projectVisuals.default;
  const Template = TEMPLATES[visual.template] ?? TEMPLATES.dashboard;

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      {/* ambient field */}
      <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--navy)_58%,var(--surface))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_16%,color-mix(in_oklab,var(--accent)_26%,transparent),transparent_56%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_88%,color-mix(in_oklab,var(--accent-2)_18%,transparent),transparent_54%)]" />
      <div className="absolute inset-0 grid-surface opacity-45" />

      {/* the mock app window */}
      <div className="absolute inset-[7%] flex flex-col overflow-hidden rounded-[12px] border border-white/12 bg-[color-mix(in_oklab,var(--navy)_78%,transparent)] shadow-[0_28px_64px_-30px_rgba(0,0,0,0.8)]">
        <WindowBar label={visual.app} icon={visual.icon} accent={visual.accent} />
        <div className="relative flex min-h-0 flex-1 flex-col gap-1.5 p-2">
          <Template visual={visual} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const TEMPLATES = {
  dashboard: DashboardConcept,
  booking: BookingConcept,
  listing: ListingConcept,
  tracker: TrackerConcept,
  menu: MenuConcept,
};

function WindowBar({ label, icon, accent }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 px-2 py-1.5">
      <span className="size-[5px] rounded-full bg-white/25" />
      <span className="size-[5px] rounded-full bg-white/18" />
      <span className="size-[5px] rounded-full bg-white/12" />

      <span className="ml-1 flex min-w-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 py-[2px] pr-2 pl-1">
        <span
          className="grid size-[10px] shrink-0 place-items-center rounded-[3px]"
          style={{
            background: `color-mix(in oklab, ${accent} 26%, transparent)`,
            color: accent,
          }}
        >
          <Icon name={icon} className="size-[6px]" strokeWidth={2.2} />
        </span>
        <span className="truncate text-[6.5px] leading-none font-medium tracking-[0.16em] text-white/60 uppercase">
          {label}
        </span>
      </span>
    </div>
  );
}

/** Stat tiles + chart + activity list. */
function DashboardConcept({ visual }) {
  return (
    <>
      <div className="flex shrink-0 gap-1.5">
        {visual.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-1 flex-col gap-1 rounded-[7px] border border-white/10 bg-white/5 p-1.5"
          >
            <span className="flex items-center gap-1">
              <Tile icon={stat.icon} tint={visual.accent} />
              <span className="truncate text-[6.5px] leading-none tracking-[0.1em] text-white/45 uppercase">
                {stat.label}
              </span>
            </span>
            <span className="h-[3px] w-3/5 rounded-full bg-white/20" />
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 gap-1.5">
        <div className="flex min-w-0 flex-[1.3] flex-col gap-1.5 rounded-[7px] border border-white/10 bg-white/[0.03] p-1.5">
          <span className="text-[6.5px] leading-none tracking-[0.14em] text-white/40 uppercase">
            {visual.chartLabel}
          </span>
          <div className="flex min-h-0 flex-1 items-end gap-[3px]">
            {visual.chart.map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-[2px] transition-[height] duration-700 ease-out"
                style={{
                  height: `${height}%`,
                  background:
                    index === visual.chart.length - 1
                      ? visual.accent
                      : 'rgba(255, 255, 255, 0.14)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 rounded-[7px] border border-white/10 bg-white/[0.03] p-1.5">
          {visual.rows.map((row) => (
            <div key={row.label} className="flex min-w-0 items-center gap-1">
              <Tile icon={row.icon} tint={visual.secondary} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[6.5px] leading-tight text-white/65">
                  {row.label}
                </span>
                <span className="mt-[3px] block h-[2px] w-2/3 rounded-full bg-white/12" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Service chips → weekday strip → time slots → confirm bar. */
function BookingConcept({ visual }) {
  return (
    <>
      <div className="flex shrink-0 gap-1">
        {visual.services.map((service, index) => (
          <span
            key={service}
            className={cn(
              'truncate rounded-full border px-1.5 py-[3px] text-[6px] leading-none tracking-[0.1em] uppercase',
              index === 0
                ? 'border-transparent bg-[color-mix(in_oklab,var(--accent-3)_26%,transparent)] text-white/80'
                : 'border-white/10 text-white/40',
            )}
          >
            {service}
          </span>
        ))}
      </div>

      <div className="flex shrink-0 gap-[3px]">
        {visual.days.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className={cn(
              'grid flex-1 place-items-center rounded-[5px] border py-[3px] text-[6px] leading-none',
              index === 1
                ? 'border-transparent bg-[color-mix(in_oklab,var(--accent-3)_45%,transparent)] text-white'
                : 'border-white/10 text-white/40',
            )}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-[3px]">
        {visual.slots.map((slot, index) => (
          <span
            key={slot}
            className={cn(
              'grid place-items-center rounded-[5px] border text-[5.5px] leading-none tabular-nums',
              index === 2
                ? 'border-[color-mix(in_oklab,var(--accent-3)_55%,transparent)] bg-[color-mix(in_oklab,var(--accent-3)_14%,transparent)] text-white/75'
                : index === 4
                  ? 'border-white/6 text-white/18 line-through'
                  : 'border-white/10 text-white/50',
            )}
          >
            {slot}
          </span>
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-1.5 rounded-[7px] border border-white/10 bg-white/5 px-1.5 py-1">
        <span className="h-[3px] w-1/3 rounded-full bg-white/18" />
        <span className="rounded-full bg-[color-mix(in_oklab,var(--accent-3)_70%,transparent)] px-2 py-[3px] text-[5.5px] leading-none tracking-[0.14em] text-white uppercase">
          Confirm
        </span>
      </div>
    </>
  );
}

/** Search bar → item grid → cart bar. */
function ListingConcept({ visual }) {
  return (
    <>
      <div className="flex shrink-0 items-center gap-1 rounded-[7px] border border-white/10 bg-white/5 px-1.5 py-1">
        <Icon name="search" className="size-[7px] text-white/35" strokeWidth={2.2} />
        <span className="truncate text-[6px] leading-none tracking-[0.12em] text-white/35 uppercase">
          {visual.search}
        </span>
        <Icon name="filter" className="ml-auto size-[7px] text-white/35" strokeWidth={2.2} />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-1">
        {visual.items.map((item, index) => (
          <div
            key={index}
            className="flex min-w-0 flex-col overflow-hidden rounded-[7px] border border-white/10 bg-white/[0.03]"
          >
            <div className="relative h-[34%] min-h-[18px] w-full shrink-0 bg-white/6">
              <span
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{
                  background: `linear-gradient(to top, color-mix(in oklab, ${
                    index % 2 ? visual.secondary : visual.accent
                  } 26%, transparent), transparent)`,
                }}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[3px] p-1">
              <span className="h-[3px] w-3/4 rounded-full bg-white/22" />
              {item.tag && (
                <span
                  className="w-fit rounded-full px-1 py-px text-[5px] leading-none tracking-[0.1em] uppercase"
                  style={{
                    background: `color-mix(in oklab, ${visual.accent} 24%, transparent)`,
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {item.tag}
                </span>
              )}
              <span className="mt-auto h-[3px] w-1/3 rounded-full bg-white/15" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-1.5 rounded-[7px] border border-white/10 bg-white/5 px-1.5 py-1">
        <span className="flex items-center gap-1 text-[6px] leading-none tracking-[0.12em] text-white/45 uppercase">
          <Icon name="layoutGrid" className="size-[7px]" strokeWidth={2.2} />
          {visual.cart}
        </span>
        <span
          className="rounded-full px-2 py-[3px] text-[5.5px] leading-none tracking-[0.12em] text-white uppercase"
          style={{ background: `color-mix(in oklab, ${visual.accent} 62%, transparent)` }}
        >
          Checkout
        </span>
      </div>
    </>
  );
}

/** Bar chart + category legend + summary rows. */
function TrackerConcept({ visual }) {
  return (
    <>
      <div className="flex shrink-0 gap-1.5">
        {visual.legend.map((item) => (
          <span
            key={item.label}
            className="flex min-w-0 flex-1 items-center gap-1 rounded-[7px] border border-white/10 bg-white/5 px-1.5 py-1"
          >
            <span
              className="size-[5px] shrink-0 rounded-full"
              style={{ background: item.tint }}
            />
            <span className="truncate text-[6px] leading-none tracking-[0.1em] text-white/50 uppercase">
              {item.label}
            </span>
          </span>
        ))}
      </div>

      <div className="flex min-h-0 flex-[1.4] flex-col gap-1.5 rounded-[7px] border border-white/10 bg-white/[0.03] p-1.5">
        <span className="text-[6.5px] leading-none tracking-[0.14em] text-white/40 uppercase">
          {visual.chartLabel}
        </span>
        <div className="flex min-h-0 flex-1 items-end gap-[2px]">
          {visual.bars.map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-t-[2px]"
              style={{
                height: `${height}%`,
                background: `color-mix(in oklab, ${
                  index % 3 === 0 ? visual.accent : index % 3 === 1 ? visual.secondary : 'var(--accent-3)'
                } ${38 + (index % 3) * 14}%, transparent)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-1 rounded-[7px] border border-white/10 bg-white/[0.03] p-1.5">
        {visual.rows.map((row) => (
          <div key={row.label} className="flex min-w-0 items-center gap-1">
            <Tile icon={row.icon} tint={visual.accent} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[6.5px] leading-tight text-white/65">
                {row.label}
              </span>
              <span className="mt-[3px] block h-[2px] w-2/3 rounded-full bg-white/12" />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/** Category chips + dish list + order panel. */
function MenuConcept({ visual }) {
  return (
    <div className="flex min-h-0 flex-1 gap-1.5">
      <div className="flex min-w-0 flex-[1.35] flex-col gap-1">
        <div className="flex shrink-0 gap-[3px]">
          {visual.categories.map((category, index) => (
            <span
              key={category}
              className={cn(
                'truncate rounded-full border px-1.5 py-[3px] text-[5.5px] leading-none tracking-[0.08em] uppercase',
                index === 0
                  ? 'border-transparent bg-[color-mix(in_oklab,var(--accent-4)_28%,transparent)] text-white/80'
                  : 'border-white/10 text-white/38',
              )}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between gap-1">
          {visual.dishes.map((dish, index) => (
            <div
              key={dish}
              className="flex min-w-0 items-center gap-1.5 rounded-[7px] border border-white/10 bg-white/[0.03] p-1"
            >
              <span className="relative size-[16px] shrink-0 overflow-hidden rounded-[5px] bg-white/8">
                <span
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 34% 32%, color-mix(in oklab, ${
                      index % 2 ? visual.secondary : visual.accent
                    } 40%, transparent), transparent 70%)`,
                  }}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[6.5px] leading-tight text-white/70">
                  {dish}
                </span>
                <span className="mt-[3px] block h-[2px] w-2/5 rounded-full bg-white/14" />
              </span>
              <span className="h-[3px] w-3 shrink-0 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 rounded-[7px] border border-white/10 bg-white/[0.03] p-1.5">
        <span className="truncate text-[6px] leading-none tracking-[0.12em] text-white/40 uppercase">
          {visual.order}
        </span>
        {[0, 1, 2].map((index) => (
          <span key={index} className="flex items-center justify-between gap-1">
            <span className="h-[3px] flex-1 rounded-full bg-white/14" />
            <span className="h-[3px] w-2.5 shrink-0 rounded-full bg-white/22" />
          </span>
        ))}
        <span
          className="mt-auto grid place-items-center rounded-[6px] py-[4px] text-[5.5px] leading-none tracking-[0.14em] text-white uppercase"
          style={{ background: `color-mix(in oklab, ${visual.accent} 62%, transparent)` }}
        >
          Place order
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Tile({ icon, tint }) {
  return (
    <span
      className="grid size-[11px] shrink-0 place-items-center rounded-[3px] border"
      style={{
        borderColor: `color-mix(in oklab, ${tint} 26%, transparent)`,
        background: `color-mix(in oklab, ${tint} 14%, transparent)`,
        color: tint,
      }}
    >
      <Icon name={icon} className="size-[6px]" strokeWidth={2.2} />
    </span>
  );
}
