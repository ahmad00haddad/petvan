import { copy } from "../../lib/i18n";
import { ScrambleText } from "../../components/ScrambleText";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdoptionsFn } from "../../api/adopt";
import { useAppStore } from "../../lib/store";
import { ArrowLeft, Heart, Cat, Dog, Bird, Fish, Loader2 } from "lucide-react";

export const Route = createFileRoute("/adopt/")({
  component: Adopt,
});

const kinds = [
  { icon: Cat, key: "Cat" },
  { icon: Dog, key: "Dog" },
  { icon: Bird, key: "Bird" },
  { icon: Fish, key: "Fish" },
];

function Adopt() {
  const globalPetType = useAppStore((state) => state.globalPetType);
  const lang = useAppStore((state) => state.lang);
  const t = copy[lang];
  const setGlobalPetType = useAppStore((state) => state.setGlobalPetType);
  const [listings, setListings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [heartAnim, setHeartAnim] = useState<string | null>(null);

  const handleDoubleTap = (id: string) => {
    setHeartAnim(id);
    setTimeout(() => setHeartAnim(null), 1000);
  };

  useEffect(() => {
    getAdoptionsFn().then((data) => {
      setListings(data);
      setLoading(false);
    });
  }, []);

  const activeFilter = filter || globalPetType;
  const filtered = activeFilter ? listings.filter((l) => l.pet.type === activeFilter) : listings;

  return (
    <div className="mx-auto max-w-5xl p-5 py-10 sm:p-8 min-h-screen animate-fade-in-up">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="size-4" />
        {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
      </Link>

      <div className="text-center mb-12">
        <h1 className="font-display text-5xl font-extrabold text-primary mb-4">
          {lang === "ar" ? "ابحث عن صديق" : "Find a Friend"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {lang === "ar"
            ? "افتح منزلك وقلبك لحيوان يحتاج إليك. تصفح لوحة التبني في مجتمعنا لتجد رفيقك الجديد."
            : "Open your home and your heart to a pet in need. Browse our community's adoption board to find your new best friend."}
        </p>

        <div className="mt-8 flex justify-center gap-6">
          {kinds.map((k) => {
            const isActive = activeFilter === k.key;
            return (
              <button
                key={k.key}
                onClick={() => {
                  setFilter(isActive ? null : k.key);
                  setGlobalPetType(isActive ? null : k.key); // also update global context
                }}
                className={`group flex flex-col items-center gap-3 transition-colors ${isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"}`}
              >
                <span
                  className={`grid size-16 place-items-center rounded-full transition-all ${isActive ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)] ring-4 ring-primary/20 glow-primary" : "glass-panel border border-border shadow-[var(--shadow-card)] group-hover:border-primary group-hover:glow-primary group-hover:scale-105"}`}
                >
                  <k.icon className="size-8" />
                </span>
                <span className="text-xs font-bold">
                  {lang === "ar"
                    ? k.key === "Cat"
                      ? "قطط"
                      : k.key === "Dog"
                        ? "كلاب"
                        : k.key === "Bird"
                          ? "طيور"
                          : "أسماك"
                    : k.key === "Fish"
                      ? "Fish"
                      : `${k.key}s`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-3xl border border-border glass-panel overflow-hidden shadow-[var(--shadow-card)] flex flex-col h-[400px]"
            >
              <div className="aspect-[4/3] bg-secondary animate-pulse" />
              <div className="p-6 flex flex-col flex-grow">
                <div className="h-8 w-2/3 bg-secondary rounded animate-pulse mb-2" />
                <div className="h-4 w-1/3 bg-secondary rounded animate-pulse mb-4" />
                <div className="h-4 w-full bg-secondary rounded animate-pulse mb-2" />
                <div className="h-4 w-5/6 bg-secondary rounded animate-pulse mb-6 flex-grow" />
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-secondary animate-pulse" />
                    <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-20 bg-secondary rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center shadow-[var(--shadow-card)]">
          <Heart className="size-16 mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="text-3xl font-display font-bold mb-3 text-glow">
            {lang === "ar" ? "لا توجد حيوانات متاحة حالياً" : "No pets available right now"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {lang === "ar"
              ? "تحقق لاحقاً من قوائم التبني الجديدة. مجتمعنا ينمو باستمرار!"
              : "Check back later for new adoption listings. Our community is always growing!"}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl glass-panel p-16 text-center shadow-[var(--shadow-card)] ring-1 ring-border mt-8 flex flex-col items-center">
          <div className="grid size-24 place-items-center rounded-full bg-secondary text-primary mb-6 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            <Heart className="size-10 relative z-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-3">
            {lang === "ar" ? `لا توجد نتائج لـ ${filter}` : `No ${filter}s found`}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            {lang === "ar"
              ? "لم نجد حيوانات تبحث عن منزل في هذه الفئة الآن. ربما رفيقك المثالي ينتظرك في فئة أخرى!"
              : `We couldn't find any ${filter}s looking for a home right now. But don't worry, your perfect match might be waiting in another category!`}
          </p>
          <button
            onClick={() => {
              setFilter(null);
              setGlobalPetType(null);
            }}
            className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105"
          >
            {t.showAllPets}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((listing) => (
            <figure
              key={listing.id}
              className="group flex h-full flex-col rounded-3xl border border-border glass-panel overflow-hidden shadow-[var(--shadow-card)] transition-all hover:-translate-y-2 hover:glow-primary"
            >
              <div
                className="relative h-56 w-full shrink-0 overflow-hidden bg-secondary cursor-pointer"
                onDoubleClick={() => handleDoubleTap(listing.id)}
              >

                {heartAnim === listing.id && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <Heart className="size-24 text-red-500 fill-red-500 animate-[ping_1s_ease-out_forwards]" />
                  </div>
                )}
                {listing.pet.image ? (
                  <img
                    src={listing.pet.image}
                    alt={listing.pet.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {listing.pet.type === "Cat"
                      ? "🐱"
                      : listing.pet.type === "Dog"
                        ? "🐶"
                        : listing.pet.type === "Bird"
                          ? "🦜"
                          : "🐟"}
                  </div>
                )}
                <div className="absolute top-4 end-4 bg-background/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold">
                  {listing.pet.gender === "M"
                    ? lang === "ar"
                      ? "♂ ذكر"
                      : "♂ Male"
                    : lang === "ar"
                      ? "♀ أنثى"
                      : "♀ Female"}
                </div>
              </div>
              <figcaption className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-bold mb-1">{listing.pet.name}</h3>
                <p className="text-sm font-medium text-primary mb-4">{listing.pet.type}</p>
                <p className="mb-6 h-[3.75rem] overflow-hidden text-sm leading-5 text-muted-foreground line-clamp-3">
                  {listing.description}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">

                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                      {listing.lister.name.charAt(0)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {lang === "ar"
                        ? `نشره: ${listing.lister.name}`
                        : `Listed by ${listing.lister.name}`}
                    </span>
                  </div>
                  <a
                    href={`mailto:${listing.lister.email}?subject=Regarding adopting ${listing.pet.name}`}
                    className="rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {lang === "ar" ? "تواصل" : "Contact"}
                  </a>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
