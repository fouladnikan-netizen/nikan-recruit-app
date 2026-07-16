"use client";

import React, { useEffect, useRef, useState } from "react";

type FormData = {
  fullname: string;
  phone: string;
  area: string;
  age: string;
  education: string;
  field: string;
  excel_skill: string;
  ai_skill: string;
  motivation: string;
  expectations: string;
};

const initialFormData: FormData = {
  fullname: "",
  phone: "",
  area: "",
  age: "",
  education: "",
  field: "",
  excel_skill: "5.0",
  ai_skill: "5.0",
  motivation: "",
  expectations: "",
};

function validateForm(data: FormData): string | null {
  if (!data.fullname.trim()) return "نام و نام خانوادگی را وارد کنید.";
  if (!/^09\d{9}$/.test(data.phone)) {
    return "شماره تماس باید ۱۱ رقم و با 09 شروع شود.";
  }
  if (!data.area.trim()) return "منطقه سکونت را وارد کنید.";
  const age = Number(data.age);
  if (!data.age || Number.isNaN(age) || age < 18 || age > 60) {
    return "سن باید بین ۱۸ تا ۶۰ باشد.";
  }
  if (!data.education) return "مدرک تحصیلی را انتخاب کنید.";
  if (!data.field.trim()) return "رشته تحصیلی را وارد کنید.";
  if (!data.excel_skill) return "سطح مهارت اکسل را انتخاب کنید.";
  if (!data.ai_skill) return "سطح مهارت هوش مصنوعی را انتخاب کنید.";
  if (!data.motivation.trim()) return "انگیزه خود را بنویسید.";
  if (!data.expectations.trim()) return "انتظارات خود را بنویسید.";
  return null;
}

function RadioOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-right transition-colors touch-manipulation ${
        selected
          ? "border-red-500 bg-red-50/50 ring-1 ring-red-500"
          : "border-slate-200 bg-white"
      }`}
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-red-600" : "border-slate-400"
        }`}
      >
        {selected && <div className="h-2 w-2 rounded-full bg-red-600" />}
      </div>
      <span className="text-sm">{label}</span>
    </button>
  );
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: {
    resultIndex: number;
    results: {
      length: number;
      [index: number]: {
        isFinal: boolean;
        [index: number]: { transcript: string };
      };
    };
  }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function createSpeechRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const SpeechRecognitionCtor =
    (
      window as Window & {
        SpeechRecognition?: new () => SpeechRecognitionLike;
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      }
    ).SpeechRecognition ||
    (
      window as Window & {
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      }
    ).webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) return null;
  return new SpeechRecognitionCtor();
}

function SpeechMicButton({
  fieldId,
  activeFieldId,
  onActivate,
  value,
  onUpdate,
}: {
  fieldId: string;
  activeFieldId: string | null;
  onActivate: (id: string | null) => void;
  value: string;
  onUpdate: (next: string) => void;
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef(value);

  useEffect(() => {
    setSupported(Boolean(createSpeechRecognition()));
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (activeFieldId !== fieldId && listening) {
      recognitionRef.current?.abort();
      setListening(false);
    }
  }, [activeFieldId, fieldId, listening]);

  if (!supported) return null;

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    if (activeFieldId === fieldId) onActivate(null);
  };

  const startListening = () => {
    const recognition = createSpeechRecognition();
    if (!recognition) return;

    onActivate(fieldId);
    recognitionRef.current?.abort();
    recognitionRef.current = recognition;
    baseTextRef.current = value.trim();

    recognition.lang = "fa-IR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) {
          finalChunk += transcript;
        } else {
          interim += transcript;
        }
      }

      if (finalChunk) {
        const nextBase = `${baseTextRef.current} ${finalChunk}`.trim();
        baseTextRef.current = nextBase;
        onUpdate(nextBase);
      } else if (interim) {
        onUpdate(`${baseTextRef.current} ${interim}`.trim());
      }
    };

    recognition.onerror = () => {
      setListening(false);
      onActivate(null);
    };

    recognition.onend = () => {
      setListening(false);
      onActivate(null);
    };

    try {
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
      onActivate(null);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {listening && (
        <span className="text-[10px] font-bold text-red-600 animate-pulse">
          درحال شنیدن...
        </span>
      )}
      <button
        type="button"
        onClick={() => (listening ? stopListening() : startListening())}
        aria-label={listening ? "توقف ضبط صدا" : "شروع تبدیل گفتار به متن"}
        className={`flex h-10 w-10 items-center justify-center rounded-full border text-base transition-all touch-manipulation ${
          listening
            ? "border-red-500 bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.2)] animate-pulse"
            : "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        🎙️
      </button>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<"landing" | "form" | "success">("landing");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [interviewSlot, setInterviewSlot] = useState("");
  const [mood, setMood] = useState("");
  const [reverseQuestion, setReverseQuestion] = useState("");
  const [voiceSelected, setVoiceSelected] = useState(false);
  const [activeMicField, setActiveMicField] = useState<string | null>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه"];
    const times = ["۱۴:۰۰", "۱۵:۳۰", "۱۶:۱۵", "۱۷:۰۰"];
    const randomDay = days[Math.floor(Math.random() * days.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    setInterviewSlot(`${randomDay} آینده، ساعت ${randomTime}`);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError("");
  };

  const handleRadioChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const validationError = validateForm(formData);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);

    const finalExpectations = `
انتظارات: ${formData.expectations}

---
مود کاربر: ${mood || "انتخاب نشده"}
سوال از ما: ${reverseQuestion || "نداشت"}
${voiceSelected ? "وویس: فایل صدا انتخاب شد (آپلود نشده)" : ""}
`.trim();

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expectations: finalExpectations,
        }),
      });

      if (response.ok) {
        setView("success");
        return;
      }

      const errorData = await response.json().catch(() => null);
      setSubmitError(errorData?.message || "خطایی رخ داد.");
    } catch {
      setSubmitError("خطا در ارتباط با سرور.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex min-h-dvh justify-center bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-slate-200 via-gray-100 to-slate-300 text-slate-900 sm:p-6"
      style={{ fontFamily: "Vazirmatn, sans-serif" }}
    >
      <div className="flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-white/70 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:h-[850px] sm:rounded-[2.5rem] sm:border-[8px] sm:border-slate-900">
        {view !== "success" && (
          <header className="z-40 flex shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/90 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {logoError ? (
                  <span className="text-xl font-bold text-slate-900">N</span>
                ) : (
                  <img
                    src="/nikan2.jpg"
                    alt="Nikan"
                    className="h-full w-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-black tracking-tight text-slate-900">
                  پترو فولاد نیکان
                </span>
                <span className="mt-0.5 text-[10px] font-bold text-slate-500">
                  اکوسیستم نوین بازرگانی
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-400">
                {view === "landing" ? "مرحله ۱ از ۲" : "مرحله ۲ از ۲"}
              </span>
              {view === "form" && (
                <button
                  type="button"
                  onClick={() => setView("landing")}
                  className="rounded-lg border border-slate-200 bg-white/50 px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-800"
                >
                  بازگشت
                </button>
              )}
            </div>
          </header>
        )}

        {view === "landing" && (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain pb-4">
              <div className="px-4 pt-4">
                <img
                  src="/dsc_6502.jpg"
                  alt="تیم شرکت"
                  className="mb-4 h-48 w-full rounded-2xl object-cover shadow-sm"
                />
              </div>
              <div className="px-6 pb-6 pt-2 bg-white/80 backdrop-blur-sm">
                <div className="mb-4 inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                  فرصت شغلی جدید
                </div>
                <h1 className="mb-4 text-2xl font-bold leading-snug text-slate-900">
                  فرصت شروع یک مسیر حرفه‌ای در صنعت فولاد
                </h1>
                <div className="mt-6 space-y-4 text-justify text-sm leading-relaxed text-slate-700">
                  <p className="text-base font-bold text-slate-900">
                    سلام و خوش آمدید 🌱
                  </p>
                  <p>
                    از اینکه برای همکاری با پترو فولاد نیکان اعلام آمادگی کردید،
                    خوشحالیم.
                  </p>
                  <p>
                    ما به دنبال فردی باانگیزه، دقیق و علاقه‌مند هستیم که
                    بتواند در کنار تیم ما، اولین قدم‌های حرفه‌ای خود را در
                    دنیای واقعی بازرگانی فولاد تجربه کند.
                  </p>
                  <div className="rounded-xl border border-slate-200 border-r-4 border-r-red-500 bg-gradient-to-l from-slate-50 to-white p-4 font-medium shadow-sm">
                    در این مسیر فقط یک کارآموز نخواهید بود؛ شما فرصت یادگیری
                    فرآیند واقعی خرید، تامین، فروش و مدیریت ارتباطات تجاری در
                    صنعت فولاد را خواهید داشت.
                  </div>
                </div>
              </div>

              <div className="mt-2 border-y border-white/50 bg-white/80 px-6 py-8 shadow-sm backdrop-blur-sm">
                <h2 className="mb-4 text-base font-bold text-slate-900">
                  آنچه در این دوره می‌آموزید:
                </h2>
                <ul className="space-y-3 text-sm text-slate-700">
                  {[
                    "روش منبع‌یابی",
                    "مذاکره و پیگیری حرفه‌ای",
                    "آشنایی با سامانه جامع تجارت",
                    "سامانه مودیان اداره مالیات",
                    "ثبت سفارش و خرید",
                    "فرآیند باربری و صدور بارنامه",
                    "فرآیند تکمیل پکینگ‌لیست و تحویل کالا",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                        ✓
                      </span>
                      <span className="font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-2 border-y border-white/50 bg-white/80 px-6 py-8 shadow-sm backdrop-blur-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  شرایط و مزایای همکاری
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-1 text-xs text-slate-500">نوع</p>
                    <p className="font-bold">تمام وقت کارآموزی</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-1 text-xs text-slate-500">مدت</p>
                    <p className="font-bold">۳ ماه</p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-1 text-xs text-slate-500">ساعت کاری</p>
                    <p className="font-bold">۸:۳۰ تا ۱۷ (پنج‌شنبه تعطیل)</p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-1 text-xs text-slate-500">مزایا</p>
                    <p className="font-bold">حقوق وزارت کار + بیمه از روز اول</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white/90 p-4 backdrop-blur-md">
              <p className="mb-3 text-center text-[12px] font-bold text-red-600">
                هدف ما همکاری بلندمدت است؛ این کارآموزی صرفاً مرحله‌ای برای
                آشنایی با صنعت و روش کار ماست.
              </p>
              <button
                type="button"
                onClick={() => setView("form")}
                className="h-12 w-full touch-manipulation rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 font-bold text-white shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all hover:from-red-700"
              >
                شرایط را خواندم و موافقم
              </button>
            </div>
          </>
        )}

        {view === "form" && (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 pb-4 pt-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  اول یکم با هم آشنا شیم
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="نام و نام خانوادگی"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    dir="ltr"
                    placeholder="شماره تماس (09...)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-left text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="منطقه سکونت"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    min="18"
                    max="60"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="سن"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  داستان تحصیلاتت چیه؟
                </h3>
                <div className="mb-3 grid gap-2">
                  {[
                    "دانشجو",
                    "کاردانی",
                    "فوق دیپلم",
                    "کارشناسی",
                    "کارشناسی ارشد",
                    "سایر",
                  ].map((opt) => (
                    <RadioOption
                      key={opt}
                      label={opt}
                      selected={formData.education === opt}
                      onSelect={() => handleRadioChange("education", opt)}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  placeholder="رشته تحصیلی‌ت چی بوده؟"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  مهارت‌ها
                </h3>
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      چقدر با اکسل رفیقی؟ (سطح تسلطت)
                    </label>
                    <span className="rounded-lg border border-red-100 bg-red-50 px-3 py-1 text-sm font-black text-red-700">
                      {formData.excel_skill} از 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    name="excel_skill"
                    value={formData.excel_skill}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        excel_skill: e.target.value.toString(),
                      }));
                      if (submitError) setSubmitError("");
                    }}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>مبتدی</span>
                    <span>متوسط</span>
                    <span>حرفه‌ای</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-xs font-bold leading-relaxed text-slate-700">
                      چقدر با رفقای هوشمندمون (مثل ChatGPT یا Claude) کار
                      میکنی و ازشون کمک میگیری؟ *
                    </label>
                    <span className="shrink-0 rounded-lg border border-red-100 bg-red-50 px-3 py-1 text-sm font-black text-red-700">
                      {formData.ai_skill} از 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    name="ai_skill"
                    value={formData.ai_skill}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        ai_skill: e.target.value.toString(),
                      }));
                      if (submitError) setSubmitError("");
                    }}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>آشنا نیستم</span>
                    <span>گاهی اوقات</span>
                    <span>استفاده مستمر</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  مود (Mood) امروزت رو با یک ایموجی نشون بده 🙃
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { label: "خوشحال", emoji: "😄" },
                    { label: "پر انرژی", emoji: "🚀" },
                    { label: "معمولی", emoji: "😐" },
                    { label: "کنجکاو", emoji: "🧐" },
                    { label: "ناراحت", emoji: "😔" },
                    { label: "مضطرب", emoji: "😰" },
                    { label: "ترسیده", emoji: "😨" },
                    { label: "آروم", emoji: "😌" },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setMood(option.label)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 transition-all touch-manipulation ${
                        mood === option.label
                          ? "border-red-500 bg-red-50 ring-1 ring-red-500"
                          : "border-slate-200 bg-slate-50 hover:bg-white"
                      }`}
                    >
                      <span className="text-2xl leading-none">{option.emoji}</span>
                      <span
                        className={`text-[11px] font-bold ${
                          mood === option.label
                            ? "text-red-700"
                            : "text-slate-600"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-800">
                  انگیزه و انتظارات
                </h3>

                <div className="mb-3">
                  <input
                    ref={voiceInputRef}
                    type="file"
                    accept="audio/*"
                    capture="microphone"
                    className="hidden"
                    onChange={(e) => {
                      setVoiceSelected(Boolean(e.target.files?.[0]));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => voiceInputRef.current?.click()}
                    className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-red-300 bg-red-50/60 px-3 py-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-50 touch-manipulation"
                  >
                    حوصله تایپ نداری؟ وویس بده! 🎙️
                  </button>
                  {voiceSelected && (
                    <p className="mb-2 text-center text-xs font-bold text-green-600">
                      فایل صدا انتخاب شد ✓
                    </p>
                  )}
                </div>

                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <label className="block text-xs font-bold text-slate-700">
                    چی شد که به صنعت فولاد علاقه‌مند شدی؟ *
                  </label>
                  <SpeechMicButton
                    fieldId="motivation"
                    activeFieldId={activeMicField}
                    onActivate={setActiveMicField}
                    value={formData.motivation}
                    onUpdate={(next) => {
                      setFormData((prev) => ({ ...prev, motivation: next }));
                      if (submitError) setSubmitError("");
                    }}
                  />
                </div>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder="کوتاه و خودمونی بنویس..."
                  className="mb-4 min-h-[90px] w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />

                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <label className="block text-xs font-bold leading-relaxed text-slate-700">
                    دوست داری بعد از ۳ ماه کارآموزی تو نیکان، چه مهارت جدیدی به
                    دست آورده باشی و چه تغییری بکنی؟ *
                  </label>
                  <SpeechMicButton
                    fieldId="expectations"
                    activeFieldId={activeMicField}
                    onActivate={setActiveMicField}
                    value={formData.expectations}
                    onUpdate={(next) => {
                      setFormData((prev) => ({ ...prev, expectations: next }));
                      if (submitError) setSubmitError("");
                    }}
                  />
                </div>
                <textarea
                  name="expectations"
                  value={formData.expectations}
                  onChange={handleInputChange}
                  placeholder="مثلاً مذاکره، اکسل، اعتمادبه‌نفس و..."
                  className="min-h-[90px] w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <label className="block text-xs font-bold leading-relaxed text-slate-700">
                    حالا تو یک سوال از ما بپرس! (تو جلسه مصاحبه بهت جواب میدیم)
                  </label>
                  <SpeechMicButton
                    fieldId="reverseQuestion"
                    activeFieldId={activeMicField}
                    onActivate={setActiveMicField}
                    value={reverseQuestion}
                    onUpdate={setReverseQuestion}
                  />
                </div>
                <textarea
                  value={reverseQuestion}
                  onChange={(e) => setReverseQuestion(e.target.value)}
                  placeholder="هر سوالی که تو ذهنت هست..."
                  className="min-h-[80px] w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white/90 p-4 backdrop-blur-md">
              {submitError && (
                <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-bold text-red-600">
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full touch-manipulation rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 font-bold text-white shadow-lg transition-all hover:from-red-700 disabled:opacity-50"
              >
                {isSubmitting ? "در حال ثبت..." : "ثبت نهایی درخواست"}
              </button>
            </div>
          </form>
        )}

        {view === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-green-300 bg-green-100">
              <span className="text-4xl text-green-600">✓</span>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              درخواست ثبت شد
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              اطلاعات شما با موفقیت در سیستم ثبت شد.
            </p>

            <div className="relative mb-6 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm">
              <div className="absolute top-0 right-0 h-full w-2 bg-red-500" />
              <h3 className="mb-4 text-base font-bold text-slate-800">
                اطلاعات جلسه مصاحبه
              </h3>
              <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="mb-1 text-[11px] font-bold text-slate-500">
                  زمان تعیین شده:
                </p>
                <p className="text-lg font-black text-red-700">
                  {interviewSlot}
                </p>
              </div>
              <div className="mb-4">
                <p className="mb-1 text-[11px] font-bold text-slate-500">
                  دفتر مرکزی:
                </p>
                <p className="text-sm font-medium leading-relaxed text-slate-800">
                  تهران، بلوار میرداماد، خیابان مصدق جنوبی، کوچه تابان شرقی،
                  پلاک ۳، واحد ۷
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-[11px] font-bold leading-relaxed text-slate-500 text-justify">
                  در صورت نیاز به جابجایی زمان مصاحبه یا انصراف، لطفاً فقط به
                  شماره{" "}
                  <strong dir="ltr" className="text-slate-800">
                    09125388319
                  </strong>{" "}
                  پیامک دهید.
                </p>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-800">
              بی‌صبرانه منتظر دیدار شما هستیم 🌱
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
