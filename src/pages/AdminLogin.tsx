import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import titleDB from "@/assets/titleDB.svg";

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-navy flex items-center justify-center">
        <p className="text-hero-navy-foreground font-body">Cargando...</p>
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-hero-navy flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <img src={titleDB} alt="D&B" className="h-8 mx-auto mb-8 opacity-80" />
          <p className="text-hero-navy-foreground font-body mb-4">
            Tu cuenta no tiene permisos de administrador.
          </p>
          <Button
            variant="outline"
            onClick={async () => {
              const { signOut } = await import("@/hooks/useAuth").then(() => ({ signOut: async () => {
                const { supabase } = await import("@/integrations/supabase/client");
                await supabase.auth.signOut();
                window.location.reload();
              }}));
              signOut();
            }}
            className="border-hero-navy-foreground/30 text-hero-navy-foreground hover:bg-hero-navy-foreground/10"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Cuenta creada", description: "Verifica tu correo electrónico para activar tu cuenta." });
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-hero-navy flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <img src={titleDB} alt="D&B" className="h-8 mx-auto mb-8 opacity-80" />
        <h1 className="font-display text-3xl text-hero-navy-foreground text-center mb-8">
          Panel Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <Input
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-hero-navy-foreground/10 border-hero-navy-foreground/20 text-hero-navy-foreground placeholder:text-hero-navy-foreground/50"
            />
          )}
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-hero-navy-foreground/10 border-hero-navy-foreground/20 text-hero-navy-foreground placeholder:text-hero-navy-foreground/50"
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-hero-navy-foreground/10 border-hero-navy-foreground/20 text-hero-navy-foreground placeholder:text-hero-navy-foreground/50"
          />
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-counter-bg hover:bg-counter-bg/90 text-hero-navy-foreground font-body font-semibold"
          >
            {submitting ? "..." : isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </Button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-4 text-hero-navy-foreground/60 text-sm font-body hover:text-hero-navy-foreground/80 transition-colors"
        >
          {isSignUp ? "¿Ya tienes cuenta? Iniciar sesión" : "¿No tienes cuenta? Registrarse"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
