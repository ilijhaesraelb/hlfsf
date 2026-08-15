export const LOCALES = [
  { code: "en", label: "English", short: "EN" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "es", label: "Español", short: "ES" },
  { code: "am", label: "አማርኛ", short: "AM" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: LocaleCode = "en";

export function parseLocale(value: unknown): LocaleCode {
  const code = typeof value === "string" ? value.toLowerCase() : "";
  const found = LOCALES.find((l) => l.code === code);
  return found ? found.code : DEFAULT_LOCALE;
}

/** Search-param validator shared by every localized route. */
export function validateLocaleSearch(search: Record<string, unknown>): {
  lang?: LocaleCode;
} {
  const raw = search["lang"];
  return typeof raw === "string" ? { lang: parseLocale(raw) } : {};
}

export type PageCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

type PageKey = "home" | "films" | "international" | "contact";

export const COPY: Record<PageKey, Record<LocaleCode, PageCopy>> = {
  home: {
    en: {
      metaTitle:
        "High Light Source Film Studios | International Film Production",
      metaDescription:
        "High Light Source Film Studios develops motion pictures and entertainment experiences for global audiences through international co-production, education and economic development.",
      eyebrow: "The Studio",
      title: "Stories have the power to change the world.",
      subtitle:
        "High Light Source Film Studios develops motion pictures and entertainment experiences designed for global audiences.",
    },
    fr: {
      metaTitle:
        "High Light Source Film Studios | Production cinématographique internationale",
      metaDescription:
        "High Light Source Film Studios développe des longs métrages et des expériences de divertissement pour un public mondial, par la coproduction internationale, la formation et le développement économique.",
      eyebrow: "Le Studio",
      title: "Les histoires ont le pouvoir de changer le monde.",
      subtitle:
        "High Light Source Film Studios développe des longs métrages et des expériences de divertissement conçus pour un public mondial.",
    },
    es: {
      metaTitle:
        "High Light Source Film Studios | Producción cinematográfica internacional",
      metaDescription:
        "High Light Source Film Studios desarrolla largometrajes y experiencias de entretenimiento para audiencias globales mediante coproducción internacional, formación y desarrollo económico.",
      eyebrow: "El Estudio",
      title: "Las historias tienen el poder de cambiar el mundo.",
      subtitle:
        "High Light Source Film Studios desarrolla largometrajes y experiencias de entretenimiento diseñados para audiencias globales.",
    },
    am: {
      metaTitle: "ሃይ ላይት ሶርስ ፊልም ስቱዲዮስ | ዓለም አቀፍ የፊልም ምርት",
      metaDescription:
        "ሃይ ላይት ሶርስ ፊልም ስቱዲዮስ በዓለም አቀፍ የጋራ ምርት፣ በትምህርትና በኢኮኖሚ ልማት አማካኝነት ለዓለም አቀፍ ተመልካቾች ፊልሞችንና የመዝናኛ ተሞክሮዎችን ያዘጋጃል።",
      eyebrow: "ስቱዲዮው",
      title: "ታሪኮች ዓለምን የመቀየር ኃይል አላቸው።",
      subtitle:
        "ሃይ ላይት ሶርስ ፊልም ስቱዲዮስ ለዓለም አቀፍ ተመልካቾች የተዘጋጁ ፊልሞችንና የመዝናኛ ተሞክሮዎችን ያዘጋጃል።",
    },
  },
  films: {
    en: {
      metaTitle: "Films & Slate | High Light Source Film Studios",
      metaDescription:
        "Browse the HLS slate of features, documentaries and series in development, production and release.",
      eyebrow: "Films",
      title: "The HLS Slate",
      subtitle:
        "Features, documentaries and series in development, production and release across our international territories.",
    },
    fr: {
      metaTitle: "Films & Catalogue | High Light Source Film Studios",
      metaDescription:
        "Découvrez le catalogue HLS : longs métrages, documentaires et séries en développement, en production et en sortie.",
      eyebrow: "Films",
      title: "Le catalogue HLS",
      subtitle:
        "Longs métrages, documentaires et séries en développement, en production et en sortie sur nos territoires internationaux.",
    },
    es: {
      metaTitle: "Películas y catálogo | High Light Source Film Studios",
      metaDescription:
        "Explora el catálogo de HLS: largometrajes, documentales y series en desarrollo, producción y estreno.",
      eyebrow: "Películas",
      title: "El catálogo de HLS",
      subtitle:
        "Largometrajes, documentales y series en desarrollo, producción y estreno en nuestros territorios internacionales.",
    },
    am: {
      metaTitle: "ፊልሞችና ዝርዝር | ሃይ ላይት ሶርስ ፊልም ስቱዲዮስ",
      metaDescription:
        "በዝግጅት፣ በምርትና በእይታ ላይ ያሉ የHLS ፊልሞችን፣ ዶክመንተሪዎችንና ተከታታይ ሥራዎችን ይመልከቱ።",
      eyebrow: "ፊልሞች",
      title: "የHLS ዝርዝር",
      subtitle:
        "በዓለም አቀፍ ክልሎቻችን በዝግጅት፣ በምርትና በእይታ ላይ ያሉ ፊልሞች፣ ዶክመንተሪዎችና ተከታታይ ሥራዎች።",
    },
  },
  international: {
    en: {
      metaTitle: "International Co-Production | High Light Source Film Studios",
      metaDescription:
        "HLS partners with film commissions, governments, broadcasters and financiers across every region for international co-production.",
      eyebrow: "International",
      title: "A studio built for co-production",
      subtitle:
        "Regional partnerships, incentives, financing structures and location networks across our global territories.",
    },
    fr: {
      metaTitle: "Coproduction internationale | High Light Source Film Studios",
      metaDescription:
        "HLS collabore avec des commissions du film, des gouvernements, des diffuseurs et des financiers de toutes les régions pour la coproduction internationale.",
      eyebrow: "International",
      title: "Un studio conçu pour la coproduction",
      subtitle:
        "Partenariats régionaux, incitations fiscales, montages financiers et réseaux de décors sur nos territoires mondiaux.",
    },
    es: {
      metaTitle: "Coproducción internacional | High Light Source Film Studios",
      metaDescription:
        "HLS colabora con comisiones fílmicas, gobiernos, emisoras y financiadores de todas las regiones para la coproducción internacional.",
      eyebrow: "Internacional",
      title: "Un estudio creado para la coproducción",
      subtitle:
        "Alianzas regionales, incentivos, estructuras de financiación y redes de localizaciones en nuestros territorios globales.",
    },
    am: {
      metaTitle: "ዓለም አቀፍ የጋራ ምርት | ሃይ ላይት ሶርስ ፊልም ስቱዲዮስ",
      metaDescription:
        "HLS ከፊልም ኮሚሽኖች፣ ከመንግሥታት፣ ከብሮድካስተሮችና ከፋይናንስ አቅራቢዎች ጋር በዓለም አቀፍ የጋራ ምርት ይሠራል።",
      eyebrow: "ዓለም አቀፍ",
      title: "ለጋራ ምርት የተገነባ ስቱዲዮ",
      subtitle:
        "በዓለም አቀፍ ክልሎቻችን ውስጥ ያሉ ክልላዊ ሽርክናዎች፣ ማበረታቻዎች፣ የፋይናንስ አወቃቀሮችና የቦታ አውታሮች።",
    },
  },
  contact: {
    en: {
      metaTitle: "Contact | High Light Source Film Studios",
      metaDescription:
        "Contact High Light Source Film Studios — film commissions, co-producers, investors, broadcasters, distribution, talent, academy and press inquiries.",
      eyebrow: "Contact",
      title: "Start a conversation",
      subtitle: "Route your inquiry to the right HLS team.",
    },
    fr: {
      metaTitle: "Contact | High Light Source Film Studios",
      metaDescription:
        "Contactez High Light Source Film Studios — commissions du film, coproducteurs, investisseurs, diffuseurs, distribution, talents, académie et presse.",
      eyebrow: "Contact",
      title: "Engagez la conversation",
      subtitle: "Orientez votre demande vers la bonne équipe HLS.",
    },
    es: {
      metaTitle: "Contacto | High Light Source Film Studios",
      metaDescription:
        "Contacta con High Light Source Film Studios — comisiones fílmicas, coproductores, inversores, emisoras, distribución, talento, academia y prensa.",
      eyebrow: "Contacto",
      title: "Inicia una conversación",
      subtitle: "Dirige tu consulta al equipo adecuado de HLS.",
    },
    am: {
      metaTitle: "አግኙን | ሃይ ላይት ሶርስ ፊልም ስቱዲዮስ",
      metaDescription:
        "ሃይ ላይት ሶርስ ፊልም ስቱዲዮስን ያግኙ — የፊልም ኮሚሽኖች፣ የጋራ አዘጋጆች፣ ባለሀብቶች፣ ብሮድካስተሮች፣ ስርጭት፣ ተዋንያን፣ አካዳሚና ፕሬስ።",
      eyebrow: "አግኙን",
      title: "ውይይት ይጀምሩ",
      subtitle: "ጥያቄዎን ወደ ትክክለኛው የHLS ቡድን ያድርሱ።",
    },
  },
};

export function pageCopy(page: PageKey, lang: LocaleCode): PageCopy {
  return COPY[page][lang] ?? COPY[page][DEFAULT_LOCALE];
}

/** Localized head() metadata, including hreflang alternates. */
export function localizedHead(
  page: PageKey,
  lang: LocaleCode,
  path: string,
): {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
} {
  const copy = pageCopy(page, lang);
  const url = lang === DEFAULT_LOCALE ? path : `${path}?lang=${lang}`;

  return {
    meta: [
      { title: copy.metaTitle },
      { name: "description", content: copy.metaDescription },
      { property: "og:title", content: copy.metaTitle },
      { property: "og:description", content: copy.metaDescription },
      { property: "og:url", content: url },
      { property: "og:locale", content: lang },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: url },
      ...LOCALES.map((l) => ({
        rel: "alternate",
        hrefLang: l.code,
        href: l.code === DEFAULT_LOCALE ? path : `${path}?lang=${l.code}`,
      })),
      { rel: "alternate", hrefLang: "x-default", href: path },
    ],
  };
}
