import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "es" | "it";

interface Translations {
  [key: string]: { es: string; it: string };
}

export const defaultTranslations: Translations = {
  // Description section
  "desc.title": { es: "Fiesta para celebrar nuestra unión", it: "Festa per celebrare la nostra unione" },
  "desc.subtitle": { es: "Casa Galzi en Galzignano Terme", it: "Casa Galzi a Galzignano Terme" },
  "desc.text": { es: "con nuestros amigos que son parte importante de nuestras vidas!", it: "con i nostri amici che sono una parte importante delle nostre vite!" },

  // Program section
  "program.title": { es: "Programa", it: "Programma" },
  "program.01": { es: "Llegada de invitados", it: "Arrivo degli ospiti" },
  "program.02": { es: "Ceremonia", it: "Cerimonia" },
  "program.03": { es: "Aperitivo/Previa", it: "Aperitivo" },
  "program.04": { es: "Cena", it: "Cena" },
  "program.05": { es: "Banda", it: "Banda" },
  "program.06": { es: "DJ Set", it: "DJ Set" },

  // Counter section
  "counter.months": { es: "Meses", it: "Mesi" },
  "counter.weeks": { es: "Semanas", it: "Settimane" },
  "counter.days": { es: "Días", it: "Giorni" },

  // Location section
  "location.subtitle": { es: "La fiesta se realizará en el jardín de", it: "La festa si terrà nel giardino di" },
  "location.title": { es: "Casa Galzi en Galzignano Terme", it: "Casa Galzi a Galzignano Terme" },

  // Dresscode section
  "dresscode.title": { es: "Dresscode", it: "Dresscode" },
  "dresscode.nature.title": { es: "Medio de la naturaleza", it: "In mezzo alla natura" },
  "dresscode.nature.text": { es: "Toda la fiesta será sobre el pasto, por eso recomendamos no usar zapatos con taco o ropa delicada que pueda dañarse.", it: "Tutta la festa sarà sull'erba, per questo raccomandiamo di non indossare scarpe con tacco o abiti delicati che possano rovinarsi." },
  "dresscode.outdoor.title": { es: "Siempre al aire libre", it: "Sempre all'aperto" },
  "dresscode.outdoor.text": { es: "Durante el día hará calor, pero en la noche la temperatura baja, así que recomendamos llevar algo de abrigo por si acaso.", it: "Durante il giorno farà caldo, ma di notte la temperatura scende, quindi raccomandiamo di portare qualcosa di caldo per sicurezza." },
  "dresscode.current": { es: "Temperatura Actual", it: "Temperatura Attuale" },
  "dresscode.forecast": { es: "Temperatura Pronosticada", it: "Temperatura Prevista" },

  // Services section
  "services.title": { es: "Servicios", it: "Servizi" },
  "services.tent.title": { es: "Con carpa", it: "Con tenda" },
  "services.tent.text": { es: "Existe la posibilidad de dormir con tu propia carpa en el jardín de Casa Galzi, donde se realizará la fiesta.", it: "C'è la possibilità di dormire con la propria tenda nel giardino di Casa Galzi, dove si terrà la festa." },
  "services.tent.cta": { es: "Avísanos para reservarte un espacio.", it: "Avvisaci per riservare uno spazio." },
  "services.notent.title": { es: "Si no tienes", it: "Se non hai" },
  "services.notent.text": { es: "Avísanos y encontraremos una solución.", it: "Avvisaci e troveremo una soluzione." },
  "services.bathroom": { es: "Baño Seco", it: "Bagno Secco" },
  "services.showers": { es: "Duchas Exteriores", it: "Docce Esterne" },
  "services.house": { es: "No ingresar al interior de la casa", it: "Non entrare all'interno della casa" },

  // Destinations section
  "dest.title": { es: "Destinos Cercanos", it: "Destinazioni Vicine" },
  "dest.flights": { es: "Vuelos entre", it: "Voli tra" },
  "dest.about": { es: "a unos", it: "a circa" },
  "dest.tips": { es: "Para obtener consejos sobre su viaje a Italia haga clic aquí", it: "Per ottenere consigli sul vostro viaggio in Italia cliccate qui" },
  "dest.cta": { es: "Saber más", it: "Scopri di più" },

  // Footer
  "footer.date": { es: "05 Settembre 2026 · Galzignano Terme, Italia", it: "05 Settembre 2026 · Galzignano Terme, Italia" },

  // Navbar
  "nav.lang": { es: "IT", it: "ES" },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "es",
  setLang: () => {},
  t: (key: string) => key,
  toggleLang: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("es");

  const t = useCallback((key: string) => {
    const entry = defaultTranslations[key];
    if (!entry) return key;
    return entry[lang];
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(prev => prev === "es" ? "it" : "es");
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
