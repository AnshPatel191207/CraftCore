import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Settings } from 'lucide-react';
import { useFarmStore } from '../../store/farmStore';
import { useLanguage } from './LanguageSwitcher';

type Language = 'EN' | 'HI' | 'GU';

const LANG_MAP: Record<Language, string> = {
  EN: 'en-IN',
  HI: 'hi-IN',
  GU: 'gu-IN'
};

const COMMANDS = {
  soil: ['soil', 'soil report', 'मिट्टी', 'माटी', 'સોઈલ', 'માટી'],
  fertilizer: ['fertilizer', 'khad', 'खाद', 'ખાતર', 'ફર્ટિલાઈઝર'],
  crops: ['crop', 'crops', 'my crops', 'फसल', 'પાક', 'ખેતી'],
  dashboard: ['home', 'dashboard', 'ડેશબોર્ડ', 'ડેશબોર્ડ', 'મુખ્ય પૃષ્ઠ'],
  market: ['market', 'price', 'bazaar', 'મંડી', 'બજાર', 'ભાવ', 'કિંમત'],
  weather: ['weather', 'rain', 'mausam', 'હવામાન', 'વરસાદ']
};

export function VoiceAssistant() {
  const { setActivePage } = useFarmStore();
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(language.toUpperCase() as Language || 'EN');
  const [showSettings, setShowSettings] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = LANG_MAP[selectedLang];

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);
        handleVoiceCommand(text);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [selectedLang]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[selectedLang];
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = (text: string) => {
    // Soil
    if (COMMANDS.soil.some(cmd => text.includes(cmd))) {
      speak(selectedLang === 'HI' ? "मिट्टी की रिपोर्ट खोल रहे हैं" : selectedLang === 'GU' ? "માટીનો રિપોર્ટ ખોલી રહ્યો છું" : "Opening your soil health analysis");
      setActivePage('soilhealth');
    }
    // Fertilizer
    else if (COMMANDS.fertilizer.some(cmd => text.includes(cmd))) {
      speak(selectedLang === 'HI' ? "खाद की सलाह खोल रहे हैं" : selectedLang === 'GU' ? "ખાતરની સલાહ ખોલી રહ્યો છું" : "Opening fertilizer advisory");
      setActivePage('fertilizer');
    }
    // Crops
    else if (COMMANDS.crops.some(cmd => text.includes(cmd))) {
      speak(selectedLang === 'HI' ? "फसलों का डैशબોર્ડ खोल रहे हैं" : selectedLang === 'GU' ? "પાક ડેશબોર્ડ ખોલી રહ્યો છું" : "Opening your crop management");
      setActivePage('crops');
    }
    // Market
    else if (COMMANDS.market.some(cmd => text.includes(cmd))) {
      speak(selectedLang === 'HI' ? "बाजार भाव दिखा रहे हैं" : selectedLang === 'GU' ? "બજાર ભાવ બતાવી રહ્યો છું" : "Checking market intelligence");
      setActivePage('market');
    }
    // Dashboard
    else if (COMMANDS.dashboard.some(cmd => text.includes(cmd))) {
      speak(selectedLang === 'HI' ? "मुख्य डैशबोर्ड पर जा रहे हैं" : selectedLang === 'GU' ? "મુખ્ય ડેશબોર્ડ પર જઈ રહ્યો છું" : "Going to dashboard");
      setActivePage('dashboard');
    }
    // Weather
    else if (COMMANDS.weather.some(cmd => text.includes(cmd))) {
      speak(selectedLang === 'HI' ? "मौसम की जानकारी खोल रहे हैं" : selectedLang === 'GU' ? "હવામાનની માહિતી ખોલી રહ્યો છું" : "Opening weather forecasts");
      setActivePage('weather');
    }
    else {
      speak(selectedLang === 'HI' ? "क्षमा करें, मुझे समझ नहीं आया" : selectedLang === 'GU' ? "ક્ષમા કરશો, મને સમજાયું નહીં" : "Sorry, I didn't catch that command");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) {
    return null;
  }

  return (
    <div className="fixed bottom-28 right-8 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-black/80 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-4 mb-2 shadow-2xl min-w-[200px]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-1 bg-teal-500 rounded-full"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Listening...</span>
            </div>
            <p className="text-white font-bold text-sm leading-tight italic">
              {transcript || "Speak now..."}
            </p>
          </motion.div>
        )}

        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-2 shadow-2xl flex gap-2"
          >
            {(['EN', 'HI', 'GU'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLang(lang);
                  setShowSettings(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                  selectedLang === lang 
                    ? 'bg-teal-500 text-bg' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all shadow-xl"
        >
          <Settings size={18} />
        </button>
        <button
          onClick={toggleListening}
          className={`relative w-16 h-16 rounded-[24px] flex items-center justify-center transition-all shadow-2xl ${
            isListening 
              ? 'bg-red-500 text-white shadow-red-500/40 rotate-12 scale-110' 
              : 'bg-teal-500 text-bg shadow-teal-500/40 hover:scale-110 active:scale-95'
          }`}
        >
          {isListening ? <MicOff size={28} /> : <Mic size={28} />}
          
          {isListening && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 rounded-[24px] bg-red-500 z-[-1]"
            />
          )}
        </button>
      </div>
    </div>
  );
}
