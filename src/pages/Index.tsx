import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import Calculator from "@/components/Calculator";
import AmbassadorsSection from "@/components/AmbassadorsSection";
import WelcomeCode from "@/components/WelcomeCode";
import FAQ from "@/components/FAQ";
import ComplaintForm from "@/components/ComplaintForm";
import Footer from "@/components/Footer";
import FestiveDecorations from "@/components/FestiveDecorations";

const Index = () => {
  return (
    <div className="min-h-screen">
      <FestiveDecorations />
      <Header />
      <Calculator />
      <AmbassadorsSection />
      <WelcomeCode />
      <AboutSection />
      <FAQ />
      <ComplaintForm />
      <Footer />
    </div>
  );
};

export default Index;
