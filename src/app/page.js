import Hero from '@/components/hero/Hero';
import About from '@/components/about/About';
import HRCapabilities from '@/components/hr/HRCapabilities';
import RecruitmentWorkflow from '@/components/hr/RecruitmentWorkflow';
import HRSkills from '@/components/hr/HRSkills';
import PeopleTechnology from '@/components/hr/PeopleTechnology';
import TechStackSection from '@/components/stack/TechStack';
import Experience from '@/components/experience/Experience';
import Projects from '@/components/projects/Projects';
import Education from '@/components/education/Education';
import Certifications from '@/components/certifications/Certifications';
import Contact from '@/components/contact/Contact';

/**
 * Page composition.
 *
 * Order is deliberate: identity → people → process → proof → technology →
 * work → credentials → contact. HR is presented before technology, always.
 */
export default function Page() {
  return (
    <>
      <Hero />

      <About />

      <HRCapabilities />
      <RecruitmentWorkflow />
      <HRSkills />
      <PeopleTechnology />

      <Experience />

      <TechStackSection />

      <Projects />

      <Education />
      <Certifications />
      <Contact />
    </>
  );
}
