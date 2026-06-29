import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems, whatsappUrl } from "@/lib/dynamik";

const PublicNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-xl">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-4">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
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
          <Button asChild className="hidden rounded-full bg-white text-slate-950 hover:bg-white/90 sm:inline-flex">
            <Link to="/auth">Se connecter</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950 xl:hidden"
            aria-label="Ouvrir le menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="container mx-auto px-4 pb-4 xl:hidden">
          <nav className="grid gap-2 rounded-[1.5rem] border border-white/10 bg-slate-900 p-3 shadow-2xl">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-white text-slate-950"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={whatsappUrl("Bonjour DYNAMIK TRANSFERT, je souhaite échanger avec vous.")}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950"
            >
              WhatsApp immédiat
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNav;
