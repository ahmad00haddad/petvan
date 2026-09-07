import { useAppStore } from "../../lib/store";
import { copy } from "../../lib/i18n";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getOrderFn } from "../../api/services";
import { MapPin, Star, Clock, Home, ArrowLeft, CheckCircle2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/services/tracking/$orderId")({
  component: Tracking,
});

function Tracking() {
  const { orderId } = Route.useParams();
  const lang = useAppStore((state: any) => state.lang);
  const t = copy[lang as keyof typeof copy];
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [arrived, setArrived] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    getOrderFn({ data: orderId }).then((data) => {
      setOrder(data);
      if (data?.eta) {
        const calculateTimeLeft = () => {
          const diff = new Date(data.eta).getTime() - new Date().getTime();
          if (diff <= 0) {
            setTimeLeft(lang === "ar" ? "وصل" : "Arrived");
            setArrived(true);
          } else {
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${m}m ${s}s`);
          }
        };
        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
      }
      setLoading(false);
    });
  }, [orderId, lang]);

  if (loading && !order)
    return (
      <div className="p-10 text-center min-h-screen flex items-center justify-center">
        {t.loadingTracker}
      </div>
    );
  if (!order)
    return (
      <div className="p-10 text-center min-h-screen flex items-center justify-center">
        {t.orderNotFound}
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl p-5 py-10 sm:p-8 min-h-screen flex flex-col items-center">
      <div className="w-full mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full rounded-[2.5rem] border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground mb-6 shadow-[var(--shadow-gold)]">
          <Clock className="size-8" />
        </span>

        <p className="font-display font-bold text-xl">
          {order.serviceType} {t.bookingConfirmed}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === "ar" ? "طلب رقم #" : "Order #"}
          {order.id.slice(-6).toUpperCase()}
        </p>

        <div className="my-10">
          <p className="text-sm text-muted-foreground mb-2">{t.estimatedArrival}</p>
          <h3 className="font-display text-5xl font-extrabold text-primary tabular-nums tracking-tighter">
            {timeLeft}
          </h3>
        </div>

        <div className="relative mt-8 h-64 overflow-hidden rounded-3xl bg-secondary w-full max-w-xl mx-auto border border-border/50">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:26px_26px]" />

          {/* Route Line */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M 20 80 Q 50 20 80 20"
              fill="none"
              stroke="oklch(0.75 0.18 85 / 0.5)"
              strokeWidth="3"
              strokeDasharray="6,6"
              className="animate-[dash_20s_linear_infinite]"
            />
          </svg>
          <style>{`@keyframes dash { to { stroke-dashoffset: -100; } }`}</style>

          {/* Home marker */}
          <span className="absolute right-[20%] top-[20%] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-card border-2 border-primary text-primary z-10 shadow-lg">
            <Home className="size-5" />
          </span>

          {/* Van marker */}
          <span className="absolute left-[30%] top-[60%] grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-gold)] z-20 animate-bounce">
            <MapPin className="size-6" />
          </span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 rounded-2xl bg-secondary/50 p-6">
          <span className="grid size-14 place-items-center rounded-full bg-primary/20 text-lg font-bold text-primary">
            {order.driverName
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")}
          </span>
          <div className="text-center sm:text-start">
            <p className="text-lg">
              <span className="font-bold">{order.driverName}</span>{" "}
              {arrived
                ? lang === "ar"
                  ? "وصل!"
                  : "has arrived!"
                : lang === "ar"
                  ? "في الطريق!"
                  : "is on the way!"}
            </p>
            <span className="flex items-center justify-center sm:justify-start mt-2 text-primary gap-1">
              {[0, 1, 2, 3].map((i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
              <Star className="size-4 fill-current opacity-50" />
              <span className="text-sm font-bold ml-2 text-foreground">4.8</span>
            </span>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <Dialog.Root open={arrived && !ratingSubmitted} onOpenChange={() => {}}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-[2.5rem] border border-border bg-card p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-300 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/20 text-primary mb-6">
              <CheckCircle2 className="size-8" />
            </span>
            <Dialog.Title className="font-display text-2xl font-bold mb-2">
              Service Completed!
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mb-8">
              {lang === "ar"
                ? `نأمل أن يكون حيوانك قد استمتع بخدمة ${order.serviceType}. يرجى تقييم تجربتك!`
                : `We hope your pet enjoyed the ${order.serviceType} service with ${order.driverName}. Please rate your experience!`}
            </Dialog.Description>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-transform hover:scale-110 focus:outline-none ${star <= rating ? "text-primary" : "text-muted"}`}
                >
                  <Star className="size-10 fill-current" />
                </button>
              ))}
            </div>

            <textarea
              className="w-full h-24 p-4 rounded-2xl bg-secondary border-none resize-none focus:ring-2 focus:ring-primary outline-none mb-6 text-sm placeholder:text-muted-foreground/50"
              placeholder={
                lang === "ar" ? "اترك تعليقاً (اختياري)..." : "Leave a comment (optional)..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button
              disabled={rating === 0}
              onClick={() => {
                setRatingSubmitted(true);
                toast.success(lang === "ar" ? "شكراً على تقييمك!" : "Thank you for your feedback!");
                navigate({ to: "/profile" });
              }}
              className="w-full rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              Submit Rating
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
