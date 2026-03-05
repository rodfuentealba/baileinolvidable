import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Save, Clock } from "lucide-react";

interface SectionContent {
  id: string;
  section_key: string;
  content: Record<string, string>;
  updated_at: string;
  updated_by: string | null;
}

const SECTIONS = [
  { key: "description", label: "Descripción", fields: ["title", "subtitle", "text"] },
  { key: "program", label: "Programa", fields: ["title"] },
  { key: "counter", label: "Contador", fields: ["title"] },
  { key: "location", label: "Ubicación", fields: ["title", "subtitle"] },
  { key: "dresscode", label: "Dresscode", fields: ["title"] },
  { key: "services", label: "Servicios", fields: ["title"] },
  { key: "destinations", label: "Destinos", fields: ["title", "cta_text"] },
];

const fieldLabels: Record<string, string> = {
  title: "Título",
  subtitle: "Subtítulo",
  text: "Texto",
  cta_text: "Texto del botón/enlace",
};

const SectionManagement = ({ userId }: { userId: string }) => {
  const [sections, setSections] = useState<SectionContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<typeof SECTIONS[0] | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  const fetchSections = async () => {
    const { data } = await supabase.from("site_content").select("*");
    if (data) {
      setSections(data as SectionContent[]);
      // Fetch profile names for updated_by
      const userIds = [...new Set(data.filter(d => d.updated_by).map(d => d.updated_by))];
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds);
        if (profileData) {
          const map: Record<string, string> = {};
          profileData.forEach((p: any) => {
            map[p.id] = p.full_name || p.email || "Desconocido";
          });
          setProfiles(map);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEdit = (section: typeof SECTIONS[0]) => {
    setEditingSection(section);
    const existing = sections.find(s => s.section_key === section.key);
    const formValues: Record<string, string> = {};
    section.fields.forEach(f => {
      formValues[f] = (existing?.content as Record<string, string>)?.[f] || "";
    });
    setForm(formValues);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingSection) return;
    setSaving(true);

    const existing = sections.find(s => s.section_key === editingSection.key);

    if (existing) {
      const { error } = await supabase
        .from("site_content")
        .update({
          content: form,
          updated_by: userId,
        })
        .eq("id", existing.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sección actualizada" });
      }
    } else {
      const { error } = await supabase.from("site_content").insert({
        section_key: editingSection.key,
        content: form,
        updated_by: userId,
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Sección guardada" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchSections();
  };

  return (
    <div>
      <p className="text-muted-foreground font-body mb-6 text-sm">
        Edita los textos de cada sección del sitio. Los cambios se reflejarán en la página pública.
      </p>

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-12">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {SECTIONS.map((section) => {
            const existing = sections.find(s => s.section_key === section.key);
            const updatedBy = existing?.updated_by ? profiles[existing.updated_by] : null;

            return (
              <div
                key={section.key}
                className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
              >
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

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-body">
              Editar {editingSection?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingSection?.fields.map((field) => (
              <div key={field}>
                <label className="text-sm font-body text-muted-foreground mb-1 block">
                  {fieldLabels[field] || field}
                </label>
                {field === "text" ? (
                  <Textarea
                    value={form[field] || ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={form[field] || ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-counter-bg hover:bg-counter-bg/90 text-hero-navy-foreground font-body gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionManagement;
