import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import Calculator from "@/components/Calculator";
import AmbassadorsSection from "@/components/AmbassadorsSection";
import AmbassadorSlider from "@/components/AmbassadorSlider";
import WelcomeCode from "@/components/WelcomeCode";
import FAQ from "@/components/FAQ";
import ComplaintForm from "@/components/ComplaintForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Calculator />
      <WelcomeCode />
      <AmbassadorSlider />
      <AmbassadorsSection />
      <AboutSection />
      <FAQ />
      <ComplaintForm />
      <Footer />
    </div>
  );
};

export default Index;
