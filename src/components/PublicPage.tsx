import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";
import ReferralBanner from "@/components/referral/ReferralBanner";

type PublicPageProps = {
  children: React.ReactNode;
};

const PublicPage = ({ children }: PublicPageProps) => {
  return (
    <div className="min-h-screen premium-page">
      <ReferralBanner />
      <PublicNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PublicPage;
