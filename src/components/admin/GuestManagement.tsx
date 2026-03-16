import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  country: string;
  food_intolerance: string;
  attendance: string;
  arrival_date: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

interface GuestForm {
  first_name: string;
  last_name: string;
  country: string;
  food_intolerances: string[];
  attendance: string;
  arrival_date: string;
}

const emptyForm: GuestForm = {
  first_name: "",
  last_name: "",
  country: "",
  food_intolerances: [],
  attendance: "pendiente",
  arrival_date: "",
};

const GuestManagement = ({ userId }: { userId: string }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [form, setForm] = useState<GuestForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterAttendance, setFilterAttendance] = useState<string>("all");
  const [existingIntolerances, setExistingIntolerances] = useState<string[]>([]);
  const [newIntolerance, setNewIntolerance] = useState("");

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGuests(data as Guest[]);
      // Extract unique intolerances
      const intolerances = new Set<string>();
      data.forEach((g) => {
        if (g.food_intolerance) {
          g.food_intolerance.split(",").forEach((i: string) => {
            const trimmed = i.trim();
            if (trimmed) intolerances.add(trimmed);
          });
        }
      });
      setExistingIntolerances(Array.from(intolerances).sort());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const openCreate = () => {
    setEditingGuest(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (guest: Guest) => {
    setEditingGuest(guest);
    const intolerances = guest.food_intolerance
      ? guest.food_intolerance.split(",").map((i) => i.trim()).filter(Boolean)
      : [];
    setForm({
      first_name: guest.first_name,
      last_name: guest.last_name,
      country: guest.country,
      food_intolerances: intolerances,
      attendance: guest.attendance,
      arrival_date: guest.arrival_date || "",
    });
    setNewIntolerance("");
    setDialogOpen(true);
  };

  const openDelete = (guest: Guest) => {
    setDeletingGuest(guest);
    setDeleteDialogOpen(true);
  };

  const addIntolerance = (intolerance: string) => {
    const trimmed = intolerance.trim();
    if (trimmed && !form.food_intolerances.includes(trimmed)) {
      setForm({ ...form, food_intolerances: [...form.food_intolerances, trimmed] });
    }
    setNewIntolerance("");
  };

  const removeIntolerance = (intolerance: string) => {
    setForm({
      ...form,
      food_intolerances: form.food_intolerances.filter((i) => i !== intolerance),
    });
  };

  const handleSave = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast({ title: "Error", description: "Nombre y apellido son obligatorios.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      country: form.country.trim(),
      food_intolerance: form.food_intolerances.join(", "),
      attendance: form.attendance,
      arrival_date: form.arrival_date || null,
      updated_by: userId,
    };

    if (editingGuest) {
      const { error } = await supabase
        .from("guests")
        .update(payload)
        .eq("id", editingGuest.id);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Invitado actualizado" });
      }
    } else {
      const { error } = await supabase.from("guests").insert(payload);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Invitado agregado" });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchGuests();
  };

  const handleDelete = async () => {
    if (!deletingGuest) return;

    const { error } = await supabase.from("guests").delete().eq("id", deletingGuest.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Invitado eliminado" });
    }

    setDeleteDialogOpen(false);
    setDeletingGuest(null);
    fetchGuests();
  };

  const filtered = guests.filter((g) => {
    const matchSearch =
      `${g.first_name} ${g.last_name} ${g.country}`.toLowerCase().includes(search.toLowerCase());
    const matchAttendance = filterAttendance === "all" || g.attendance === filterAttendance;
    return matchSearch && matchAttendance;
  });

  const confirmedCount = guests.filter((g) => g.attendance === "confirmado").length;
  const pendingCount = guests.filter((g) => g.attendance === "pendiente").length;

  const INTOLERANCE_COLORS = [
  "bg-red-100 text-red-700",
  "bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700",
  "bg-yellow-100 text-yellow-700",
  "bg-lime-100 text-lime-700",
  "bg-green-100 text-green-700",
  "bg-teal-100 text-teal-700",
  "bg-cyan-100 text-cyan-700",
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-purple-100 text-purple-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-pink-100 text-pink-700",
  "bg-rose-100 text-rose-700",
  "bg-stone-100 text-stone-700",
];

const getIntoleranceColor = (intolerance: string) => {
  let hash = 0;
  for (let i = 0; i < intolerance.length; i++) {
    hash = intolerance.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INTOLERANCE_COLORS[Math.abs(hash) % INTOLERANCE_COLORS.length];
};

const countryToEmoji = (country: string) => {
  const countries: Record<string, string> = {
    "Chile": "🇨🇱",
    "Italia": "🇮🇹",
    "Argentina": "🇦🇷",
    "España": "🇪🇸",
    "Francia": "🇫🇷",
    "Alemania": "🇩🇪",
    "Brasil": "🇧🇷",
    "México": "🇲🇽",
    "Colombia": "🇨🇴",
    "Perú": "🇵🇪",
    "Uruguay": "🇺🇾",
    "Estados Unidos": "🇺🇸",
    "Reino Unido": "🇬🇧",
    "Portugal": "🇵🇹",
    "Japón": "🇯🇵",
    "China": "🇨🇳",
    "Australia": "🇦🇺",
    "Canadá": "🇨🇦",
  };
  return countries[country] || "🌍";
};

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-body">Total</p>
          <p className="text-3xl font-bold font-body text-foreground">{guests.length}</p>
        </div>
        <div className="bg-card rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-body">Confirmados</p>
          <p className="text-3xl font-bold font-body text-status-confirmed">{confirmedCount}</p>
        </div>
        <div className="bg-card rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-body">Pendientes</p>
          <p className="text-3xl font-bold font-body text-status-pending">{pendingCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar invitado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterAttendance} onValueChange={setFilterAttendance}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="confirmado">Confirmados</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openCreate} className="bg-counter-bg hover:bg-counter-bg/90 text-hero-navy-foreground font-body gap-2">
          <Plus className="w-4 h-4" />
          Agregar
        </Button>
      </div>

      {/* Guest list */}
      {loading ? (
        <p className="text-muted-foreground font-body text-center py-12">Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground font-body text-center py-12">No hay invitados.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm font-body">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold hidden md:table-cell">País</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold hidden md:table-cell">Intolerancia</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Estado</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-semibold hidden md:table-cell">Llegada</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-foreground font-medium">
                    {g.first_name} {g.last_name}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {g.country ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-2xl">{countryToEmoji(g.country)}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{g.country}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {g.food_intolerance ? (
                      <div className="flex flex-wrap gap-1">
                        {g.food_intolerance.split(",").map((i) => i.trim()).filter(Boolean).map((intolerance) => (
                          <span
                            key={intolerance}
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getIntoleranceColor(intolerance)}`}
                          >
                            {intolerance}
                          </span>
                        ))}
                      </div>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        g.attendance === "confirmado"
                          ? "bg-status-confirmed/20 text-status-confirmed"
                          : "bg-status-pending/20 text-status-pending"
                      }`}
                    >
                      {g.attendance === "confirmado" ? "Confirmado" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {g.arrival_date || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(g)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDelete(g)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-body">
              {editingGuest ? "Editar Invitado" : "Agregar Invitado"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Nombre *"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
              <Input
                placeholder="Apellido *"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </div>
            <Input
              placeholder="País de Origen"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Intolerancias Alimenticias</p>
              {form.food_intolerances.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.food_intolerances.map((intolerance) => (
                    <Badge
                      key={intolerance}
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-destructive/20"
                      onClick={() => removeIntolerance(intolerance)}
                    >
                      {intolerance}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              )}
              {existingIntolerances.filter((i) => !form.food_intolerances.includes(i)).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {existingIntolerances
                    .filter((i) => !form.food_intolerances.includes(i))
                    .map((intolerance) => (
                      <Badge
                        key={intolerance}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => addIntolerance(intolerance)}
                      >
                        + {intolerance}
                      </Badge>
                    ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva intolerancia..."
                  value={newIntolerance}
                  onChange={(e) => setNewIntolerance(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIntolerance(newIntolerance);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addIntolerance(newIntolerance)}
                  disabled={!newIntolerance.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Select value={form.attendance} onValueChange={(v) => setForm({ ...form, attendance: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="Fecha de Llegada"
              value={form.arrival_date}
              onChange={(e) => setForm({ ...form, arrival_date: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-counter-bg hover:bg-counter-bg/90 text-hero-navy-foreground font-body"
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-body">¿Eliminar invitado?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              ¿Estás seguro que deseas eliminar a {deletingGuest?.first_name} {deletingGuest?.last_name}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground font-body">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GuestManagement;
