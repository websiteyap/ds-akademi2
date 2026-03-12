import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import HeroSection from '@/components/HeroSection';
import HeroSlider from '@/components/HeroSlider';
import Instructors from '@/components/Instructors';
import AboutSection from '@/components/AboutSection';
import BlogSection from '@/components/BlogSection';
import FAQSection from '@/components/FAQSection';

export default function Home() {
  return (
    <main>
      <Navbar />
      <FilterBar />
      <HeroSection />
      
      {/* İkinci Hero (Slider olan) */}
      <HeroSlider />
      
      <AboutSection />
      <Instructors />
      <BlogSection />
      <FAQSection />
    </main>
  );
}
