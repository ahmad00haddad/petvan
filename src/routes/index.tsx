import { RevealOnScroll } from "../components/RevealOnScroll";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAppStore } from "../lib/store";
import { useEffect, useState, useMemo } from "react";
import { getProductsFn } from "../api/shop";
import {
  Stethoscope,
  Home,
  Scissors,
  Utensils,
  Wrench,
  Gamepad2,
  Cat,
  Dog,
  Bird,
  Fish,
  Star,
  Plus,
  MapPin,
  ChevronDown,
  ShoppingCart,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  LogOut,
  Calendar,
  Smartphone,
} from "lucide-react";
import heroDog from "@/assets/hero-dog.jpg";
import petCat from "@/assets/pet-cat.jpg";
import petRabbit from "@/assets/pet-rabbit.jpg";
import petParrot from "@/assets/pet-parrot.jpg";
// Use fish icon if no image
import { copy } from "@/lib/i18n";

const PARTICLES = [
  { top: 24, left: 30, duration: 3.4 },
  { top: 62, left: 22, duration: 4.1 },
  { top: 38, left: 68, duration: 3.8 },
  { top: 74, left: 58, duration: 4.4 },
  { top: 18, left: 52, duration: 3.2 },
  { top: 52, left: 42, duration: 4.8 },
];

function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PetVan — Jordan's First Mobile Vet Clinic" },
      {
        name: "description",
        content:
          "PetVan brings medical care, grooming, boarding, a pet shop and adoption to your door in Amman and Irbid.",
      },
      { property: "og:title", content: "PetVan — Be the hero your pet thinks you are" },
      {
        property: "og:description",
        content:
          "Mobile veterinary care, salon, hotel, shop and adoption — delivered to your door.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const serviceIcons = [Stethoscope, Home, Scissors];

const shopCats = [
  { icon: Utensils, labelEn: "Food", labelAr: "طعام" },
  { icon: Wrench, labelEn: "Tools", labelAr: "أدوات" },
  { icon: Gamepad2, labelEn: "Games", labelAr: "ألعاب" },
];

const prices = ["7.99", "4.99", "19.99", "6.50", "1.75", "14.99"];

const kinds = [
  { icon: Cat, key: "Cats" as const },
  { icon: Dog, key: "Dogs" as const },
  { icon: Bird, key: "Birds" as const },
  { icon: Fish, key: "Fish" as const },
];

const adoptables = [
  { key: "zazo" as const, sex: "♂", img: petCat, type: "Cats" },
  { key: "lely" as const, sex: "♀", img: petRabbit, type: "Dogs" },
  { key: "kiwi" as const, sex: "♂", img: petParrot, type: "Birds" },
  { key: "fully" as const, sex: "♀", img: heroDog, type: "Cats" },
];

const getHeroImage = (petType: string | null) => {
  if (petType === "Cats") return petCat;
  if (petType === "Birds") return petParrot;
  if (petType === "Dogs") return heroDog;
  // Default/Fish
  return heroDog;
};

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="relative inline-block align-top text-gold">
      {displayedText}
      <span className="ms-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-primary align-middle animate-pulse" />
    </span>
  );


}

function Logo() {
  return (
    <a href="#top" className="shrink-0">
      <span className="relative inline-block font-display text-2xl font-extrabold leading-none">
        <span className="absolute inset-x-0 bottom-0.5 h-2.5 bg-primary" aria-hidden />
        <span className="relative">PetVan</span>
      </span>
    </a>
  );
}

function Index() {
  const userId = useAppStore((state) => state.userId);
  const cart = useAppStore((state) => state.cart);
  const lang = useAppStore((state) => state.lang);
  const globalPetType = useAppStore((state) => state.globalPetType);
  const setGlobalPetType = useAppStore((state) => state.setGlobalPetType);
  const t = copy[lang];

  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    getProductsFn().then(setDbProducts);
  }, []);




  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      document.documentElement.style.setProperty("--mouse-x", `${x}px`);
      document.documentElement.style.setProperty("--mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const heroText = useMemo(() => {
    if (globalPetType === "Cats")
      return lang === "ar" ? "أهلاً بك يا عاشق القطط! 🐱" : "Hello, Cat Lover! 🐱";
    if (globalPetType === "Dogs")
      return lang === "ar" ? "مرحباً يا صاحب الكلاب! 🐶" : "Hey, Dog Parent! 🐶";
    if (globalPetType === "Birds") return lang === "ar" ? "تغريد وفرح! 🦜" : "Tweet Tweet! 🦜";
    if (globalPetType === "Fish") return lang === "ar" ? "عالم تحت الماء! 🐟" : "Glub Glub! 🐟";
    return `${t.hello} ${t.friend}`;
  }, [globalPetType]);

  return (
    <div
      id="top"
      dir={t.dir}
      className={`min-h-screen bg-background text-foreground pb-20 ${lang === "ar" ? "font-arabic" : "font-sans"}`}
    >
      {/* Hero */}
      <section className="relative overflow-hidden w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 py-10 px-5 sm:px-12">
        <div
          className="relative order-2 lg:order-1 w-full mt-10 lg:mt-0 py-6 transition-transform duration-300 ease-out flex items-center justify-center"
          style={{
            transform: "translate(calc(var(--mouse-x, 0) * -1), calc(var(--mouse-y, 0) * -1))",
          }}
        >
          <div className="relative w-[260px] sm:w-[380px] lg:w-[440px] aspect-square rounded-full shadow-[0_0_80px_rgba(255,255,255,0.05)] pulsing-glow overflow-hidden border-4 border-foreground/10 group">
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <img
              key={globalPetType || "default"}
              src={getHeroImage(globalPetType)}
              alt="Happy pet"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {PARTICLES.map((particle, i) => (
              <div
                key={i}
                className="absolute size-2 rounded-full bg-primary/40 animate-float"
                style={{
                  top: `${particle.top}%`,
                  insetInlineStart: `${particle.left}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${particle.duration}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="order-1 lg:order-2 lg:ps-16 relative z-10 text-center lg:text-start flex flex-col items-center lg:items-start animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.25] tracking-tight break-words py-2 min-h-[2.6em] sm:min-h-[2.4em] lg:min-h-[2em]">
            <TypewriterText text={heroText} />
          </h1>

          <p className="mt-6 max-w-sm text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t.heroDesc}
          </p>
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <Link
              to={userId ? "/profile" : "/login"}
              className="rounded-full bg-primary px-8 py-2 text-xs sm:text-sm font-bold text-primary-foreground transition-all hover:scale-105 hover:glow-primary uppercase tracking-wider shadow-[0_4px_20px_color-mix(in_oklch,var(--color-primary)_30%,transparent)]"
            >
              {userId ? t.profile : t.login}
            </Link>
            {!userId && (
              <Link
                to="/register"
                className="rounded-full border border-foreground px-8 py-2 text-xs sm:text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-background uppercase tracking-wider"
              >
                {t.register}
              </Link>
            )}
          </div>
          <p className="mt-10 text-xs text-muted-foreground uppercase tracking-wider mb-4">
            {lang === "ar"
              ? "اعثر على حيوان أليف جديد وانقذه قبل أن يضيع أو يُترك وحيداً"
              : "FIND A NEW PET AND RESCUE IT FROM WHEN IT MIGHT BE ALONE OR LOST"}
          </p>
          <Link
            to="/adopt"
            className="rounded-full bg-primary px-8 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:scale-105 hover:glow-primary uppercase tracking-widest shadow-[0_4px_20px_color-mix(in_oklch,var(--color-primary)_30%,transparent)]"
          >
            {t.findAdoptFriend}
          </Link>
        </div>
      </section>

      {/* Services */}
      <RevealOnScroll>
        <section
          id="services"
          className="px-5 py-16 sm:px-8 text-center max-w-4xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <p className="text-sm text-muted-foreground mb-6">{t.chooseKind}</p>
          <div className="flex justify-center gap-6 sm:gap-10">
            {kinds.map((k) => {
              const isActive = globalPetType === k.key;
              return (
                <button
                  key={k.key}
                  onClick={() => setGlobalPetType(isActive ? null : k.key)}
                  className={`grid size-16 sm:size-20 place-items-center rounded-full transition-all hover:scale-105 ${isActive ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] ring-4 ring-primary/20" : "glass-panel border border-border text-foreground hover:border-primary hover:text-primary"}`}
                >
                  <k.icon className="size-8 sm:size-10" strokeWidth={1.5} />
                </button>
              );
            })}
          </div>

          <h2 className="mt-16 font-display text-3xl font-extrabold text-primary">
            {t.askServices}
          </h2>
          <p className="mt-2 text-[10px] tracking-widest text-muted-foreground uppercase">
            {lang === "ar"
              ? "اختر نوع الخدمة التي تحتاجها"
              : "CHOOSE THE KIND OF SERVICES YOU NEED"}
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
            {t.services.map((s, i) => {
              const Icon = serviceIcons[i];
              return (
                <article key={s.title} className="flex flex-col items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(255,193,7,0.3)] transition-transform hover:scale-110">
                    <Icon className="size-8" />
                  </span>
                  <h3 className="mt-6 font-display text-base font-bold">{s.title}</h3>
                  <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground max-w-[200px] text-center">
                    {s.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </RevealOnScroll>

      {/* Shop */}
      <section
        id="shop"
        className="px-5 py-20 sm:px-8 bg-background border-t border-b border-border relative overflow-hidden animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl font-extrabold text-primary">{t.shop}</h2>
          <p className="mt-2 text-[10px] tracking-widest text-muted-foreground uppercase">
            {" "}
            {t.shopSub}{" "}
          </p>

          <div className="mt-14 flex flex-wrap justify-center gap-6 sm:gap-10">
            {shopCats.map((c) => (
              <Link
                key={c.labelEn}
                to="/shop"
                className="group w-28 h-28 glass-panel rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-2 hover:glow-primary shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                <c.icon className="size-8 text-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-bold text-foreground group-hover:text-primary transition-colors">
                  {lang === "ar" ? c.labelAr : c.labelEn}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Adoption */}
      <section
        id="adopt"
        className="px-5 py-24 sm:px-8 text-center max-w-5xl mx-auto animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <p className="text-sm text-muted-foreground mb-8">{t.chooseAdopt}</p>
        <div className="flex justify-center gap-6 sm:gap-10 mb-16">
          {kinds.map((k) => {
            const isActive = globalPetType === k.key;
            return (
              <button
                key={k.key}
                onClick={() => setGlobalPetType(isActive ? null : k.key)}
                className={`transition-all hover:scale-110 ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
              >
                <k.icon className="w-10 h-10 sm:w-14 sm:h-14" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-12">
          {(globalPetType ? adoptables.filter((a) => a.type === globalPetType) : adoptables)
            .concat(adoptables)
            .slice(0, 8)
            .map((a, i) => (
              <figure key={`${a.key}-${i}`} className="group flex flex-col items-center">
                <div className="size-32 sm:size-40 rounded-full border-4 border-foreground/10 overflow-hidden mb-4 transition-all group-hover:scale-105 group-hover:border-primary group-hover:glow-primary">
                  <img
                    src={a.img}
                    alt={a.key}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="font-display font-bold text-lg lowercase flex items-center gap-2">
                  {a.key} <span className="text-foreground text-xl leading-none">{a.sex}</span>
                </figcaption>
              </figure>
            ))}
        </div>

        <Link
          to="/adopt"
          className="mt-16 inline-block rounded-full bg-primary px-10 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105 hover:glow-primary"
        >
          View More
        </Link>
      </section>

      {/* Numbers Speak Section */}
      <section className="px-5 py-24 sm:px-8 relative overflow-hidden bg-primary/5 mt-10">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-0" />
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 text-center relative z-10">
          <div
            className="flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <h3 className="text-5xl lg:text-6xl font-black text-primary font-display mb-2 drop-shadow-[0_0_15px_rgba(255,193,7,0.5)]">
              <AnimatedCounter end={10} suffix="K" />
              <span className="text-3xl">+</span>
            </h3>
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground font-bold">
              {lang === "ar" ? "حيوان تمت خدمته" : "Pets Served"}
            </p>
          </div>
          <div
            className="flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <h3 className="text-5xl lg:text-6xl font-black text-primary font-display mb-2 drop-shadow-[0_0_15px_rgba(255,193,7,0.5)]">
              <AnimatedCounter end={50} />
              <span className="text-3xl">+</span>
            </h3>
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground font-bold">
              {lang === "ar" ? "طبيب بيطري متخصص" : "Expert Vets"}
            </p>
          </div>
          <div
            className="flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <h3 className="text-5xl lg:text-6xl font-black text-primary font-display mb-2 drop-shadow-[0_0_15px_rgba(255,193,7,0.5)]">
              15<span className="text-3xl">+</span>
            </h3>
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground font-bold">
              {lang === "ar" ? "عيادة متنقلة" : "Mobile Caravans"}
            </p>
          </div>
          <div
            className="flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <h3 className="text-5xl lg:text-6xl font-black text-primary font-display mb-2 drop-shadow-[0_0_15px_rgba(255,193,7,0.5)]">
              4.9
            </h3>
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground font-bold">
              {lang === "ar" ? "تقييم العملاء" : "Client Rating"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
