import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import Calculator from "@/components/Calculator";
import CryptoPayment from "@/components/CryptoPayment";
import AmbassadorsSection from "@/components/AmbassadorsSection";
import WelcomeCode from "@/components/WelcomeCode";
import FAQ from "@/components/FAQ";
import ComplaintForm from "@/components/ComplaintForm";
import Footer from "@/components/Footer";
import ReferralSection from "@/components/referral/ReferralSection";
import ReferralBanner from "@/components/referral/ReferralBanner";

const Index = () => {
  return (
    <div className="min-h-screen premium-page">
      <ReferralBanner />
      <Header />
      <Calculator />
      <CryptoPayment />
      <ReferralSection />
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
