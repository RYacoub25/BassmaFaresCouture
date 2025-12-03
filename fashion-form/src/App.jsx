import { useState } from "react";
import logo from "../public/logo.png";
import { CarouselDemo } from "./Carousel";
export default function App() {

  const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

  function toFormData(data) {
    const fd = new FormData();
    // helpful metadata for the email you’ll receive
    fd.append("_subject", "New Appointment Request — Website");
    fd.append("_replyto", data.email || "");

    // flatten your form object (arrays -> comma list)
    Object.entries(data).forEach(([key, value]) => {
      const v = Array.isArray(value) ? value.join(", ") : String(value ?? "");
      fd.append(key, v);
    });

    return fd;
  }

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    occasion: "wedding",       // wedding | engagement
    occasionOther: "",
    role: "guest",             // guest | bride | bridesmaid | mother
    roleOther: "",
    date: "",
    consentWhatsApp: true,
    notes: "",
  });

  const ROLES = [
    { value: "guest", label: "Guest" },
    { value: "bride", label: "Bride" },
    { value: "bridesmaid", label: "Bridesmaid" },
    { value: "mother", label: "Mother of Bride/Groom" },
    { value: "other", label: "Other" },
  ];

  const [status, setStatus] = useState({ type: "idle", message: "" });

  const isEmailValid = (e) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(e);
  const isDateInFuture = (d) => {
    if (!d) return false;
    const today = new Date();
    const date = new Date(d);
    // set to midnight for fair compare
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };
  const weeksUntil = (d) => {
    if (!d) return 0;
    const now = new Date();
    const then = new Date(d + "T00:00:00");
    const ms = then - now;
    return ms / (1000 * 60 * 60 * 24 * 7);
  };

  const requiredWeeks = form.occasion === "wedding" && form.role === "bride" ? 12 : 5;
  const requiresRush = form.date ? weeksUntil(form.date) < requiredWeeks : false;
  const confirmMsg = requiresRush
    ? `Thanks! We received your request. Note: Your date is under our required lead time (${requiredWeeks >= 12 ? "~3 months" : "5 weeks"}). Our team will contact you about rush availability and applicable fees. A confirmation will be sent to your email and WhatsApp.`
    : "Thanks! We received your request. We'll email and WhatsApp you a confirmation shortly.";

  const isValid =
    form.fullName.trim().length >= 2 &&
    isEmailValid(form.email) &&
    /^\+?\d[\d\s-]{6,}$/.test(form.phone || "") &&
    form.date;

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleStyle = (tag) => {
    setForm((f) => {
      const has = f.styles.includes(tag);
      return { ...f, styles: has ? f.styles.filter((t) => t !== tag) : [...f.styles, tag] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setStatus({ type: "error", message: "Please complete the required fields." });
      return;
    }

    if (!FORMSPREE_ENDPOINT) {
      setStatus({ type: "error", message: "Email endpoint missing. Set VITE_FORMSPREE_ENDPOINT in .env.local" });
      return;
    }

    setStatus({ type: "loading", message: "Sending your request…" });

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: toFormData(form),
      });

      if (!res.ok) throw new Error(`Formspree error ${res.status}`);

      setStatus({
        type: "success",
        message: confirmMsg,
      });

      // Optional: reset the form after success
      // setForm({ fullName: "", email: "", phone: "", service: "", date: "", time: "", location: "studio", styles: [], budget: 50, notes: "", referral: "" });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Couldn’t send right now. Please try again or contact us on WhatsApp.",
      });
    }
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-br #f7f3f4 text-black flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* subtle background orbs */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-yellow-600" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-neutral-700" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl rounded-2xl border border-black/10 bg-black/5 backdrop-blur-xl shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 sm:p-4 border-b border-black/10">
          <div className="flex flex-col gap-2">
            <img src={logo} alt="Bassma Fares Couture" className="w-80 self-center" />
            <h1 className="text-3xl font-semibold tracking-tight">Bassma Fares Couture</h1>
            <p className="text-black/80 text-sm leading-relaxed">
              A couture house devoted to creating one-of-a-kind designs that reflect
              feminine grace and distinctive allure. Every creation is crafted with precision and artistry, offering a truly luxurious expression of individuality.
            </p>
            {/* <div className="flex self-center">
              <CarouselDemo />
            </div> */}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-5 overflow-hidden">
          <div className="w-full">
            <Label htmlFor="fullName" required>Full Name</Label>
            <Input id="fullName" placeholder="e.g., Lina Kamal"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)} />
          </div>

          <div className="w-full">
            <Label htmlFor="email" required>Email</Label>
            <Input id="email" type="email" placeholder="name@email.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)} />
            {!form.email ? null : (
              <p className={`mt-1 text-xs ${isEmailValid(form.email) ? "text-emerald-400" : "text-rose-400"}`}>
                {isEmailValid(form.email) ? "Looks good" : "Enter a valid email"}
              </p>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="phone" required>Mobile Number (WhatsApp)</Label>
            <Input id="phone" type="tel" placeholder="+20 1X XXX XXXX"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)} />
          </div>

          <div className="w-full">
            <Label htmlFor="occasion" required>Occasion</Label>
            <Select id="occasion" value={form.occasion} onChange={(e) => update("occasion", e.target.value)}>
              <option value="wedding">Wedding</option>
              <option value="engagement">Engagement</option>
              <option value="other">Other</option>
            </Select>
            {form.occasion === "other" && (
              <div className="mt-3">
                <Label htmlFor="occasionOther" required>Please specify</Label>
                <Input
                  id="occasionOther"
                  placeholder="e.g., Henna, Katb Ketab, Reception, Photoshoot…"
                  value={form.occasionOther}
                  onChange={(e) => update("occasionOther", e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="role" required>Your Role</Label>
            <Select id="role" value={form.role} onChange={(e) => update("role", e.target.value)}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>

              ))}
            </Select>
            {form.role === "other" && (
              <div className="mt-3">
                <Label htmlFor="roleOther" required>Please specify</Label>
                <Input
                  id="roleOther"
                  placeholder="e.g., Graduate, Maid of Honor..."
                  value={form.roleOther}
                  onChange={(e) => update("roleOther", e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="date" required>Date of Occasion</Label>
            <Input id="date" type="date" value={form.date}
              onChange={(e) => update("date", e.target.value)} />
            {form.date && (
              <p className={`mt-2 text-xs ${requiresRush ? "text-amber-500" : "text-black/60"}`}>
                {requiresRush
                  ? `We usually require ${requiredWeeks >= 12 ? "3+ months" : "5+ weeks"} We'll contact you about rush availability and fees.`
                  : "Great! Your date meets our lead time."}
              </p>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="notes">Notes / Inspirations (optional)</Label>
            <Textarea id="notes" rows={4}
              placeholder="Tell us about colors, silhouettes, references, budget, etc."
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)} />
          </div>

          {/* <div className="sm:col-span-2 flex items-center gap-2">
            <input id="consent" type="checkbox" checked={form.consentWhatsApp}
              onChange={(e) => update("consentWhatsApp", e.target.checked)}
              className="h-4 w-4 accent-fuchsia-400" />
            <label htmlFor="consent" className="text-sm text-black/80">
              I agree to receive confirmation via WhatsApp and email.
            </label>
          </div> */}
        </div>


        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-black/10 flex flex-col  items-center gap-3 sm:gap-4">
          {status.type !== "idle" && (
            <p
              role="status"
              className={`text-sm flex-1 ${status.type === "success" ? "text-emerald-600" : status.type === "error" ? "text-rose-300" : "text-black/80"
                }`}
            >
              {status.message}
            </p>
          )}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-medium transition flex self-center
            ${isValid
                ? "bg-green-800 text-white hover:translate-y-[-1px] active:translate-y-0"
                : "bg-gray-200 text-gray-900 cursor-not-allowed"
              }`}
          >
            Request Appointment
          </button>
        </div>
      </form>
    </div>
  );
}

/* --- Tiny UI primitives built with Tailwind --- */
function Label({ children, htmlFor, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm mb-2 text-black/80">
      {children} {required && <span className="text-rose-300">*</span>}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full max-w-full rounded-xl bg-black/5 border border-black/15 focus:border-black/40 focus:outline-none px-4 py-3 placeholder-black/30 shadow-inner ${props.className || ""
        }`}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl bg-black/5 border border-black/15 focus:border-black/40 focus:outline-none px-4 py-3 placeholder-black/30 shadow-inner ${props.className || ""
        }`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl bg-black/5 border border-black/15 focus:border-black/40 focus:outline-none px-4 py-3 shadow-inner text-black ${props.className || ""
        }`}
    />
  );
}
