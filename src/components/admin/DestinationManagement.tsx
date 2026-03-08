import { useState, useEffect, useRef } from "react";
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
import { Plus, Pencil, Trash2, Save, Globe, Upload, X } from "lucide-react";

interface DestinationItem {
  id: string;
  name: string;
  image_url: string;
  price: string;
  distance: string;
  category: string;
  category_color: string;
  link: string;
  tag: { es: string; it: string };
}

const CATEGORY_COLORS = [
  "hsl(145 60% 42%)", "hsl(200 70% 45%)", "hsl(42 95% 63%)",
  "hsl(280 60% 55%)", "hsl(15 75% 55%)", "hsl(340 65% 50%)",
  "hsl(170 60% 40%)", "hsl(220 70% 50%)",
];

const DEFAULT_DESTINATIONS: DestinationItem[] = [
  {
    id: "1", name: "Venezia",
    image_url: "/src/assets/dest-venezia.jpg",
    price: "30-40 USD", distance: "50 KM",
    category: "🚣 Paseos en góndola", category_color: CATEGORY_COLORS[0],
    link: "https://www.tripadvisor.com/Tourism-g187870-Venice_Veneto-Vacations.html",
    tag: { es: "🚣 Paseos en góndola", it: "🚣 Giri in gondola" },
  },
  {
    id: "2", name: "Napoli",
    image_url: "/src/assets/dest-napoli.jpg",
    price: "30-40 USD", distance: "500 KM",
    category: "⚽ Fútbol & Pizza", category_color: CATEGORY_COLORS[1],
    link: "https://www.tripadvisor.com/Tourism-g187785-Naples_Province_of_Naples_Campania-Vacations.html",
    tag: { es: "⚽ Fútbol & Pizza", it: "⚽ Calcio & Pizza" },
  },
  {
    id: "3", name: "Dolomiti",
    image_url: "/src/assets/dest-dolomiti.jpg",
    price: "20-30 USD", distance: "150 KM",
    category: "🧗 Escalada & Trekking", category_color: CATEGORY_COLORS[2],
    link: "https://www.tripadvisor.com/Tourism-g187849-Dolomites_Trentino_Alto_Adige-Vacations.html",
    tag: { es: "🧗 Escalada & Trekking", it: "🧗 Arrampicata & Trekking" },
  },
  {
    id: "4", name: "Bologna",
    image_url: "/src/assets/dest-bologna.jpg",
    price: "15-25 USD", distance: "120 KM",
    category: "🍝 Gastronomía", category_color: CATEGORY_COLORS[3],
    link: "https://www.tripadvisor.com/Tourism-g187801-Bologna_Province_of_Bologna_Emilia_Romagna-Vacations.html",
    tag: { es: "🍝 Gastronomía", it: "🍝 Gastronomia" },
  },
];

const DestinationManagement = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DestinationItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<DestinationItem | null>(null);
  const [editLang, setEditLang] = useState<"es" | "it">("es");
  const [form, setForm] = useState({
    name: "", image_url: "", price: "", distance: "",
    category: "", category_color: CATEGORY_COLORS[0], link: "",
    tag_es: "", tag_it: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<{ label: string; color: string }[]>([]);
  const [newCategory, setNewCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", "destinations_list")
      .single();

    let loadedItems: DestinationItem[];
    if (data?.content && Array.isArray(data.content)) {
      loadedItems = data.content as unknown as DestinationItem[];
    } else {
      loadedItems = DEFAULT_DESTINATIONS;
    }
    setItems(loadedItems);

    // Extract unique categories
    const cats = loadedItems
      .filter(i => i.category)
      .reduce((acc, i) => {
        if (!acc.find(c => c.label === i.category)) {
          acc.push({ label: i.category, color: i.category_color });
        }
        return acc;
      }, [] as { label: string; color: string }[]);
    setExistingCategories(cats);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const saveItems = async (newItems: DestinationItem[]) => {
    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("section_key", "destinations_list")
      .single();

    const content = JSON.parse(JSON.stringify(newItems));

    if (existing) {
      await supabase.from("site_content").update({ content, updated_by: userId }).eq("id", existing.id);
    } else {
      await supabase.from("site_content").insert([{ section_key: "destinations_list", content, updated_by: userId }]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("destination-images")
      .upload(fileName, file);

    if (error) {
      toast({ title: "Error al subir imagen", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("destination-images")
      .getPublicUrl(fileName);

    setForm({ ...form, image_url: urlData.publicUrl });
    setUploading(false);
    toast({ title: "Imagen subida" });
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm({
      name: "", image_url: "", price: "", distance: "",
      category: "", category_color: CATEGORY_COLORS[0], link: "",
      tag_es: "", tag_it: "",
    });
    setNewCategory(false);
    setEditLang("es");
    setDialogOpen(true);
  };

  const openEdit = (item: DestinationItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      image_url: item.image_url,
      price: item.price,
      distance: item.distance,
      category: item.category,
      category_color: item.category_color,
      link: item.link,
      tag_es: item.tag.es,
      tag_it: item.tag.it,
    });
    setNewCategory(false);
    setEditLang("es");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "El nombre es obligatorio.", variant: "destructive" });
      return;
    }
    setSaving(true);

    const newItem: DestinationItem = {
      id: editingItem?.id || crypto.randomUUID(),
      name: form.name,
      image_url: form.image_url,
      price: form.price,
      distance: form.distance,
      category: form.category,
      category_color: form.category_color,
      link: form.link,
      tag: { es: form.tag_es, it: form.tag_it },
    };

    let newItems: DestinationItem[];
    if (editingItem) {
      newItems = items.map(i => i.id === editingItem.id ? newItem : i);
    } else {
      newItems = [...items, newItem];
    }

    await saveItems(newItems);
    setItems(newItems);
    setSaving(false);
    setDialogOpen(false);
    toast({ title: editingItem ? "Destino actualizado" : "Destino agregado" });
    fetchItems(); // refresh categories
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    const newItems = items.filter(i => i.id !== deletingItem.id);
    await saveItems(newItems);
    setItems(newItems);
    setDeleteDialogOpen(false);
    setDeletingItem(null);
    toast({ title: "Destino eliminado" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <p className="text-muted-foreground font-body text-sm">
            Gestiona los destinos cercanos. Sube fotos y configura categorías.
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
                {item.image_url && (
                  <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-body font-semibold text-foreground">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-body px-2 py-0.5 rounded-full text-hero-navy-foreground" style={{ backgroundColor: item.category_color }}>
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground font-body">{item.distance} · {item.price}</span>
                  </div>
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-body">{editingItem ? "Editar Destino" : "Nuevo Destino"}</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-2">
            <Button variant={editLang === "es" ? "default" : "outline"} size="sm" onClick={() => setEditLang("es")} className="gap-1.5 font-body">🇨🇱 Español</Button>
            <Button variant={editLang === "it" ? "default" : "outline"} size="sm" onClick={() => setEditLang("it")} className="gap-1.5 font-body">🇮🇹 Italiano</Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">Nombre del destino</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Venezia" />
            </div>

            {/* Image upload */}
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">Foto de fondo</label>
              {form.image_url ? (
                <div className="relative rounded-lg overflow-hidden h-32">
                  <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    onClick={() => setForm({ ...form, image_url: "" })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-24 border-dashed gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-5 h-5" />
                  {uploading ? "Subiendo..." : "Subir imagen"}
                </Button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-body text-muted-foreground mb-1 block">Precio estimado</label>
                <Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="30-40 USD" />
              </div>
              <div>
                <label className="text-sm font-body text-muted-foreground mb-1 block">Distancia</label>
                <Input value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} placeholder="50 KM" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">Categoría</label>
              {!newCategory && existingCategories.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {existingCategories.map(cat => (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat.label, category_color: cat.color })}
                        className={`text-xs font-body px-3 py-1.5 rounded-full text-hero-navy-foreground transition-all ${form.category === cat.label ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"}`}
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setNewCategory(true)} className="text-xs">
                    + Nueva categoría
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    placeholder="🍝 Gastronomía"
                  />
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm({ ...form, category_color: color })}
                        className={`w-6 h-6 rounded-full transition-all ${form.category_color === color ? "ring-2 ring-primary ring-offset-2" : ""}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {existingCategories.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setNewCategory(false)} className="text-xs">
                      Usar existente
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">
                Etiqueta ({editLang === "es" ? "Español" : "Italiano"})
              </label>
              <Input
                value={editLang === "es" ? form.tag_es : form.tag_it}
                onChange={e => setForm({ ...form, [editLang === "es" ? "tag_es" : "tag_it"]: e.target.value })}
                placeholder={editLang === "es" ? "🚣 Paseos en góndola" : "🚣 Giri in gondola"}
              />
            </div>

            <div>
              <label className="text-sm font-body text-muted-foreground mb-1 block">Link externo</label>
              <Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
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
            <AlertDialogTitle className="font-body">¿Eliminar destino?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              ¿Estás seguro que deseas eliminar "{deletingItem?.name}"?
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

export default DestinationManagement;
