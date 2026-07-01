import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";
import AdminCmsManager from "@/components/admin/AdminCmsManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type AccessState = "checking" | "allowed" | "denied";

const AdminCms = () => {
  const [accessState, setAccessState] = useState<AccessState>("checking");

  useEffect(() => {
    let mounted = true;

    const checkAdminAccess = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          if (mounted) setAccessState("denied");
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (mounted) setAccessState(!roleError && roleData ? "allowed" : "denied");
      } catch {
        if (mounted) setAccessState("denied");
      }
    };

    checkAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setAccessState("denied");
      else checkAdminAccess();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (accessState === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-slate-950">
              <Loader2 className="h-5 w-5 animate-spin text-primary" /> Vérification admin
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Contrôle de la session et du rôle administrateur…
          </CardContent>
        </Card>
      </main>
    );
  }

  if (accessState === "denied") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <Card className="w-full max-w-lg border-amber-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Shield className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl text-slate-950">Accès administrateur requis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
            <p>Connectez-vous avec un compte admin DYNAMIK pour modifier les textes, codes partenaires et annonces du site.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild className="bg-slate-950 text-white hover:bg-slate-800">
                <Link to="/auth">Se connecter</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Retour au site</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">DYNAMIK Admin</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">CMS du site public</h1>
          <p className="mt-3 max-w-3xl text-white/65">
            Modifiez les textes, codes partenaires et annonces du site DYNAMIK Transfert. Les modifications enregistrées sont reprises par les pages publiques.
          </p>
        </div>
        <AdminCmsManager />
      </div>
    </main>
  );
};

export default AdminCms;
