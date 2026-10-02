'use client';

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
  return (
    <>
      <Intro />
      <Cursor />
      <Nav />
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
