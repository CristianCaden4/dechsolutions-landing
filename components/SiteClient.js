'use client';

import { useScrollEffects } from './useScrollEffects';
import Nav from './Nav';
import Hero from './Hero';
import ProblemSection from './ProblemSection';
import SolutionsSection from './SolutionsSection';
import ProductsSection from './ProductsSection';
import MethodologySection from './MethodologySection';
import IndustriesSection from './IndustriesSection';
import DiagnosticoSection from './DiagnosticoSection';
import CasosSection from './CasosSection';
import CTASection from './CTASection';
import Footer from './Footer';
import MarqueeBand from './MarqueeBand';
import Intro from './fx/Intro';
import Cursor from './fx/Cursor';

export default function SiteClient() {
  const { navScrolled, navTheme } = useScrollEffects();

  return (
    <>
      <Intro />
      <Cursor />
      <Nav navScrolled={navScrolled} navTheme={navTheme} />
      <Hero />
      <ProblemSection />
      <SolutionsSection />
      <MarqueeBand />
      <ProductsSection />
      <MethodologySection />
      <IndustriesSection />
      <DiagnosticoSection />
      <CasosSection />
      <CTASection />
      <Footer />
    </>
  );
}
