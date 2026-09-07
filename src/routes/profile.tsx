import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppStore } from "../lib/store";
import { getUserFn } from "../api/auth";
import { getMyPetsFn, deletePetFn, addPetFn } from "../api/pets";
import { getMyOrdersFn } from "../api/orders";
import { listForAdoptionFn } from "../api/adopt";
import {
  LogOut,
  Plus,
  PawPrint,
  Package,
  Calendar,
  Trash2,
  Star,
  Loader2,
  Heart,
} from "lucide-react";
import { copy } from "../lib/i18n";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const userId = useAppStore((state) => state.userId);
  const setUserId = useAppStore((state) => state.setUserId);
  const navigate = useNavigate();

  const lang = useAppStore((state) => state.lang);
  const t = copy[lang];

  // Micro-interaction: Time of Day Greeting
  const hour = new Date().getHours();
  const greetingEn = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const greetingAr = hour < 12 ? "صباح الخير" : "مساء الخير";
  const greeting = lang === "ar" ? greetingAr : greetingEn;

  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingPetId, setListingPetId] = useState<string | null>(null);
  const [adoptDescription, setAdoptDescription] = useState("");
  const [listingLoading, setListingLoading] = useState(false);

  const [addPetModalOpen, setAddPetModalOpen] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("Cat");
  const [newPetGender, setNewPetGender] = useState("M");
  const [addingPet, setAddingPet] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate({ to: "/login" });
      return;
    }

    Promise.all([
      getUserFn({ data: userId }),
      getMyPetsFn({ data: userId }),
      getMyOrdersFn({ data: userId }),
    ])
      .then(([u, p, o]) => {
        if (!u) {
          toast.error(
            lang === "ar"
              ? "انتهت الجلسة. الرجاء تسجيل الدخول مجدداً."
              : "Session expired. Please log in again.",
          );
          setUserId(null); // Clear invalid ID
          navigate({ to: "/login" });
          return;
        }

        setUser(u);
        setPets(p);
        setOrders(o);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile load error:", err);
        toast.error(
          lang === "ar"
            ? "فشل تحميل الملف الشخصي. الرجاء تسجيل الدخول مجدداً."
            : "Failed to load profile. Please log in again.",
        );
        setUserId(null);
        navigate({ to: "/login" });
        setLoading(false);
      });
  }, [userId, navigate, setUserId, lang]);

  const handleDeletePet = async (petId: string) => {
    try {
      await deletePetFn({ data: { userId: userId!, petId } });
      setPets(pets.filter((p) => p.id !== petId));
      toast.success(lang === "ar" ? "تم حذف الحيوان بنجاح" : "Pet removed successfully");
    } catch {
      toast.error(lang === "ar" ? "فشل حذف الحيوان" : "Failed to remove pet");
    }
  };

  const handleListForAdoption = async () => {
    if (!listingPetId) return;
    setListingLoading(true);
    try {
      await listForAdoptionFn({
        data: { userId: userId!, petId: listingPetId, description: adoptDescription },
      });
      toast.success(
        lang === "ar" ? "تم نشر الحيوان للتبني بنجاح!" : "Pet successfully listed for adoption!",
      );
      setListingPetId(null);
      setAdoptDescription("");
    } catch {
      toast.error(lang === "ar" ? "فشل نشر الحيوان للتبني" : "Failed to list pet for adoption");
    } finally {
      setListingLoading(false);
    }
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName || !userId) return;
    setAddingPet(true);
    try {
      const newPet = await addPetFn({
        data: { userId, name: newPetName, type: newPetType, gender: newPetGender },
      });
      setPets([...pets, newPet]);
      toast.success(lang === "ar" ? "تمت إضافة الحيوان بنجاح!" : "Pet added successfully!");
      setAddPetModalOpen(false);
      setNewPetName("");
      setNewPetType("Cat");
      setNewPetGender("M");
    } catch {
      toast.error(lang === "ar" ? "فشل إضافة الحيوان" : "Failed to add pet");
    } finally {
      setAddingPet(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-primary">
        <Loader2 className="size-10 animate-spin" />
        <p className="font-bold animate-pulse">Loading profile...</p>
      </div>
    );
  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl p-5 py-10 sm:p-12 min-h-screen text-center">
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <div className="size-40 rounded-full border-4 border-foreground/20 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-500 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_color-mix(in_oklch,var(--color-primary)_40%,transparent)]">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
            alt="User Avatar"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-1 text-primary">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} className="size-5 fill-current" />
          ))}
          <Star className="size-5" />
        </div>

        <p className="mt-3 text-xs text-muted-foreground uppercase tracking-widest">{t.customer}</p>
        <div className="flex items-center justify-center gap-3 mt-1">
          <h1 className="font-display text-2xl font-bold">{user.name}</h1>
          <button
            onClick={() => setUserId(null)}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Settings / Logout"
          >
            <LogOut className="size-5" />
          </button>
        </div>

        <button
          onClick={() => setAddPetModalOpen(true)}
          className="mt-6 inline-block rounded-full bg-primary px-8 py-2 text-xs font-bold text-primary-foreground transition-all hover:scale-105 hover:glow-primary uppercase tracking-wider shadow-[var(--shadow-gold)]"
        >
          {t.addPet}
        </button>
      </div>

      {/* Stats Bar */}
      <div
        className="mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="rounded-3xl glass-panel p-4 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
          <PawPrint className="size-6 text-primary mb-2" />
          <p className="text-2xl font-black font-display">{pets.length}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
            {t.petsCount}
          </p>
        </div>
        <div className="rounded-3xl glass-panel p-4 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
          <Package className="size-6 text-primary mb-2" />
          <p className="text-2xl font-black font-display">{orders.length}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
            {t.ordersCount}
          </p>
        </div>
        <div className="rounded-3xl glass-panel p-4 flex flex-col items-center justify-center transition-transform hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <Star className="size-6 text-primary mb-2 fill-primary" />
          <p className="text-2xl font-black font-display text-glow">350</p>
          <p className="text-[10px] sm:text-xs text-primary uppercase tracking-widest mt-1 font-bold">
            {t.pointsCount}
          </p>
        </div>
      </div>

      {/* Pets */}
      <div className="mt-16 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <h2 className="text-muted-foreground font-display mb-8 text-sm flex justify-center items-center gap-2">
          {" "}
          {t.yourFamily} <PawPrint className="size-4" />
        </h2>
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
          {pets.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t.noPets}</p>
          ) : (
            pets.map((pet) => (
              <div key={pet.id} className="group flex flex-col items-center">
                <Link
                  to="/pets/$petId"
                  params={{ petId: String(pet.id) }}
                  className="flex flex-col items-center"
                >
                  <div className="size-28 sm:size-32 rounded-full border-4 border-foreground/20 overflow-hidden mb-4 transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-[0_0_20px_color-mix(in_oklch,var(--color-primary)_40%,transparent)] relative">
                    {pet.image ? (
                      <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary text-4xl">
                        <PawPrint />
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-bold uppercase tracking-widest">{pet.name}</h3>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setListingPetId(pet.id);
                  }}
                  className="mt-3 flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors border border-border px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  <Heart className="size-3" />
                  Adopt
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog.Root open={!!listingPetId} onOpenChange={(open) => !open && setListingPetId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-[2.5rem] border border-border bg-card p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-300 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/20 text-primary mb-6">
              <Heart className="size-8" />
            </span>
            <Dialog.Title className="font-display text-2xl font-bold mb-2">
              List for Adoption
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-6">
              {t.listAdoptionDesc}
            </Dialog.Description>

            <textarea
              className="w-full h-24 p-4 rounded-2xl bg-secondary border border-border resize-none focus:ring-2 focus:ring-primary outline-none mb-6 text-sm placeholder:text-muted-foreground/50"
              placeholder={
                lang === "ar"
                  ? "مثال: ودود جداً ويحب اللعب..."
                  : "e.g. Very friendly and loves to play..."
              }
              value={adoptDescription}
              onChange={(e) => setAdoptDescription(e.target.value)}
            ></textarea>

            <div className="flex w-full gap-3">
              <Dialog.Close asChild>
                <button className="flex-1 rounded-full border border-border px-4 py-3 text-sm font-bold transition-colors hover:bg-secondary">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleListForAdoption}
                disabled={!adoptDescription || listingLoading}
                className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
              >
                {listingLoading ? t.listing : t.confirmListing}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add Pet Modal */}
      <Dialog.Root open={addPetModalOpen} onOpenChange={setAddPetModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-[2.5rem] border border-border bg-card p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-300 text-start">
            <h1 className="font-display text-3xl font-extrabold text-primary text-glow mb-2">
              {t.addNewPet}
            </h1>
            <p className="text-sm text-muted-foreground mb-8">{t.addNewPetDesc}</p>

            <form onSubmit={handleAddPet} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                    {t.petName}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    className="w-full h-11 rounded-md border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder={lang === "ar" ? "مثال: بيلا" : "e.g. Bella"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                      {t.petType}
                    </label>
                    <select
                      value={newPetType}
                      onChange={(e) => setNewPetType(e.target.value)}
                      className="w-full h-11 rounded-md border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="Cats">{t.catsWord}</option>
                      <option value="Dogs">{t.dogsWord}</option>
                      <option value="Birds">{t.birdsWord}</option>
                      <option value="Fish">{t.fishWord}</option>
                      <option value="Other">{t.otherWord}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                      {t.gender}
                    </label>
                    <select
                      value={newPetGender}
                      onChange={(e) => setNewPetGender(e.target.value)}
                      className="w-full h-11 rounded-md border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="M">{t.male}</option>
                      <option value="F">{t.female}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex w-full gap-3 mt-8">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex-1 rounded-full border border-border px-4 py-3 text-sm font-bold transition-colors hover:bg-secondary"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={addingPet || !newPetName}
                  className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                >
                  {addingPet ? t.adding : t.addNewPet}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <hr className="my-16 border-border max-w-xl mx-auto" />

      {/* Photo Section */}
      <div>
        <h2 className="text-muted-foreground font-display mb-8 text-sm flex justify-center items-center gap-2">
          {" "}
          {t.photo} <Plus className="size-4" />
        </h2>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto">
          {[
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
            "https://images.unsplash.com/photo-1573865526739-10659fec78a5",
            "https://images.unsplash.com/photo-1614989647360-1e523f380fa0",
            "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8",
            "https://images.unsplash.com/photo-1552053831-71594a27632d",
            "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
          ].map((src, i) => (
            <div key={i} className="aspect-square bg-secondary overflow-hidden">
              <img
                src={`${src}?w=400&h=400&fit=crop`}
                alt={`Pet photo ${i}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        <button className="mt-12 rounded-full bg-primary px-10 py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-105 uppercase tracking-widest">
          View More
        </button>
      </div>
    </div>
  );
}
