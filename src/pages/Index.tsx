import Header from "@/components/Header";
import FlagsBanner from "@/components/FlagsBanner";
import AboutSection from "@/components/AboutSection";
import Calculator from "@/components/Calculator";
import AmbassadorsSection from "@/components/AmbassadorsSection";
import PromoCarousel from "@/components/PromoCarousel";
import FAQ from "@/components/FAQ";
import ComplaintForm from "@/components/ComplaintForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <FlagsBanner />
      <Calculator />
      <AmbassadorsSection />
      <PromoCarousel />
      <AboutSection />
      <FAQ />
      <ComplaintForm />
      <Footer />
    </div>
  );
};

export default Index;
