import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/crypto", label: "Crypto → FCFA" },
  { to: "/parrainage", label: "Parrainage" },
  { to: "/ambassadeurs", label: "Ambassadeurs" },
  { to: "/offre", label: "Offres" },
  { to: "/a-propos", label: "À propos" },
  { to: "/faq", label: "FAQ" },
  { to: "/reclamations", label: "Réclamations" },
];

const PublicNav = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">D</span>
          <span className="text-sm font-semibold tracking-[0.26em]">DYNAMIK</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-white/90">
            <Link to="/auth">Se connecter</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PublicNav;
