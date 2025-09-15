import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "",
    subject: "",
    description: "",
    transferReference: ""
  });

  const complaintTypes = [
    { value: "transfer-delay", label: "Retard de transfert" },
    { value: "wrong-amount", label: "Montant incorrect" },
    { value: "fees-issue", label: "Problème de frais" },
    { value: "customer-service", label: "Service client" },
    { value: "technical-issue", label: "Problème technique" },
    { value: "other", label: "Autre" }
  ];

  const sanitizeInput = (input: string) => {
    return input.trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '')
      .substring(0, 500); // Limit length
  };

  const sendToWhatsApp = () => {
    // Sanitize all form inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      phone: sanitizeInput(formData.phone),
      email: sanitizeInput(formData.email),
      type: sanitizeInput(formData.type),
      subject: sanitizeInput(formData.subject),
      description: sanitizeInput(formData.description),
      transferReference: sanitizeInput(formData.transferReference)
    };

    const message = `🔴 RÉCLAMATION - DYNAMIK TRANSFERT

👤 Nom: ${sanitizedData.name}
📞 Téléphone: ${sanitizedData.phone}
📧 Email: ${sanitizedData.email}
🏷️ Type: ${complaintTypes.find(t => t.value === sanitizedData.type)?.label || sanitizedData.type}
📄 Sujet: ${sanitizedData.subject}
🔢 Référence transfert: ${sanitizedData.transferReference || "Non spécifiée"}

📝 DESCRIPTION:
${sanitizedData.description}

⏰ Date de réclamation: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}

---
Merci de traiter cette réclamation dans les plus brefs délais.`;

    const finalMessage = `Bonjour DYNAMIK TRANSFERT, ${message}`;
    const encodedMessage = encodeURIComponent(finalMessage);
    window.open(`https://wa.me/22899771419?text=${encodedMessage}`, '_blank');
  };

  const isFormValid = formData.name && formData.phone && formData.type && formData.subject && formData.description;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Plaintes et Réclamations
            </h2>
            <p className="text-muted-foreground text-lg">
              Un problème avec votre transfert ? Nous sommes là pour vous aider.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Formulaire de réclamation
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire et votre réclamation sera automatiquement transmise à notre équipe via WhatsApp.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+228 XX XX XX XX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de réclamation *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type de problème" />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transferReference">Référence du transfert</Label>
                <Input
                  id="transferReference"
                  value={formData.transferReference}
                  onChange={(e) => setFormData({ ...formData, transferReference: e.target.value })}
                  placeholder="Numéro de référence si disponible"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet de la réclamation *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Résumé du problème"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre problème en détail..."
                  rows={5}
                />
              </div>

              <Button
                onClick={sendToWhatsApp}
                disabled={!isFormValid}
                className="w-full"
                size="lg"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Envoyer la réclamation via WhatsApp
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>* Champs obligatoires</p>
                <p className="mt-2">
                  Votre réclamation sera transmise directement à notre équipe qui vous répondra dans les plus brefs délais.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ComplaintForm;