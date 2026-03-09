import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import titleDB from "@/assets/titleDB.svg";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInitials, setAdminInitials] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });
        const isUserAdmin = !!data;
        setIsAdmin(isUserAdmin);
        
        if (isUserAdmin) {
          // Fetch profile to get full_name
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", session.user.id)
            .single();
          
          if (profileData?.full_name) {
            const initials = profileData.full_name
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase())
              .join("")
              .slice(0, 2);
            setAdminInitials(initials);
          } else {
            setAdminInitials("AD");
          }
        }
      }
    };
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase.rpc("has_role", {
          _user_id: session.user.id,
          _role: "admin",
        });
        const isUserAdmin = !!data;
        setIsAdmin(isUserAdmin);
        
        if (isUserAdmin) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", session.user.id)
            .single();
          
          if (profileData?.full_name) {
            const initials = profileData.full_name
              .split(" ")
              .map((word: string) => word.charAt(0).toUpperCase())
              .join("")
              .slice(0, 2);
            setAdminInitials(initials);
          } else {
            setAdminInitials("AD");
          }
        }
      } else {
        setIsAdmin(false);
        setAdminInitials("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-counter-bg" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between py-4 px-6">
        <div className="w-16">
          {isAdmin && (
            <Link to="/admin/dashboard">
              <Avatar className="h-9 w-9 bg-hero-navy border-2 border-hero-navy-foreground/20 hover:border-hero-navy-foreground/40 transition-colors cursor-pointer">
                <AvatarFallback className="bg-hero-navy text-hero-navy-foreground font-body font-bold text-sm">
                  RF
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
        <img src={titleDB} alt="Damiam & Benedetta" className="h-6 md:h-8" />
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hero-navy-foreground/10 hover:bg-hero-navy-foreground/20 transition-colors text-hero-navy-foreground text-sm font-body font-semibold backdrop-blur-sm"
          title={lang === "es" ? "Cambiar a Italiano" : "Cambia in Spagnolo"}
        >
          <span className="text-base">{lang === "es" ? "🇨🇱" : "🇮🇹"}</span>
          <span>{lang === "es" ? "ES" : "IT"}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
