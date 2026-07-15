"use client";
import React, { useState } from 'react';

export default function Home() {
  const [view, setView] = useState('landing');
  const [formData, setFormData] = useState({
    fullname: '', phone: '', area: '', age: '',
    education: '', field: '', excel_skill: '', ai_skill: '',
    motivation: '', expectations: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setView('success');
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || 'خطایی رخ داد.');
      }
    } catch (error) {
      setSubmitError('خطا در ارتباط با سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-slate-200 via-gray-100 to-slate-300 flex justify-center text-slate-900 sm:p-6" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
      <div className="w-full max-w-[420px] bg-white/70 relative overflow-hidden flex flex-col shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] sm:rounded-[2.5rem] sm:border-[8px] border-slate-900 sm:max-h-[850px] backdrop-blur-xl">
        
        {view !== 'success' && (
          <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 p-4 sticky top-0 z-40 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white flex items-center justify-center">
                <img src="/nikan2.jpg" alt="Nikan" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-slate-900 font-bold text-xl">N</span>'; }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-black text-slate-900 tracking-tight">پترو فولاد نیکان</span>
                <span className="text-[10px] text-slate-500 font-bold mt-0.5">اکوسیستم نوین بازرگانی</span>
              </div>
            </div>
            {view === 'form' && (
              <button onClick={() => setView('landing')} className="text-sm font-bold text-slate-500 hover:text-slate-800 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200">
                بازگشت
              </button>
            )}
          </header>
        )}

        <div className="flex-1 overflow-y-auto scroll-smooth pb-24">
          {view === 'landing' && (
            <div className="animate-in fade-in duration-500">
              <div className="px-6 pt-8 pb-6 bg-white/80 backdrop-blur-sm">
                <div className="inline-flex items-center rounded-full border border-red-100 px-3 py-1 text-xs font-bold text-red-600 mb-4 bg-red-50">فرصت شغلی جدید</div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4 leading-snug">فرصت شروع یک مسیر حرفه‌ای در صنعت فولاد</h1>
                <div className="space-y-4 mt-6 text-sm text-slate-700 leading-relaxed text-justify">
                  <p className="font-bold text-slate-900 text-base">سلام و خوش آمدید 🌱</p>
                  <p>از اینکه برای همکاری با پترو فولاد نیکان اعلام آمادگی کردید، خوشحالیم.</p>
                  <p>ما به دنبال فردی باانگیزه، دقیق و علاقه‌مند هستیم که بتواند در کنار تیم ما، اولین قدم‌های حرفه‌ای خود را در دنیای واقعی بازرگانی فولاد تجربه کند.</p>
                  <div className="bg-gradient-to-l from-slate-50 to-white p-4 rounded-xl border border-slate-200 font-medium border-r-4 border-r-red-500 shadow-sm">
                    در این مسیر فقط یک کارآموز نخواهید بود؛ شما فرصت یادگیری فرآیند واقعی خرید، تامین، فروش و مدیریت ارتباطات تجاری در صنعت فولاد را خواهید داشت.
                  </div>
                </div>
              </div>

              <div className="px-6 py-8 mt-2 bg-white/80 backdrop-blur-sm shadow-sm border-y border-white/50">
                <h2 className="text-lg font-bold text-slate-900 mb-4">شرایط و مزایای همکاری</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="border border-slate-200 p-3 rounded-xl bg-white"><p className="text-xs text-slate-500 mb-1">نوع</p><p className="font-bold">تمام وقت کارآموزی</p></div>
                  <div className="border border-slate-200 p-3 rounded-xl bg-white"><p className="text-xs text-slate-500 mb-1">مدت</p><p className="font-bold">۳ ماه</p></div>
                  <div className="col-span-2 border border-slate-200 p-3 rounded-xl bg-white"><p className="text-xs text-slate-500 mb-1">ساعت کاری</p><p className="font-bold">۸:۳۰ تا ۱۷ (پنج‌شنبه تعطیل)</p></div>
                  <div className="col-span-2 border border-slate-200 p-3 rounded-xl bg-white"><p className="text-xs text-slate-500 mb-1">مزایا</p><p className="font-bold">حقوق وزارت کار + بیمه از روز اول</p></div>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 max-w-md mx-auto z-10">
                <button onClick={() => setView('form')} className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 text-white font-bold h-12 px-8 rounded-xl shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all">
                  شرایط را خواندم و موافقم
                </button>
              </div>
            </div>
          )}

          {view === 'form' && (
            <div className="px-4 pt-4 animate-in fade-in duration-300">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">اطلاعات هویتی</h3>
                  <div className="space-y-3">
                    <input required type="text" name="fullname" value={formData.fullname} onChange={handleInputChange} placeholder="نام و نام خانوادگی" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
                    <input required type="tel" pattern="09[0-9]{9}" name="phone" value={formData.phone} onChange={handleInputChange} dir="ltr" placeholder="شماره تماس (09...)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-left" />
                    <input required type="text" name="area" value={formData.area} onChange={handleInputChange} placeholder="منطقه سکونت" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
                    <input required type="number" min="18" max="60" name="age" value={formData.age} onChange={handleInputChange} placeholder="سن" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">سوابق تحصیلی</h3>
                  <div className="grid gap-2 mb-3">
                    {['دانشجو', 'کاردانی', 'فوق دیپلم', 'کارشناسی', 'کارشناسی ارشد', 'سایر'].map(opt => (
                      <label key={opt} className={`flex items-center space-x-3 space-x-reverse rounded-lg border p-3 cursor-pointer ${formData.education === opt ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-slate-200'}`}>
                        <input required type="radio" name="education" value={opt} checked={formData.education === opt} onChange={() => handleRadioChange('education', opt)} className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.education === opt ? 'border-red-600' : 'border-slate-400'}`}>
                          {formData.education === opt && <div className="w-2 h-2 rounded-full bg-red-600" />}
                        </div>
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <input required type="text" name="field" value={formData.field} onChange={handleInputChange} placeholder="رشته تحصیلی" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 outline-none" />
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">مهارت‌ها</h3>
                  <p className="text-xs font-bold text-slate-700 mb-2">تجربه کار با Excel؟</p>
                  <div className="grid gap-2 mb-4">
                    {['بله، در حد خوب', 'آشنایی اولیه دارم', 'تجربه ندارم'].map(opt => (
                      <label key={opt} className={`flex items-center space-x-3 space-x-reverse rounded-lg border p-3 cursor-pointer ${formData.excel_skill === opt ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-slate-200'}`}>
                        <input required type="radio" name="excel_skill" value={opt} checked={formData.excel_skill === opt} onChange={() => handleRadioChange('excel_skill', opt)} className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.excel_skill === opt ? 'border-red-600' : 'border-slate-400'}`}>
                          {formData.excel_skill === opt && <div className="w-2 h-2 rounded-full bg-red-600" />}
                        </div>
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>

                  <p className="text-xs font-bold text-slate-700 mb-2">تجربه استفاده از هوش مصنوعی؟</p>
                  <div className="grid gap-2">
                    {['مستمر استفاده می‌کنم', 'آشنایی دارم', 'تجربه ندارم'].map(opt => (
                      <label key={opt} className={`flex items-center space-x-3 space-x-reverse rounded-lg border p-3 cursor-pointer ${formData.ai_skill === opt ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-slate-200'}`}>
                        <input required type="radio" name="ai_skill" value={opt} checked={formData.ai_skill === opt} onChange={() => handleRadioChange('ai_skill', opt)} className="sr-only" />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.ai_skill === opt ? 'border-red-600' : 'border-slate-400'}`}>
                          {formData.ai_skill === opt && <div className="w-2 h-2 rounded-full bg-red-600" />}
                        </div>
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">انگیزه و انتظارات</h3>
                  <textarea required name="motivation" value={formData.motivation} onChange={handleInputChange} placeholder="چرا علاقه‌مند به صنعت فولاد هستید؟" className="w-full min-h-[90px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 outline-none resize-none mb-3" />
                  <textarea required name="expectations" value={formData.expectations} onChange={handleInputChange} placeholder="از همکاری با ما چه انتظاراتی دارید؟" className="w-full min-h-[90px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 outline-none resize-none" />
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 max-w-md mx-auto z-10">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50">
                    {isSubmitting ? 'در حال ثبت...' : 'ثبت نهایی درخواست'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {view === 'success' && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 border border-green-300">
                <span className="text-4xl text-green-600">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">درخواست ثبت شد</h2>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                اطلاعات شما با موفقیت در سیستم ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت. 🌱
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
