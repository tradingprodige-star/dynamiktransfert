import PublicPage from "@/components/PublicPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DYNAMIK_CONTACTS, whatsappUrl } from "@/lib/dynamik";
import { ExternalLink, FileText, MessageCircle, ShieldCheck } from "lucide-react";

const files = [
  {
    title: "Termes et conditions — Français",
    description: "Document officiel en français.",
    url: DYNAMIK_CONTACTS.termsFr,
  },
  {
    title: "Terms and Conditions — English",
    description: "Official English version.",
    url: DYNAMIK_CONTACTS.termsEn,
  },
];

const Terms = () => (
  <PublicPage>
    <section className="bg-slate-950 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
            <FileText className="h-4 w-4 text-primary" />
            Termes et fichiers
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Documents DYNAMIK Transfert.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
            Retrouvez les liens des conditions d’utilisation, fichiers et contacts officiels. Pour toute question, l’équipe répond directement sur WhatsApp.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {files.map((file) => (
            <Card key={file.title} className="overflow-hidden shadow-card transition hover:-translate-y-1 hover:shadow-financial">
              <CardContent className="p-7">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-slate-950">
                  <FileText className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-semibold">{file.title}</h2>
                <p className="mt-3 text-muted-foreground">{file.description}</p>
                <Button asChild className="mt-6 rounded-full bg-slate-950 text-white hover:bg-slate-800">
                  <a href={file.url} target="_blank" rel="noreferrer">
                    Ouvrir le fichier <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border bg-card p-7 shadow-card">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-digital">
                <ShieldCheck className="h-4 w-4" /> Contact officiel
              </div>
              <h2 className="text-3xl font-semibold">Besoin d’une confirmation ?</h2>
              <p className="mt-3 text-muted-foreground">
                Les liens, adresses USDT, réseaux et montants à payer sont confirmés avant paiement par WhatsApp.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600">
              <a href={whatsappUrl("Bonjour DYNAMIK TRANSFERT, je souhaite une confirmation concernant les termes, fichiers ou un paiement.")} target="_blank" rel="noreferrer">
                <MessageCircle className="h-5 w-5" /> WhatsApp immédiat
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </PublicPage>
);

export default Terms;
