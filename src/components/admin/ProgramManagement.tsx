import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Save, Globe } from "lucide-react";
import LucideIconPicker from "./LucideIconPicker";
import DynamicIcon from "./DynamicIcon";

interface ProgramItem {
  id: string;
  icon: string;
  time: string;
  title: { es: string; it: string };
}

const DEFAULT_PROGRAMS: ProgramItem[] = [
  { id: "1", icon: "users", time: "16:00", title: { es: "Llegada de invitados", it: "Arrivo degli ospiti" } },
  { id: "2", icon: "church", time: "17:00", title: { es: "Ceremonia", it: "Cerimonia" } },
  { id: "3", icon: "wine", time: "18:00", title: { es: "Aperitivo/Previa", it: "Aperitivo" } },
  { id: "4", icon: "utensils-crossed", time: "19:30", title: { es: "Cena", it: "Cena" } },
  { id: "5", icon: "music", time: "21:00", title: { es: "Banda", it: "Banda" } },
  { id: "6", icon: "disc-3", time: "22:30", title: { es: "DJ Set", it: "DJ Set" } },
];

type EditLang = "es" | "it";

const ProgramManagement = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgramItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ProgramItem | null>(null);
  const [editLang, setEditLang] = useState<EditLang>("es");
  const [form, setForm] = useState({ icon: "", time: "", title_es: "", title_it: "" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", "programs_list")
      .single();

    if (data?.content && Array.isArray(data.content)) {
      setItems(data.content as unknown as ProgramItem[]);
    } else {
      setItems(DEFAULT_PROGRAMS);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const saveItems = async (newItems: ProgramItem[]) => {
    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("section_key", "programs_list")
      .single();

    const content = JSON.parse(JSON.stringify(newItems));

    if (existing) {
      await supabase.from("site_content").update({ content, updated_by: userId }).eq("id", existing.id);
    } else {
      await supabase.from("site_content").insert([{ section_key: "programs_list", content, updated_by: userId }]);
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm({ icon: "star", time: "", title_es: "", title_it: "" });
    setEditLang("es");
    setDialogOpen(true);
  };

  const openEdit = (item: ProgramItem) => {
    setEditingItem(item);
    setForm({
      icon: item.icon,
      time: item.time,
      title_es: item.title.es,
      title_it: item.title.it,
    });
    setEditLang("es");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.time.trim() || !form.title_es.trim()) {
      toast({ title: "Error", description: "Hora y título (ES) son obligatorios.", variant: "destructive" });
      return;
    }
    setSaving(true);

    const newItem: ProgramItem = {
      id: editingItem?.id || crypto.randomUUID(),
      icon: form.icon,
      time: form.time,
      title: { es: form.title_es, it: form.title_it },
    };

    let newItems: ProgramItem[];
    if (editingItem) {
      newItems = items.map(i => i.id === editingItem.id ? newItem : i);
    } else {
      newItems = [...items, newItem];
    }

    await saveItems(newItems);
    setItems(newItems);
    setSaving(false);
    setDialogOpen(false);
    toast({ title: editingItem ? "Programa actualizado" : "Programa agregado" });
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    const newItems = items.filter(i => i.id !== deletingItem.id);
    await saveItems(newItems);
    setItems(newItems);
    setDeleteDialogOpen(false);
    setDeletingItem(null);
    toast({ title: "Programa eliminado" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <p className="text-muted-foreground font-body text-sm">
            Gestiona los items del programa. Edita en Español e Italiano.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-counter-bg hover:bg-counter-bg/90 text-hero-navy-foreground font-body gap-2">
          <Plus className="w-4 h-4" />
          Crear nuevo
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body text-center py-12">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-program-card/10 flex items-center justify-center">
                  <DynamicIcon name={item.icon} className="w-5 h-5 text-counter-bg" />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-foreground">
                    {item.time} — {item.title.es}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body">
                    🇮🇹 {item.title.it || "Sin traducción"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setDeletingItem(item); setDeleteDialogOpen(true); }} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-body">
              {editingItem ? "Editar Programa" : "Nuevo Programa"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-2">
            <Button variant={editLang === "es" ? "default" : "outline"} size="sm" onClick={() => setEditLang("es")} className="gap-1.5 font-body">🇨🇱 Español</Button>
            <Button variant={editLang === "it" ? "default" : "outline"} size="sm" onClick={() => setEditLang("it")} className="gap-1.5 font-body">🇮🇹 Italiano</Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">Icono</label>
              <LucideIconPicker value={form.icon} onChange={icon => setForm({ ...form, icon })} />
            </div>
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">Hora</label>
              <Input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="16:00" />
            </div>
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">
                Título ({editLang === "es" ? "Español" : "Italiano"})
              </label>
              <Input
                value={editLang === "es" ? form.title_es : form.title_it}
                onChange={e => setForm({ ...form, [editLang === "es" ? "title_es" : "title_it"]: e.target.value })}
                placeholder={editLang === "es" ? "Título en español" : "Titolo in italiano"}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-counter-bg hover:bg-counter-bg/90 text-hero-navy-foreground font-body gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-body">¿Eliminar programa?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              ¿Estás seguro que deseas eliminar "{deletingItem?.title.es}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground font-body">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProgramManagement;
