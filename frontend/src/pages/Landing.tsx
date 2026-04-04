import { Microscope, ArrowRight, Zap, Target, Globe, BookOpen } from 'lucide-react';
import LanguageSwitcher, { useLanguage } from '../components/ui/LanguageSwitcher';
import { useFarmStore } from '../store/farmStore';
import { ScrollReveal } from '../components/ScrollReveal';

export default function Landing() {
  const { t } = useLanguage();
  const { setActivePage } = useFarmStore();

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Language Switcher Overlay */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="down">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-teal-500/20 text-teal-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <Zap size={12} className="animate-pulse" />
                {t('nextGenAgri')}
              </div>
              
              <h1 className="text-6xl md:text-8xl font-display font-black text-text tracking-tighter leading-[0.9]">
                {t('headline').split(' ').map((word, i) => (
                  <span key={i} className={i % 3 === 0 ? "text-teal-500" : ""}>{word} </span>
                ))}
              </h1>
              
              <p className="text-lg md:text-xl text-text-muted font-bold max-w-2xl mx-auto leading-relaxed">
                {t('transformComplex')} <span className="text-text">{t('builtForIndian')}</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <button 
                  onClick={() => {
                    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                    if (isLoggedIn) {
                      setActivePage('soil');
                    } else {
                      setActivePage('login');
                    }
                  }}
                  className="group relative px-8 py-4 bg-teal-500 text-bg font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {t('analyseMySoil')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
                
                <button className="px-8 py-4 glass border border-border text-text font-black rounded-2xl hover:bg-white/5 transition-all">
                  {t('howItWorks')}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero Background Photo */}
        <div className="absolute inset-0 -z-0 opacity-20">
           <img src="/images/modern_farmer_real.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/0 via-bg/20 to-bg -z-0 pointer-events-none" />
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Microscope, 
              title: t('soilIntelEngine'), 
              desc: t('soilIntelDesc'),
              color: 'text-teal-500'
            },
            { 
              icon: Target, 
              title: t('multiInputAnalysis'), 
              desc: t('multiInputDesc'),
              color: 'text-sky-500'
            },
            { 
              icon: BookOpen, 
              title: t('plainLanguageGuidance'), 
              desc: t('plainLanguageDesc'),
              color: 'text-amber-500'
            }
          ].map((feature, i) => (
            <ScrollReveal direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1} key={feature.title}>
              <div
                className="group p-8 glass border border-border rounded-[32px] hover:border-teal-500/30 transition-all duration-500 h-full"
              >
                <div className={`w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ${feature.color}`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-display font-black text-text mb-3">{feature.title}</h3>
                <p className="text-text-muted font-bold leading-relaxed">{feature.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="max-w-7xl mx-auto px-6 py-20 bg-surface-2/50 rounded-[48px] border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5">
             <Globe size={400} className="text-teal-500" />
          </div>

          <div className="relative z-10 text-center mb-16 px-4">
             <h2 className="text-3xl md:text-5xl font-display font-black text-text mb-4">
               {t('simple3Step')}
             </h2>
             <p className="text-text-muted font-bold">{t('fromRawData')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              { step: '01', title: t('uploadData'), desc: t('uploadDataDesc') },
              { step: '02', title: t('aiAnalysis'), desc: t('aiAnalysisDesc') },
              { step: '03', title: t('getGuidance'), desc: t('getGuidanceDesc') }
            ].map((item, i) => (
              <ScrollReveal direction={i === 1 ? 'up' : i === 0 ? 'left' : 'right'} delay={0.3 + i * 0.1} key={item.step}>
                <div className="text-center space-y-4 px-8">
                  <div className="text-5xl font-display font-black text-teal-500/20 mb-2">{item.step}</div>
                  <h4 className="text-xl font-display font-black text-text">{item.title}</h4>
                  <p className="text-text-muted font-bold leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Stats Section */}
      <ScrollReveal direction="up" delay={0.4}>
        <section className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 glass border border-border rounded-[40px] text-center">
            {[
              { label: t('reportsAnalysed'), val: '2.4M+' },
              { label: t('cropsRecommended'), val: '18+' },
              { label: t('analysisTime'), val: '< 2s' },
              { label: t('fertilizerSaved'), val: '32%' }
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="text-3xl font-display font-black text-teal-500 tracking-tighter">{stat.val}</div>
                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal direction="up" delay={0.5}>
        <section className="max-w-4xl mx-auto px-6 text-center">
          <div
             className="p-12 glass border border-teal-500/30 rounded-[40px] relative overflow-hidden"
          >
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl font-display font-black text-text leading-tight">
                {t('readyToOptimize')}
              </h2>
              <p className="text-text-muted font-bold max-w-xl mx-auto">
                {t('powerfulAgriIntel')}
              </p>
              <button className="px-10 py-4 bg-white text-bg font-black rounded-2xl hover:scale-105 transition-transform">
                {t('getStartedFree')}
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/20 blur-[100px] rounded-full" />
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
