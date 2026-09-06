import { Magnetic } from "../components/Magnetic";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAppStore } from "../lib/store";
import { copy } from "../lib/i18n";
import { loginUserFn } from "../api/auth";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import heroDog from "@/assets/hero-dog.jpg";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const lang = useAppStore((state: any) => state.lang) as keyof typeof copy;
  const t = copy[lang];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setUserId = useAppStore((state) => state.setUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUserFn({ data: { email, password } });
      setUserId(user.id);
      navigate({ to: "/profile" });
    } catch (err: any) {
      setError(err.message || (lang === "ar" ? "فشل تسجيل الدخول" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl min-h-[calc(100vh-6rem)] lg:h-[min(calc(100vh-8rem),820px)] lg:min-h-[620px] items-stretch gap-0 overflow-hidden rounded-none bg-background px-0 py-0 lg:my-10 lg:rounded-[2rem] lg:border lg:border-border animate-fade-in-up">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-secondary flex-col justify-between p-10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <img
          src={heroDog}
          alt="Happy Dog"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-20">
          <Link to="/" className="font-display text-3xl font-extrabold tracking-tight">
            <span className="text-foreground">Pet</span>
            <span className="text-primary">Van</span>
          </Link>
        </div>
        <div className="relative z-20 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-5xl font-black mb-4 text-glow">{t.welcomeBack}</h2>
          <p className="text-muted-foreground max-w-md text-lg">{t.welcomeBackDesc}</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-8 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 lg:left-auto lg:right-6 flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold transition-transform hover:-translate-x-1"
        >
          <ArrowLeft className="size-5" />
          {t.goBackHome}
        </Link>

        <div className="w-full max-w-md space-y-8 rounded-3xl border border-border glass-panel p-8 shadow-[var(--shadow-card)]">
          <div className="text-center lg:text-start">
            <h2 className="font-display text-3xl font-extrabold text-primary text-glow">
              {t.signIn}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.welcomeBackDesc}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  {t.emailAddress}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 backdrop-blur px-4 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all hover:bg-background/80 mt-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <div className="relative">
                <label className="text-sm font-medium leading-none" htmlFor="password">
                  {t.password}
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-background/50 backdrop-blur px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all hover:bg-background/80 mt-2"
                />
              </div>
            </div>

            <Magnetic className="w-full">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-gold)] transition-all hover:scale-105 hover:glow-primary disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? t.signingIn : t.signIn}
              </button>
            </Magnetic>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {lang === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link to="/register" className="font-bold text-primary hover:underline">
              {t.signUp}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
