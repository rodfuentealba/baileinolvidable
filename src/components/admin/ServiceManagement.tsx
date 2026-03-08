import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface ServiceItem {
  id: string;
  icon: string;
  title: { es: string; it: string };
  text: { es: string; it: string };
  cta: { es: string; it: string };
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "1", icon: "tent",
    title: { es: "Con carpa", it: "Con tenda" },
    text: { es: "Existe la posibilidad de dormir con tu propia carpa en el jardín de Casa Galzi, donde se realizará la fiesta.", it: "C'è la possibilità di dormire con la propria tenda nel giardino di Casa Galzi, dove si terrà la festa." },
    cta: { es: "Avísanos para reservarte un espacio.", it: "Avvisaci per riservare uno spazio." },
  },
  {
    id: "2", icon: "triangle-alert",
    title: { es: "Si no tienes", it: "Se non hai" },
    text: { es: "Avísanos y encontraremos una solución.", it: "Avvisaci e troveremo una soluzione." },
    cta: { es: "", it: "" },
  },
  {
    id: "3", icon: "bath",
    title: { es: "Baño Seco", it: "Bagno Secco" },
    text: { es: "", it: "" },
    cta: { es: "", it: "" },
  },
  {
    id: "4", icon: "shower-head",
    title: { es: "Duchas Exteriores", it: "Docce Esterne" },
    text: { es: "", it: "" },
    cta: { es: "", it: "" },
  },
  {
    id: "5", icon: "home",
    title: { es: "No ingresar al interior de la casa", it: "Non entrare all'interno della casa" },
    text: { es: "", it: "" },
    cta: { es: "", it: "" },
  },
];

type EditLang = "es" | "it";

const ServiceManagement = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ServiceItem | null>(null);
  const [editLang, setEditLang] = useState<EditLang>("es");
  const [form, setForm] = useState({ icon: "", title_es: "", title_it: "", text_es: "", text_it: "", cta_es: "", cta_it: "" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", "services_list")
      .single();

    if (data?.content && Array.isArray(data.content)) {
      setItems(data.content as unknown as ServiceItem[]);
    } else {
      setItems(DEFAULT_SERVICES);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const saveItems = async (newItems: ServiceItem[]) => {
    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("section_key", "services_list")
      .single();

    const content = JSON.parse(JSON.stringify(newItems));

    if (existing) {
      await supabase.from("site_content").update({ content, updated_by: userId }).eq("id", existing.id);
    } else {
      await supabase.from("site_content").insert([{ section_key: "services_list", content, updated_by: userId }]);
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm({ icon: "star", title_es: "", title_it: "", text_es: "", text_it: "", cta_es: "", cta_it: "" });
    setEditLang("es");
    setDialogOpen(true);
  };

  const openEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setForm({
      icon: item.icon,
      title_es: item.title.es,
      title_it: item.title.it,
      text_es: item.text.es,
      text_it: item.text.it,
      cta_es: item.cta.es,
      cta_it: item.cta.it,
    });
    setEditLang("es");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title_es.trim()) {
      toast({ title: "Error", description: "Título (ES) es obligatorio.", variant: "destructive" });
      return;
    }
    setSaving(true);

    const newItem: ServiceItem = {
      id: editingItem?.id || crypto.randomUUID(),
      icon: form.icon,
      title: { es: form.title_es, it: form.title_it },
      text: { es: form.text_es, it: form.text_it },
      cta: { es: form.cta_es, it: form.cta_it },
    };

    let newItems: ServiceItem[];
    if (editingItem) {
      newItems = items.map(i => i.id === editingItem.id ? newItem : i);
    } else {
      newItems = [...items, newItem];
    }

    await saveItems(newItems);
    setItems(newItems);
    setSaving(false);
    setDialogOpen(false);
    toast({ title: editingItem ? "Servicio actualizado" : "Servicio agregado" });
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    const newItems = items.filter(i => i.id !== deletingItem.id);
    await saveItems(newItems);
    setItems(newItems);
    setDeleteDialogOpen(false);
    setDeletingItem(null);
    toast({ title: "Servicio eliminado" });
  };

  const currentLangSuffix = editLang === "es" ? "_es" : "_it";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <p className="text-muted-foreground font-body text-sm">
            Gestiona los servicios. Edita en Español e Italiano.
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
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-counter-bg/10 flex items-center justify-center">
                  <DynamicIcon name={item.icon} className="w-5 h-5 text-counter-bg" />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-foreground">{item.title.es}</h3>
                  <p className="text-xs text-muted-foreground font-body">
                    🇮🇹 {item.title.it || "Sin traducción"}
                    {item.text.es && <span className="ml-2">· {item.text.es.substring(0, 50)}...</span>}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-body">{editingItem ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
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
              <label className="text-sm font-body text-muted-foreground mb-1 block">
                Título ({editLang === "es" ? "Español" : "Italiano"})
              </label>
              <Input
                value={form[`title${currentLangSuffix}` as keyof typeof form]}
                onChange={e => setForm({ ...form, [`title${currentLangSuffix}`]: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">
                Párrafo ({editLang === "es" ? "Español" : "Italiano"})
              </label>
              <Textarea
                value={form[`text${currentLangSuffix}` as keyof typeof form]}
                onChange={e => setForm({ ...form, [`text${currentLangSuffix}`]: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">
                CTA ({editLang === "es" ? "Español" : "Italiano"})
              </label>
              <Input
                value={form[`cta${currentLangSuffix}` as keyof typeof form]}
                onChange={e => setForm({ ...form, [`cta${currentLangSuffix}`]: e.target.value })}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-body">¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              ¿Estás seguro que deseas eliminar "{deletingItem?.title.es}"?
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

export default ServiceManagement;
