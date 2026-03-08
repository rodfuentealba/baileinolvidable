import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Layout, ListMusic, Wrench, MapPin } from "lucide-react";
import GuestManagement from "@/components/admin/GuestManagement";
import SectionManagement from "@/components/admin/SectionManagement";
import ProgramManagement from "@/components/admin/ProgramManagement";
import ServiceManagement from "@/components/admin/ServiceManagement";
import DestinationManagement from "@/components/admin/DestinationManagement";
import titleDB from "@/assets/titleDB.svg";

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground font-body">Cargando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-hero-navy border-b border-hero-navy-foreground/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={titleDB} alt="Baile Inolvidable" className="h-8" />
            <span className="text-hero-navy-foreground/60 text-sm font-body">Panel Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-hero-navy-foreground/60 text-sm font-body hidden md:block">
              {user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-hero-navy-foreground/60 hover:text-hero-navy-foreground hover:bg-hero-navy-foreground/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="guests" className="w-full">
          <TabsList className="mb-8 bg-muted flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="guests" className="font-body gap-2">
              <Users className="w-4 h-4" />
              Invitados
            </TabsTrigger>
            <TabsTrigger value="sections" className="font-body gap-2">
              <Layout className="w-4 h-4" />
              Secciones
            </TabsTrigger>
            <TabsTrigger value="program" className="font-body gap-2">
              <ListMusic className="w-4 h-4" />
              Programa
            </TabsTrigger>
            <TabsTrigger value="services" className="font-body gap-2">
              <Wrench className="w-4 h-4" />
              Servicios
            </TabsTrigger>
            <TabsTrigger value="destinations" className="font-body gap-2">
              <MapPin className="w-4 h-4" />
              Destinos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guests">
            <GuestManagement userId={user.id} />
          </TabsContent>
          <TabsContent value="sections">
            <SectionManagement userId={user.id} />
          </TabsContent>
          <TabsContent value="program">
            <ProgramManagement userId={user.id} />
          </TabsContent>
          <TabsContent value="services">
            <ServiceManagement userId={user.id} />
          </TabsContent>
          <TabsContent value="destinations">
            <DestinationManagement userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
