import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import Calculator from "@/components/Calculator";
import AmbassadorsSection from "@/components/AmbassadorsSection";
import WelcomeCode from "@/components/WelcomeCode";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <AboutSection />
      <Calculator />
      <AmbassadorsSection />
      <WelcomeCode />
      <Footer />
    </div>
  );
};

export default Index;
