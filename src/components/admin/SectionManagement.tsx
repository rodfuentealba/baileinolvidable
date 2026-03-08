import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Save, Clock, Globe } from "lucide-react";
import { defaultTranslations } from "@/hooks/useLanguage";

interface SectionContent {
  id: string;
  section_key: string;
  content: Record<string, string>;
  updated_at: string;
  updated_by: string | null;
}

const SECTIONS = [
  { key: "description", label: "Descripción", fields: ["title", "subtitle", "text"] },
  { key: "counter", label: "Contador", fields: ["months", "weeks", "days"] },
  { key: "location", label: "Ubicación", fields: ["title", "subtitle"] },
  { key: "dresscode", label: "Dresscode", fields: ["title", "nature_title", "nature_text", "outdoor_title", "outdoor_text", "current", "forecast"] },
];

// Maps section_key + field to a translation key in defaultTranslations
const sectionFieldToTranslationKey: Record<string, Record<string, string>> = {
  description: { title: "desc.title", subtitle: "desc.subtitle", text: "desc.text" },
  counter: { months: "counter.months", weeks: "counter.weeks", days: "counter.days" },
  location: { title: "location.title", subtitle: "location.subtitle" },
  dresscode: {
    title: "dresscode.title", nature_title: "dresscode.nature.title", nature_text: "dresscode.nature.text",
    outdoor_title: "dresscode.outdoor.title", outdoor_text: "dresscode.outdoor.text",
    current: "dresscode.current", forecast: "dresscode.forecast",
  },
};

const fieldLabels: Record<string, string> = {
  title: "Título",
  subtitle: "Subtítulo",
  text: "Texto",
  months: "Meses",
  weeks: "Semanas",
  days: "Días",
  nature_title: "Título Naturaleza",
  nature_text: "Texto Naturaleza",
  outdoor_title: "Título Aire Libre",
  outdoor_text: "Texto Aire Libre",
  current: "Temperatura Actual (label)",
  forecast: "Temperatura Pronosticada (label)",
};

type EditLang = "es" | "it";

const SectionManagement = ({ userId }: { userId: string }) => {
  const [sections, setSections] = useState<SectionContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<typeof SECTIONS[0] | null>(null);
  const [formEs, setFormEs] = useState<Record<string, string>>({});
  const [formIt, setFormIt] = useState<Record<string, string>>({});
  const [editLang, setEditLang] = useState<EditLang>("es");
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  const fetchSections = async () => {
    const { data } = await supabase.from("site_content").select("*");
    if (data) {
      setSections(data as SectionContent[]);
      const userIds = [...new Set(data.filter(d => d.updated_by).map(d => d.updated_by))];
      if (userIds.length > 0) {
        const { data: profileData } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
        if (profileData) {
          const map: Record<string, string> = {};
          profileData.forEach((p: any) => { map[p.id] = p.full_name || p.email || "Desconocido"; });
          setProfiles(map);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchSections(); }, []);

  const openEdit = (section: typeof SECTIONS[0]) => {
    setEditingSection(section);
    const existing = sections.find(s => s.section_key === section.key);
    const content = existing?.content as Record<string, any> || {};

    const esValues: Record<string, string> = {};
    const itValues: Record<string, string> = {};
    const translationMap = sectionFieldToTranslationKey[section.key] || {};

    section.fields.forEach(f => {
      const val = content[f];
      const translationKey = translationMap[f];
      const defaultVal = translationKey ? defaultTranslations[translationKey] : null;

      if (typeof val === "object" && val !== null) {
        esValues[f] = val.es || "";
        itValues[f] = val.it || "";
      } else if (val) {
        esValues[f] = val;
        itValues[f] = "";
      } else {
        // Pre-fill with defaults from the website
        esValues[f] = defaultVal?.es || "";
        itValues[f] = defaultVal?.it || "";
      }
    });
    setFormEs(esValues);
    setFormIt(itValues);
    setEditLang("es");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingSection) return;
    setSaving(true);

    const content: Record<string, { es: string; it: string }> = {};
    editingSection.fields.forEach(f => {
      content[f] = { es: formEs[f] || "", it: formIt[f] || "" };
    });

    const existing = sections.find(s => s.section_key === editingSection.key);

    if (existing) {
      const { error } = await supabase.from("site_content").update({ content: content as any, updated_by: userId }).eq("id", existing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Sección actualizada" });
    } else {
      const { error } = await supabase.from("site_content").insert([{ section_key: editingSection.key, content: content as any, updated_by: userId }]);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Sección guardada" });
    }

    setSaving(false);
    setDialogOpen(false);
    fetchSections();
  };

  const currentForm = editLang === "es" ? formEs : formIt;
  const setCurrentForm = editLang === "es" ? setFormEs : setFormIt;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <p className="text-muted-foreground font-body text-sm">
          Edita los textos en Español e Italiano. Los cambios se sincronizan automáticamente.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-12">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {SECTIONS.map((section) => {
            const existing = sections.find(s => s.section_key === section.key);
            const updatedBy = existing?.updated_by ? profiles[existing.updated_by] : null;

            return (
              <div key={section.key} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                <div>
                  <h3 className="font-body font-semibold text-foreground">{section.label}</h3>
                  {existing && (
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-body">
                        {new Date(existing.updated_at).toLocaleDateString("es")}
                        {updatedBy && ` · ${updatedBy}`}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => openEdit(section)} className="gap-2">
                  <Pencil className="w-4 h-4" />
                  Editar
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-body">Editar {editingSection?.label}</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-2">
            <Button variant={editLang === "es" ? "default" : "outline"} size="sm" onClick={() => setEditLang("es")} className="gap-1.5 font-body">🇨🇱 Español</Button>
            <Button variant={editLang === "it" ? "default" : "outline"} size="sm" onClick={() => setEditLang("it")} className="gap-1.5 font-body">🇮🇹 Italiano</Button>
          </div>

          <div className="space-y-4">
            {editingSection?.fields.map((field) => (
              <div key={field}>
                <label className="text-sm font-body text-muted-foreground mb-1 block">
                  {fieldLabels[field] || field}
                </label>
                {field === "text" || field.endsWith("_text") ? (
                  <Textarea
                    value={currentForm[field] || ""}
                    onChange={(e) => setCurrentForm({ ...currentForm, [field]: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={currentForm[field] || ""}
                    onChange={(e) => setCurrentForm({ ...currentForm, [field]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-counter-bg hover:bg-counter-bg/90 text-hero-navy-foreground font-body gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Guardando..." : "Guardar ambos idiomas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionManagement;
