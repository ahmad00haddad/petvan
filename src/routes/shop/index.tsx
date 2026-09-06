import { Magnetic } from "../../components/Magnetic";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getProductsFn } from "../../api/shop";
import { useAppStore } from "../../lib/store";
import {
  ShoppingCart,
  Utensils,
  Wrench,
  Gamepad2,
  Plus,
  Loader2,
  Sparkles,
  Flame,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { copy } from "../../lib/i18n";
import { SpotlightCard } from "../../components/SpotlightCard";

export const Route = createFileRoute("/shop/")({
  component: Shop,
});

function Shop() {
  const globalPetType = useAppStore((state) => state.globalPetType);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAppStore((state) => state.addToCart);
  const cart = useAppStore((state) => state.cart);
  const lang = useAppStore((state) => state.lang);
  const t = copy[lang];

  const cats = [
    { id: "food", icon: Utensils, label: lang === "ar" ? "طعام" : "Food" },
    { id: "tools", icon: Wrench, label: lang === "ar" ? "أدوات" : "Tools" },
    { id: "games", icon: Gamepad2, label: lang === "ar" ? "ألعاب" : "Games" },
  ];

  useEffect(() => {
    getProductsFn().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Filter first by category if chosen, otherwise by globalPetType
  const filtered = products.filter((p) => {
    if (filter) return p.category === filter;
    if (globalPetType) return p.targetPet === globalPetType;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl p-5 py-10 sm:p-8 min-h-screen animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            ← {t.home}
          </Link>
          <h1 className="font-display text-4xl font-extrabold text-primary">{t.petShop}</h1>
        </div>
        <Link
          to="/shop/cart"
          className="relative flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
        >
          <ShoppingCart className="size-5" />
          {t.cart}
          {cart.length > 0 && (
            <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {cats.map((c) => (
          <button
            key={c.label}
            onClick={() => setFilter(filter === c.id ? null : c.id)}
            className={`group grid size-24 place-items-center rounded-3xl shadow-[var(--shadow-card)] transition-all hover:-translate-y-2 hover:glow-primary ${filter === c.id ? "bg-primary text-primary-foreground scale-105" : "glass-panel text-foreground border border-border"}`}
          >
            <c.icon
              className={`size-8 transition-colors ${filter === c.id ? "" : "group-hover:text-primary"}`}
            />
            <span
              className={`text-xs font-bold mt-1 transition-colors ${filter === c.id ? "" : "group-hover:text-primary"}`}
            >
              {c.label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="group relative overflow-hidden rounded-3xl glass-panel p-5 flex flex-col h-[320px] shadow-[var(--shadow-card)] ring-1 ring-border"
            >
              <div className="h-40 w-full rounded-2xl bg-secondary animate-pulse mb-4" />
              <div className="h-6 w-3/4 bg-secondary rounded animate-pulse mb-3" />
              <div className="h-3 w-full bg-secondary rounded animate-pulse mb-1" />
              <div className="h-3 w-4/5 bg-secondary rounded animate-pulse flex-grow" />
              <div className="mt-4 flex justify-between items-center">
                <div className="h-6 w-1/3 bg-secondary rounded animate-pulse" />
                <div className="size-10 rounded-full bg-secondary animate-pulse" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="grid size-24 place-items-center rounded-full bg-secondary text-muted-foreground mb-6">
              <ShoppingCart className="size-10 opacity-50" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">{t.noItems}</h3>
            <p className="text-muted-foreground max-w-sm mb-8">{t.noItemsDesc}</p>
            <button
              onClick={() => setFilter(null)}
              className="rounded-full bg-primary/10 text-primary px-6 py-2 text-sm font-bold transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          filtered.map((p, i) => (
            <article
              key={p.id}
              className="group relative h-full overflow-hidden rounded-3xl glass-panel p-5 flex flex-col text-start shadow-[var(--shadow-card)] ring-1 ring-border transition-all hover:-translate-y-2 hover:glow-primary"
            >
              {/* Visual Badges */}
              {i === 0 && (
                <div className="absolute top-4 start-4 z-20 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                  <Flame className="size-3" />
                  {t.bestSeller}
                </div>
              )}
              {i === 2 && (
                <div className="absolute top-4 start-4 z-20 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                  <Sparkles className="size-3" />
                  {t.newArrival}
                </div>
              )}

              <div
                className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-secondary cursor-pointer"
                onClick={() => {
                  setSelectedProduct(p);
                  setQuantity(1);
                }}
              >
                <div className="absolute inset-0 grid place-items-center text-primary/40">
                  <Utensils className="size-10" />
                </div>
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>
              <h3
                className="font-display text-lg font-bold line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => {
                  setSelectedProduct(p);
                  setQuantity(1);
                }}
              >
                {p.name}
              </h3>
              <p className="mt-1 h-8 overflow-hidden text-xs leading-4 text-muted-foreground line-clamp-2">
                {p.description}
              </p>


              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-lg font-bold">{p.price.toFixed(2)} JOD</span>
                <button
                  onClick={() => {
                    setSelectedProduct(p);
                    setQuantity(1);
                  }}
                  className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-110 active:scale-95"
                >
                  <Plus className="size-5" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Product Details Modal */}
      <Dialog.Root
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-[2.5rem] border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <Dialog.Close asChild>
              <button className="absolute right-6 top-6 rounded-full bg-secondary p-2 transition-transform hover:scale-110 text-foreground">
                <X className="size-5" />
              </button>
            </Dialog.Close>

            {selectedProduct && (
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="rounded-3xl bg-secondary overflow-hidden aspect-square flex items-center justify-center p-4 relative max-h-[50vh]">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Utensils className="size-20 text-muted-foreground/30" />
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {selectedProduct.brand || selectedProduct.category}
                    </span>
                  </div>
                  <Dialog.Title className="font-display text-3xl font-bold mb-4 leading-tight">
                    {selectedProduct.name}
                  </Dialog.Title>

                  <div className="text-3xl font-bold text-primary mb-6">
                    {selectedProduct.price.toFixed(2)}{" "}
                    <span className="text-sm text-foreground">JOD</span>
                  </div>

                  <Dialog.Description className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                    {selectedProduct.description}
                  </Dialog.Description>

                  <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                    {selectedProduct.flavor && selectedProduct.flavor !== "N/A" && (
                      <div>
                        <span className="block text-muted-foreground text-xs mb-1">{t.flavor}</span>
                        <span className="font-bold">{selectedProduct.flavor}</span>
                      </div>
                    )}
                    {selectedProduct.ageGroup && (
                      <div>
                        <span className="block text-muted-foreground text-xs mb-1">
                          {t.ageGroup}
                        </span>
                        <span className="font-bold">{selectedProduct.ageGroup}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    <div className="flex items-center bg-secondary rounded-full p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="size-10 rounded-full flex items-center justify-center hover:bg-background transition-colors font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="size-10 rounded-full flex items-center justify-center hover:bg-background transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        addToCart({
                          productId: selectedProduct.id,
                          name: selectedProduct.name,
                          price: selectedProduct.price,
                          quantity: quantity,
                          image: selectedProduct.image,
                        });
                        setSelectedProduct(null);
                        toast.success(
                          lang === "ar"
                            ? `تمت إضافة ${quantity} ${selectedProduct.name} إلى السلة`
                            : `Added ${quantity} ${selectedProduct.name} to cart`,
                        );
                      }}
                      className="flex-1 rounded-full bg-primary py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="size-5" />
                      {t.addToCartText}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
