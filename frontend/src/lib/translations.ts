export type Language = 'EN' | 'HI' | 'GU';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'EN', label: 'English', nativeLabel: 'English' },
  { code: 'HI', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'GU', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
];

export const translations: Record<string, any> = {
  // Navigation & General
  "dashboard": { en: "Dashboard", hi: "डैशबोर्ड", gu: "ડેશબોર્ડ" },
  "advisory": { 
    en: "Advisory", hi: "सलाह", gu: "સલાહ",
    "rainfall": {
      "title": { en: "Heavy Rainfall Expected This Week", hi: "इस सप्ताह भारी वर्षा की संभावना", gu: "આ અઠવાડિયે ભારે વરસાદની શક્યતા" },
      "desc": { en: "Heavy rainfall of 80-120mm expected over the next 3 days.", hi: "अगले 3 दिनों में 80-120 मिमी भारी वर्षा की उम्मीद है।", gu: "આગામી ૩ દિવસમાં ૮૦-૧૨૦ મીમી ભારે વરસાદની અપેક્ષા છે." }
    },
    "pest": {
      "title": { en: "Fall Armyworm Alert - Corn Fields", hi: "मकई में फॉल आर्मीवॉर्म का अलर्ट", gu: "મકાઈમાં ફોલ આર્મીવોર્મ એલર્ટ" },
      "desc": { en: "Fall armyworm infestation reported in neighboring districts.", hi: "पड़ोसी जिलों में फॉल आर्मीवॉर्म के प्रकोप की सूचना मिली है।", gu: "પાડોશી જિલ્લાઓમાં ફોલ આર્મીવોર્મનો ઉપદ્રવ જોવા મળ્યો છે." }
    },
    "planting": {
      "title": { en: "Optimal Planting Window for Wheat", hi: "गेहूं के लिए रोपण का सही समय", gu: "ઘઉં માટે વાવેતરનો યોગ્ય સમય" },
      "desc": { en: "The optimal planting window for winter wheat is approaching.", hi: "रबी गेहूं के लिए इष्टतम रोपण का समय आ रहा है।", gu: "શિયાળુ ઘઉં માટે વાવેતરનો યોગ્ય સમય આવી રહ્યો છે." }
    },
    "ph": {
      "title": { en: "Soil pH Correction Needed - Field B", hi: "मिट्टी के पीएच सुधार की जरूरत - खेत बी", gu: "સોઈલ pH સુધારણા જરૂરી - ખેતર B" },
      "desc": { en: "Recent soil test shows pH below optimal range.", hi: "हालिया मिट्टी परीक्षण इष्टतम सीमा से नीचे पीएच दिखाता है।", gu: "સોઈલ ટેસ્ટમાં pH ઓછું જોવા મળ્યું છે." }
    },
    "market": {
      "title": { en: "Corn Price Rally - Consider Market", hi: "मकई की कीमतों में तेजी - बाजार देखें", gu: "મકાઈના ભાવમાં તેજી - બજાર જુઓ" },
      "desc": { en: "Corn futures have risen 12% this month.", hi: "मकई वायदा इस महीने 12% बढ़ गया है।", gu: "મકાઈના ભાવમાં આ મહિને ૧૨% વધારો થયો છે." }
    }
  },
  "myCrops": { en: "My Crops", hi: "मेरी फसलें", gu: "મારી ખેતી" },
  "weather": { en: "Weather", hi: "मौसम", gu: "હવામાન" },
  "soilReports": { en: "Soil Reports", hi: "मिट्टी रिपोर्ट", gu: "સોઈલ રિપોર્ટ્સ" },
  "advisoryPortal": { en: "Advisory Portal", hi: "सलाह पोर्टल", gu: "સલાહ પોર્ટલ" },
  "settings": { en: "Settings", hi: "सेटिंग्स", gu: "સેટિંગ્સ" },
  "intelligence": { en: "Intelligence", hi: "इंटेलिजेंस", gu: "ઇન્ટેલિજન્સ" },
  "tagline": { en: "AI Powered Smart Farming & Soil Intelligence", hi: "एआई संचालित स्मार्ट खेती और मिट्टी बुद्धिमत्ता", gu: "AI સંચાલિત સ્માર્ટ ખેતી અને સોઈલ ઇન્ટેલિજન્સ" },
  "saveSoilAI": { en: "SAVE SOIL AI", hi: "सेव सॉइल AI", gu: "સેવ સોઈલ AI" },
  "mainCommand": { en: "Main Command", hi: "मुख्य कमान", gu: "મુખ્ય કમાન્ડ" },
  "globalSync": { en: "Global Sync", hi: "ग्लोबल सिंक", gu: "ગ્લોબલ સિંક" },
  "totalArea": { en: "total area", hi: "कुल क्षेत्र", gu: "કુલ વિસ્તાર" },
  "live": { en: "LIVE", hi: "लाइव", gu: "લાઈવ" },
  "receivingLiveSensorData": { en: "Receiving live sensor data from", hi: "से लाइव सेंसर डेटा प्राप्त हो रहा है", gu: "થી લાઈવ સેન્સર ડેટા મળી રહ્યો છે" },
  "mainHub": { en: "Main Hub", hi: "मुख्य हब", gu: "मुख्य हब" },
  "syncFrequency": { en: "Sync Frequency", hi: "सिंक आवृत्ति", gu: "સિંક આવૃત્તિ" },
  "auditTrail": { en: "Audit Trail", hi: "ऑडिट ट्रेल", gu: "ઓડિટ ટ્રેલ" },
  "myCropsTitle": { en: "My Crops", hi: "मेरी फसलें", gu: "મારી ખેતી" },
  "manageAndMonitor": { en: "Manage and monitor your crop growth.", hi: "अपनी फसल की वृद्धि का प्रबंधन और निगरानी करें।", gu: "તમારા પાકની વૃદ્ધિનું સંચાલન અને દેખરેખ કરો." },
  "landUtilization": { en: "Land Utilization", hi: "भूमि उपयोग", gu: "જમીનનો ઉપયોગ" },
  "acres": { en: "acres", hi: "एकड़", gu: "એકર" },
  "landDistribution": { en: "Land Distribution", hi: "भूमि वितरण", gu: "જમીન વિતરણ" },
  "unused": { en: "Unused", hi: "अप्रयुक्त", gu: "વણવપરાયેલ" },
  "stage": { en: "Stage", hi: "चरण", gu: "તબક્કો" },
  "health": { en: "Health", hi: "स्वास्थ्य", gu: "સ્વાસ્થ્ય" },
  "area": { en: "Area", hi: "क्षेत्र", gu: "વિસ્તાર" },
  "planted": { en: "Planted", hi: "लगाया गया", gu: "વાવેતર" },
  "harvest": { en: "Harvest", hi: "कटाई", gu: "લણણી" },
  "oct": { en: "Oct", hi: "अक्टूबर", gu: "ઓક્ટોબર" },
  "nov": { en: "Nov", hi: "नवंबर", gu: "નવેમ્બર" },
  "ac": { en: "ac", hi: "एकड़", gu: "એકર" },


  // Dashboard & Hero
  "rabiSeasonCycle": { en: "Rabi Season Cycle", hi: "रबी सीजन चक्र", gu: "રવી સીઝન ચક્ર" },
  "active": { en: "Active", hi: "सक्रिय", gu: "સક્રિય" },
  "criticalGrowthPhase": { en: "Critical Growth Phase Detected", hi: "महत्वपूर्ण विकास चरण की पहचान", gu: "ક્રિટિકલ ગ્રોથ ફેઝ મળી આવ્યો" },
  "avgHealthScore": { en: "Avg. Health Score", hi: "औसत स्वास्थ्य स्कोर", gu: "સરેરાશ હેલ્થ સ્કોર" },
  "domainSynced": { en: "Domain synced to", hi: "डोमेन सिंक किया गया", gu: "ડોમેન સિંક થયેલ છે" },
  "currentlyManaging": { en: "Currently managing", hi: "अभी प्रबंधित कर रहे हैं", gu: "હાલમાં મેનેજ કરી રહ્યા છે" },
  "distinctFields": { en: "distinct fields", hi: "अलग क्षेत्र", gu: "અલગ ખેતરો" },
  "withHighTarget": { en: "with high target yield potential", hi: "उच्च लक्ष्य उपज क्षमता के साथ", gu: "ઉચ્ચ લક્ષ્યાંક ઉપજ ક્ષમતા સાથે" },
  "analyseMySoil": { en: "Analyse My Soil", hi: "मिट्टी विश्लेषण करें", gu: "સોઈલ એનાલિસિસ કરો" },
  "howItWorks": { en: "How it Works", hi: "यह कैसे काम करता है", gu: "રીત" },
  "latestAnalysis": { en: "Latest Analysis", hi: "नवीनतम विश्लेषण", gu: "છેલ્લું વિશ્લેષણ" },
  "healthySoil": { en: "Healthy Soil", hi: "स्वस्थ मिट्टी", gu: "સ્વાસ્થ્ય માટી" },
  "verifiedByAgriSense": { en: "Verified by KrishiSetu", hi: "KrishiSetu द्वारा सत्यापित", gu: "KrishiSetu દ્વારા પ્રચલિત" },
  "growSmarterWithAI": { en: "Grow Smarter with AI Advisor", hi: "एआई सलाहकार के साथ बेहतर खेती करें", gu: "AI સલાહકાર સાથે સ્માર્ટ ખેતી કરો" },
  "getPersonalizedYield": { en: "Get personalized yield optimization strategies.", hi: "व्यक्तिगत उपज अनुकूलन रणनीतियां प्राप्त करें।", gu: "વૈયક્તિકૃત ઉપજ ઓપ્ટિમાઇઝેશન વ્યૂહરચનાઓ મેળવો." },
  "openAIAdvisor": { en: "Open AI Advisor", hi: "एआई सलाहकार खोलें", gu: "AI સલાહકાર ખોલો" },
  "GreenValleyFarm": { en: "Green Valley Farm", hi: "ग्रीन वैली फार्म", gu: "ગ્રીન વેલી ફાર્મ" },
  "AgriTech": { en: "AgriTech", hi: "एग्रीटेक", gu: "એગ્રીટેક" },
  "readyToOptimize": { en: "Ready to Optimize Your Yield?", hi: "अपनी उपज को अनुकूलित करने के लिए तैयार हैं?", gu: "તમારી ઉપજ વધારવા માટે તૈયાર છો?" },
  "getStartedFree": { en: "Get Started Free", hi: "मुफ्त में शुरू करें", gu: "મફતમાં શરૂ કરો" },

  // Stats
  "cropHealth": { en: "Crop Health", hi: "फसल स्वास्थ्य", gu: "પાકનું સ્વાસ્થ્ય" },
  "activeArea": { en: "Active Area", hi: "सक्रिय क्षेत्र", gu: "સક્રિય વિસ્તાર" },
  "yieldEst": { en: "Yield Est.", hi: "उपज अनुमान", gu: "ઉપજ અંદાજ" },
  "priorityAlerts": { en: "Priority Alerts", hi: "प्राथमिकता अलर्ट", gu: "પ્રાયોરિટી એલર્ટ" },
  "systemNominal": { en: "System Nominal", hi: "सिस्टम सामान्य", gu: "સિસ્ટમ નોર્મલ" },
  "digitalMapping": { en: "Digital Mapping", hi: "डिजिटल मैपिंग", gu: "ડિજિટલ મેપિંગ" },
  "forecastQ1": { en: "Forecast Q1", hi: "पूर्वानुमान Q1", gu: "પૂર્વસૂચન Q1" },
  "actionRequired": { en: "Action Required", hi: "कार्रवाई आवश्यक", gu: "એક્શન જરૂરી" },

  // Bento Grid
  "topAdvisory": { en: "Top Advisory", hi: "शीर्ष सलाह", gu: "ટોપ એડવાઈઝરી" },
  "wheatSowing": { en: "Wheat Sowing", hi: "गेहूं की बुवाई", gu: "ઘઉંનું વાવેતર" },
  "plantingWindow": { en: "Planting Window", hi: "रोपण अवधि", gu: "વાવેતર સમયગાળો" },
  "healthIndex": { en: "Health Index", hi: "स्वास्थ्य सूचकांक", gu: "હેલ્થ ઈન્ડેક્સ" },
  "environmentStable": { en: "Environment Stable", hi: "पर्यावरण स्थिर", gu: "પર્યાવરણ સ્થિર" },
  "soilChemistry": { en: "Soil Chemistry", hi: "मिट्टी रसायन", gu: "માટીનું રસાયણ" },
  "neutral": { en: "Neutral", hi: "तटस्थ", gu: "तटस्थ" },
  "normalRange": { en: "Normal Range", hi: "सामान्य श्रेणी", gu: "સામાન્ય રેન્જ" },
  "intelligenceLog": { en: "Intelligence Log", hi: "इंटेलिजेंस लॉग", gu: "ઇન્ટેલિજન્સ લોગ" },
  "liveSubmission": { en: "Live Submission Stream", hi: "लाइव सबमिशन स्ट्रीम", gu: "લાઈવ સબમિશન સ્ટ્રીમ" },
  "sensorAvg": { en: "Sensor Avg", hi: "सेंसर औसत", gu: "સેન્સર એવરેજ" },
  "yieldProjection": { en: "Yield Projection", hi: "उपज प्रक्षेपण", gu: "ઉપજ પ્રોજેક્શન" },
  "multiMonthAIAnalysis": { en: "Multi-month AI Analysis", hi: "बहु-मापीय एआई विश्लेषण", gu: "મલ્ટી-મહિના AI એનાલિસિસ" },
  "detailedLog": { en: "Detailed Log", hi: "विस्तृत लॉग", gu: "વિગતવાર લોગ" },
  "resourceCycles": { en: "Resource Cycles", hi: "संसाधन चक्र", gu: "રિસોર્સ સાયકલ્સ" },
  "precipitationSyncIndex": { en: "Precipitation Sync Index", hi: "वर्षा सिंक इंडेक्स", gu: "વરસાદ સિંક ઇન્ડેક્સ" },
  "acidic": { en: "Subtle Acidic", hi: "थोड़ा अम्लीय", gu: "થોડું એસિડિક" },
  "optimal": { en: "Optimal", hi: "इष्टतम", gu: "આદર્શ" },

  // Landing Page
  "nextGenAgri": { en: "NEXT-GEN AGRI INTELLIGENCE", hi: "अगली पीढ़ी की कृषि इंटेलिजेंस", gu: "નેક્સ્ટ-જનન એગ્રી ઇન્ટેલિજન્સ" },
  "headline": { en: "Precision Agriculture for the Modern Farmer", hi: "आधुनिक किसानों के लिए सटीक कृषि", gu: "આધુનિક ખેડૂતો માટે સચોટ ખેતી" },
  "transformComplex": { en: "Transform complex soil reports into simple, actionable insights.", hi: "जटिल मिट्टी रिपोर्ट को सरल, व्यावहारिक जानकारी में बदलें।", gu: "સોઈલ રિપોર્ટ્સને સરળ અને અસરકારક બનાવો." },
  "builtForIndian": { en: "Built for Bharat, powered by AI.", hi: "भारत के लिए निर्मित, एआई द्वारा संचालित।", gu: "ભારત માટે નિર્મિત, AI દ્વારા સંચાલિત." },
  "soilIntelEngine": { en: "Soil Intel Engine", hi: "मिट्टी इंटेल इंजन", gu: "માટી ઇન્ટેલ એન્જિન" },
  "soilIntelDesc": { en: "Deep analysis of 12+ nutrients with personalized correction strategies.", hi: "व्यक्तिगत सुधार रणनीतियों के साथ 12+ पोषक तत्वों का गहरा विश्लेषण।", gu: "વૈયક્તિકૃત વ્યૂહરચનાઓ સાથે ૧૨+ પોષક તત્વોનું ઊંડું વિશ્લેષણ." },
  "multiInputAnalysis": { en: "Multi-input Analysis", hi: "बहु-इनपुट विश्लेषण", gu: "મલ્ટી-ઇનપુટ વિશ્લેષણ" },
  "multiInputDesc": { en: "Upload PDFs, scan physical reports, or input data manually with ease.", hi: "पीडीएफ अपलोड करें, भौतिक रिपोर्ट स्कैन करें, या आसानी से मैन्युअल रूप से डेटा इनपुट करें।", gu: "PDF અપલોડ કરો, રિપોર્ટ્સ સ્કેન કરો અથવા સરળતાથી ડેટા ઇનપુટ કરો." },
  "plainLanguageGuidance": { en: "Plain Language Guidance", hi: "सरल भाषा मार्गदर्शन", gu: "સરળ ભાષા માર્ગદર્શન" },
  "plainLanguageDesc": { en: "Get prescriptions in your local language that any farmer can understand.", hi: "अपनी स्थानीय भाषा में नुस्खे प्राप्त करें जिन्हें कोई भी किसान समझ सके।", gu: "તમારી સ્થાનિક ભાષામાં સમજણ મેળવો." },
  "uploadData": { en: "Upload Data", hi: "डेटा अपलोड करें", gu: "ડેટા અપલોડ કરો" },
  "uploadDataDesc": { en: "Drop your soil test report or enter values manually.", hi: "अपनी मिट्टी परीक्षण रिपोर्ट डालें या मैन्युअल रूप से मान दर्ज करें।", gu: "રિપોર્ટ અપલોડ કરો અથવા મેન્યુઅલ ડેટા એન્ટર કરો." },
  "aiAnalysis": { en: "AI Analysis", hi: "एआई विश्लेषण", gu: "AI એનાલિસિસ" },
  "aiAnalysisDesc": { en: "Our neural engine processes your data and cross-references crop needs.", hi: "हमारा न्यूरल इंजन आपके डेटा को प्रोसेस करता है और फसल की जरूरतों की जाँच करता है।", gu: "અમારું એન્જિન ડેટા પ્રોસેસ કરે છે અને જરૂરિયાત તપાસે છે." },
  "getGuidance": { en: "Get Guidance", hi: "मार्गदर्शन प्राप्त करें", gu: "માર્ગदर्शन મેળવો" },
  "getGuidanceDesc": { en: "Receive precise fertilizer and crop recommendations instantly.", hi: "तुरंत सटीक उर्वरक और फसल सिफारिशें प्राप्त करें।", gu: "તરત જ ખાતર અને પાકની ભલામણો મેળવો." },
  "reportsAnalysed": { en: "Reports Analysed", hi: "विश्लेषण की गई रिपोर्ट", gu: "એનાાઇઝ્ડ રિપોર્ટ્સ" },
  "cropsRecommended": { en: "Crops Recommended", hi: "अनुशंसित फसलें", gu: "ભલામણ કરેલ પાક" },
  "analysisTime": { en: "Analysis Time", hi: "विश्लेषण समय", gu: "એનાલિસિસ સમય" },
  "fertilizerSaved": { en: "Fertilizer Saved", hi: "बचत किया गया उर्वरक", gu: "બચત કરેલ ખાતર" },
  "lifestyleImpact": { en: "Lifestyle Impact", hi: "जीवनशैली प्रभाव", gu: "જીવનશૈલી પ્રભાવ" },
  "powerfulAgriIntel": { en: "Powerful agri-intelligence at your fingertips.", hi: "आपकी उंगलियों पर शक्तिशाली कृषि-बुद्धिमत्ता।", gu: "શક્તિશાળી એગ્રી-ઇન્ટેલિજન્સ તમારી આંગળીના ટેરવે." },
  "simple3Step": { en: "Simple 3-Step Process", hi: "सरल 3-चरणीय प्रक्रिया", gu: "સરળ ૩-સ્ટેપ પ્રક્રિયા" },
  "fromRawData": { en: "From raw data to harvest excellence.", hi: "कच्चे डेटा से फसल की उत्कृष्टता तक।", gu: "ડેટાથી લણણી સુધીની શ્રેષ્ઠતા." },
  "inputPdf": { en: "PDF", hi: "पीडीएफ", gu: "પીડીએફ" },
  "inputScan": { en: "SCAN", hi: "स्कैन", gu: "સ્કેન" },
  "inputManual": { en: "MANUAL", hi: "मैनुअल", gu: "મેન્યુઅલ" },
  "fieldA": { en: "Field A", hi: "खेत ए", gu: "ખેતર એ" },
  "kharifSeason": { en: "Kharif Season", hi: "खरीफ सीजन", gu: "ખરીફ સીઝન" },

  // Advisory Page
  "portalTitle": { en: "Advisory Portal", hi: "सलाह पोर्टल", gu: "એડવાઈઝરી પોર્ટલ" },
  "portalSub": { en: "Real-time AI-powered guidance for your specific farm needs.", hi: "आपके खेत की विशिष्ट आवश्यकताओं के लिए वास्तविक समय में एआई-संचालित मार्गदर्शन।", gu: "તમારી જરૂરિયાતો માટે રિયલ-ટાઇમ AI-સંચાલિત માર્ગદર્શન." },
  "filterAll": { en: "All Advisories", hi: "सभी सलाह", gu: "બધી સલાહ" },
  "catWeather": { en: "Weather", hi: "मौसम", gu: "હવામાન" },
  "catPest": { en: "Pests", hi: "कीट", gu: "જીવાત" },
  "catCrop": { en: "Crop Care", hi: "फसल देखभाल", gu: "પાકની સંભાળ" },
  "catSoil": { en: "Soil", hi: "मिट्टी", gu: "માટી" },
  "catMarket": { en: "Market", hi: "बाज़ार", gu: "બજાર" },
  "sevLow": { en: "Low Priority", hi: "कम प्राथमिकता", gu: "ઓછી પ્રથમિકતા" },
  "sevMedium": { en: "Medium Priority", hi: "सामान्य प्राथमिकता", gu: "સામાન્ય પ્રથમિકતા" },
  "sevHigh": { en: "High Priority", hi: "उच्च प्राथमिकता", gu: "ઉચ્ચ પ્રથમિકતા" },
  "sevCritical": { en: "Critical Alert", hi: "महत्वपूर्ण अलर्ट", gu: "ક્રિટિકલ એલર્ટ" },
  "actionItems": { en: "Action Items", hi: "कार्य सूची", gu: "એક્શન આઈટમ્સ" },
  "impactZone": { en: "Impact Zone", hi: "प्रभाव क्षेत्र", gu: "અસર વિસ્તાર" },
  "category": { en: "Category", hi: "श्रेणी", gu: "કેટેગરી" },
  "viewDetails": { en: "View Details", hi: "विवरण देखें", gu: "વિગત જુઓ" },
  "national": { en: "National", hi: "राष्ट्रीय", gu: "રાષ્ટ્રીય" },
  "searchAdvisories": { en: "Search advisories...", hi: "सलाह खोजें...", gu: "એડવાઈઝરી શોધો..." },
  "noAdvisories": { en: "No advisories found for this category.", hi: "इस श्रेणी के लिए कोई सलाह नहीं मिली।", gu: "આ કેટેગરી માટે કોઈ સલાહ મળી નથી." },

  // Weather Page
  "weatherForecast": { en: "Weather Forecast", hi: "मौसम का पूर्वानुमान", gu: "હવામાન પૂર્વસૂચન" },
  "weatherSub": { en: "7-day outlook and hourly agricultural metrics.", hi: "7-दिवसीय आउटलुक और प्रति घंटा कृषि मेट्रिक्स।", gu: "૭-દિવસના આઉટલુક અને એગ્રીકલ્ચર મેટ્રિક્સ." },
  "currentWeather": { en: "Current Weather", hi: "वर्तमान मौसम", gu: "વર્તમાન હવામાન" },
  "partlyCloudy": { en: "Partly Cloudy", hi: "आंशिक रूप से बादल", gu: "આંશિક વાદળછાયું" },
  "sunrise": { en: "Sunrise", hi: "सूर्योदय", gu: "સૂર્યોદય" },
  "sunset": { en: "Sunset", hi: "सूर्यास्त", gu: "સૂર્યાસ્ત" },
  "feelsLike": { en: "Feels Like", hi: "महसूस होता है", gu: "અનુભવ" },
  "humidity": { en: "Humidity", hi: "नमी", gu: "ભેજ" },
  "windSpeed": { en: "Wind Speed", hi: "हवा की गति", gu: "પવનની ગતિ" },
  "visibility": { en: "Visibility", hi: "दृश्यता", gu: "દૃશ્યતા" },
  "hourlyTempHum": { en: "Hourly Temperature & Humidity", hi: "प्रति घंटा तापमान और नमी", gu: "કલાકદીઠ તાપમાન અને ભેજ" },
  "sevenDayForecast": { en: "7-Day Forecast", hi: "7-दिवसीय पूर्वानुमान", gu: "૭-દિવસની આગાહી" },
  "agriWeatherAdvisory": { en: "Agricultural Weather Advisory", hi: "कृषि मौसम सलाह", gu: "કૃષિ હવામાન સલાહ" },
  "today": { en: "Today", hi: "आज", gu: "આજે" },
  "tomorrow": { en: "Tomorrow", hi: "कल", gu: "આવતીકાલે" },
  "sunny": { en: "Sunny", hi: "धूप", gu: "સની" },
  "rain": { en: "Rain", hi: "बारिश", gu: "વરસાદ" },
  "heavyRain": { en: "Heavy Rain", hi: "भारी बारिश", gu: "ભારે વરસાદ" },
  "overcast": { en: "Overcast", hi: "बादल छाए रहेंगे", gu: "ઓવરકાસ્ટ" },
  "Wed": { en: "Wed", hi: "बुध", gu: "બુધ" },
  "Thu": { en: "Thu", hi: "गुरु", gu: "ગુરુ" },
  "Fri": { en: "Fri", hi: "शुक्र", gu: "શુક્ર" },
  "Sat": { en: "Sat", hi: "शनि", gu: "શનિ" },
  "Sun": { en: "Sun", hi: "रवि", gu: "રવિ" },
  "irrigation": { en: "Irrigation", hi: "सिंचाई", gu: "સિંચાઈ" },
  "irrigationAdvice": { en: "Reduce irrigation by 50% ahead of expected rainfall on Wednesday-Thursday.", hi: "बुधवार-गुरुवार को अपेक्षित वर्षा से पहले सिंचाई में 50% की कमी करें।", gu: "બુધવાર-ગુરુવારના વરસાદ પહેલા સિંચાઈમાં ૫૦% ઘટાડો કરો." },
  "spraying": { en: "Spraying", hi: "छिड़काव", gu: "છંટકાવ" },
  "sprayingAdvice": { en: "Complete any pending pesticide applications before Tuesday evening.", hi: "मंगलवार शाम से पहले किसी भी लंबित कीटनाशक अनुप्रयोगों को पूरा करें।", gu: "મંગળવાર સાંજ સુધીમાં છંટકાવ પૂરો કરો." },
  "harvesting": { en: "Harvesting", hi: "कटाई", gu: "લણણી" },
  "harvestingAdvice": { en: "Expedite harvesting of mature soybeans before the rain event.", hi: "बारिश की घटना से पहले परिपक्व सोयाबीन की कटाई में तेजी लाएं।", gu: "વરસાદ પહેલા સોયાબીનની લણણી ઝડપી બનાવો." },
  "drainage": { en: "Drainage", hi: "जल निकासी", gu: "ડ્રેનેજ" },
  "drainageAdvice": { en: "Ensure field drainage channels are clear to handle 80-120mm of expected rainfall.", hi: "सुनिश्चित करें कि 80-120 मिमी अपेक्षित वर्षा को संभालने के लिए खेत जल निकासी चैनल स्पष्ट हैं।", gu: "ભારે વરસાદ માટે ડ્રેનેજની વ્યવસ્થા તપાસો." },

  // Soil Reports Page
  "soilAnalysisPortal": { en: "Soil Analysis Portal", hi: "मिट्टी विश्लेषण पोर्टल", gu: "સોઈલ એનાલિસિસ પોર્ટલ" },
  "soilAnalysisPortalSub": { en: "View historical reports or upload new field data.", hi: "ऐतिहासिक रिपोर्ट देखें या नया फ़ील्ड डेटा अपलोड करें।", gu: "રિપોર્ટ્સ જુઓ અથવા નવો ડેટા અપલોડ કરો." },
  "uploadReport": { en: "Upload New Report", hi: "नई रिपोर्ट अपलोड करें", gu: "નવો રિપોર્ટ અપલોડ કરો" },
  "dropPdf": { en: "Drop soil test PDF or click to browse", hi: "मिट्टी परीक्षण पीडीएफ डालें या ब्राउज़ करने के लिए क्लिक करें", gu: "રિપોર્ટ અપલોડ કરો અથવા બ્રાઉઝ કરો" },
  "supportsPdfJpeg": { en: "Supports PDF, JPEG, PNG", hi: "पीडीएफ, जेपीईजी, पीएनजी का समर्थन करता है", gu: "PDF, JPEG, PNG સપોર્ટેડ છે" },
  "resultsFor": { en: "Results for", hi: "के लिए परिणाम", gu: "માટે પરિણામો" },
  "phLevel": { en: "pH Level", hi: "पीएच स्तर", gu: "pH લેવલ" },
  "nitrogen": { en: "Nitrogen (N)", hi: "नाइट्रोजन (N)", gu: "નાઇટ્રોજન (N)" },
  "phosphorus": { en: "Phosphorus (P)", hi: "फास्फोरस (P)", gu: "ફોસ્ફરસ (P)" },
  "potassium": { en: "Potassium (K)", hi: "पोटेशियम (K)", gu: "પોટેશિયમ (K)" },
  "organicMatter": { en: "Organic Matter", hi: "जैविक पदार्थ", gu: "જૈવિક પદાર્થ" },
  "nutrientLevels": { en: "Nutrient Levels", hi: "पोषक तत्व स्तर", gu: "પોષક તત્વોનું સ્તર" },
  "textureSoil": { en: "Texture", hi: "बनावट", gu: "ટેક્સચર" },
  "soil": { en: "Soil", hi: "मिट्टी", gu: "માટી" },
  "recs": { en: "AI Recommendations", hi: "एआई सिफारिशें", gu: "AI ભલામણો" },
  "kg/ha": { en: "kg/ha", hi: "किग्रा/हेक्टेयर", gu: "કિગ્રા/હેક્ટર" },
  "%": { en: "%", hi: "%", gu: "%" },

  // Mock Data Items
  "heavyRainTitle": { en: "Heavy Rainfall Expected This Week", hi: "इस सप्ताह भारी वर्षा की संभावना", gu: "આ અઠવાડિયે ભારે વરસાદની આગાહી" },
  "pestAlertTitle": { en: "Fall Armyworm Alert - Corn Fields", hi: "फॉल आर्मीवॉर्म अलर्ट - मकई के खेत", gu: "ફોલ આર્મીવોર્મ એલર્ટ - મકાઈના ખેતરો" },
  "plantingTimeTitle": { en: "Optimal Planting Window for Wheat", hi: "गेहूं के लिए इष्टतम रोपण का समय", gu: "ઘઉં માટે વાવેતરનો યોગ્ય સમય" },
  "phCorrectionTitle": { en: "Soil pH Correction Needed - Field B", hi: "मिट्टी के पीएच सुधार की आवश्यकता - खेत बी", gu: "સોઈલ pH સુધારણા જરૂરી - ખેતર B" },
  "marketRallyTitle": { en: "Corn Price Rally - Consider Market", hi: "मकई की कीमतों में तेजी - बाजार पर विचार करें", gu: "મકાઈના ભાવમાં તેજી - બજાર ધ્યાનમાં લો" },
  
  "heavyRainDesc": { en: "Heavy rainfall of 80-120mm expected over the next 3 days.", hi: "अगले 3 दिनों में 80-120 मिमी भारी वर्षा की उम्मीद है।", gu: "આગામી ૩ દિવસમાં ૮૦-૧૨૦ મીમી ભારે વરસાદની અપેક્ષા છે." },
  "pestAlertDesc": { en: "Fall armyworm infestation reported in neighboring districts.", hi: "पड़ोसी जिलों में फॉल आर्मीवॉर्म के प्रकोप की सूचना मिली है।", gu: "પાડોશી જિલ્લાઓમાં ફોલ આર્મીવોર્મનો ઉપદ્રવ જોવા મળ્યો છે." },
  "plantingTimeDesc": { en: "The optimal planting window for winter wheat is approaching.", hi: "रबी गेहूं के लिए इष्टतम रोपण का समय आ रहा है।", gu: "શિયાળુ ઘઉં માટે વાવેતરનો યોગ્ય સમય આવી રહ્યો છે." },
  "phCorrectionDesc": { en: "Recent soil test shows pH below optimal range.", hi: "हालिया मिट्टी परीक्षण इष्टतम सीमा से नीचे पीएच दिखाता है।", gu: "સોઈલ ટેસ્ટમાં pH ઓછું જોવા મળ્યું છે." },
  "marketRallyDesc": { en: "Corn futures have risen 12% this month.", hi: "मकई वायदा इस महीने 12% बढ़ गया है।", gu: "મકાઈના ભાવમાં આ મહિને ૧૨% વધારો થયો છે." },

  "clearDrainage": { en: "Clear drainage channels immediately", hi: "जल निकासी चैनलों को तुरंत साफ करें", gu: "ડ્રેનેજ તરત જ સાફ કરો" },
  "postponeIrrigation": { en: "Postpone any planned irrigation", hi: "किसी भी नियोजित सिंचाई को स्थगित करें", gu: "સિંચાઈ મુલતવી રાખો" },
  "applyFungicide": { en: "Apply preventive fungicide", hi: "निवारक कवकनाशी लगाएं", gu: "ફુગનાશકનો ઉપયોગ કરો" },
  "scoutFields": { en: "Scout fields every 2-3 days", hi: "हर 2-3 दिनों में खेतों की निगरानी करें", gu: "દર ૨-૩ દિવસે ખેતરની તપાસ કરો" },
  "checkLeaves": { en: "Look for window-pane damage on leaves", hi: "पत्तियों पर क्षति के निशान देखें", gu: "પાંદડા પર નુકસાનના નિશાન તપાસો" },
  "applyLiming": { en: "Apply agricultural lime at 2 tons/acre", hi: "2 टन/एकड़ की दर से कृषि चूना लगाएं", gu: "એકર દીઠ ૨ ટન ચૂનાનો ઉપયોગ કરો" },
  "reviewInventory": { en: "Review current corn inventory", hi: "वर्तमान मकई इन्वेंट्री की समीक्षा करें", gu: "મકાઈના સ્ટોકનું નિરીક્ષણ કરો" },

  "cropCorn": { en: "Corn (Maize)", hi: "मकई", gu: "મકાઈ" },
  "cropWinter": { en: "Winter Wheat", hi: "रबी गेहूं", gu: "શિયાળુ ઘઉં" },
  "cropSoybeans": { en: "Soybeans", hi: "सोयाबीन", gu: "સોયાબીન" },
  "cropRice": { en: "Rice (Paddy)", hi: "चावल (धान)", gu: "ચોખા (ડાંગર)" },
  
  "stageTasseling": { en: "Tasseling", hi: "फूल आना", gu: "તસલિંગ" },
  "stageTillering": { en: "Tillering", hi: "फुटाव", gu: "ટિલરિંગ" },
  "stagePodFill": { en: "Pod Fill", hi: "फली भरना", gu: "પોડ ફીલ" },
  "stageHeading": { en: "Heading", hi: "निकलना", gu: "હેડિંગ" },

  "auditUploadedsoilreport": { en: "Uploaded soil report", hi: "मिट्टी की रिपोर्ट अपलोड की", gu: "સોઈલ રિપોર્ટ અપલોડ કર્યો" },
  "auditRequestedcropadvice": { en: "Requested crop advice", hi: "फसल सलाह का अनुरोध किया", gu: "પાકની સલાહ માંગી" },
  "auditAppliedureadosage": { en: "Applied urea dosage", hi: "यूरिया की खुराक लागू की", gu: "યુરિયાનો ડોઝ આપ્યો" },
  "auditUpdatedfieldhealth": { en: "Updated field health", hi: "खेत के स्वास्थ्य को अपडेट किया", gu: "ખેતરનું હેલ્થ અપડેટ કર્યું" },
  "justNow": { en: "Just now", hi: "अभी", gu: "हमणां ज" },
  "ago": { en: "ago", hi: "पहले", gu: "પહેલા" },
  "krishiSetu": { en: "KrishiSetu", hi: "कृषिसेतु", gu: "કૃષિસેતુ" },

  "soilMatrix": {
    "title": { en: "Soil Nutrient Matrix", hi: "मिट्टी पोषक तत्व मैट्रिक्स", gu: "માટી પોષક તત્વો મેટ્રિક્સ" },
    "labAnalysis": { en: "Real-time Lab Analysis • Live", hi: "वास्तविक समय प्रयोगशाला विश्लेषण • लाइव", gu: "રીયલ-ટાઇમ લેબ એનાલિસિસ • લાઇવ" },
    "detailedScan": { en: "Detailed Scan", hi: "विस्तृत स्कैन", gu: "વિગતવાર સ્કેન" },
    "nitrogen": { en: "Nitrogen (N)", hi: "नाइट्रोजन (N)", gu: "નાઇટ્રોજન (N)" },
    "phosphorus": { en: "Phosphorus (P)", hi: "फास्फोरस (P)", gu: "ફોસ્ફરસ (P)" },
    "potassium": { en: "Potassium (K)", hi: "पोटेशियम (K)", gu: "પોટેશિયમ (K)" },
    "organicMatter": { en: "Organic Matter", hi: "जैविक पदार्थ", gu: "જૈવિક પદાર્થ" },
    "moisture": { en: "Moisture Level", hi: "नमी का स्तर", gu: "ભેજનું સ્તર" }
  },
  "saveSoil": {
    "heroTitle": { en: "Save Soil, Reduce Global Warming", hi: "मिट्टी बचाएं, ग्लोबल वार्मिंग कम करें", gu: "માટી બચાવો, ગ્લોબલ વોર્મિંગ ઘટાડો" },
    "heroSub": { en: "Climate smart farming for sustainable soil health", hi: "सतत मिट्टी के स्वास्थ्य के लिए जलवायु स्मार्ट खेती", gu: "ટકાઉ માટીના સ્વાસ્થ્ય માટે ક્લાયમેટ સ્માર્ટ ખેતી" },
    "startSaving": { en: "Start Saving Soil", hi: "मिट्टी बचाना शुरू करें", gu: "માટી બચાવવાનું શરૂ કરો" },
    "featureCarbon": {
      "title": { en: "Carbon Footprint Calculator", hi: "कार्बन फुटप्रिंट कैलकुलेटर", gu: "કાર્બન ફૂટપ્રિન્ટ કેલ્ક્યુલેટર" },
      "desc": { en: "Calculate and reduce your farm's carbon emissions.", hi: "अपने खेत के कार्बन उत्सर्जन की गणना करें और उसे कम करें।", gu: "તમારા ફાર્મના કાર્બન ઉત્સર્જનની ગણતરી કરો અને તેને ઘટાડો." }
    },
    "featureHealthMeter": {
      "title": { en: "Soil Health Meter", hi: "मिट्टी स्वास्थ्य मीटर", gu: "સોઈલ હેલ્થ મીટર" },
      "desc": { en: "Monitor organic carbon and fertility levels in real-time.", hi: "वास्तविक समय में जैविक कार्बन और उर्वरता स्तर की निगरानी करें।", gu: "રીયલ-ટાઇમમાં ઓર્ગેનિક કાર્બન અને ફર્ટિલિટી લેવલ મોનિટર કરો." }
    },
    "featureIrrigation": {
      "title": { en: "Smart Irrigation", hi: "स्मार्ट सिंचाई", gu: "સ્માર્ટ સિંચાઈ" },
      "desc": { en: "Save water and protect crops from heat stress.", hi: "पानी बचाएं और फसलों को गर्मी के तनाव से बचाएं।", gu: "પાણી બચાવો અને પાકને ગરમીથી બચાવો." }
    },
    "featurePractices": {
      "title": { en: "Sustainable Practices", hi: "सतत अभ्यास", gu: "ટકાઉ પદ્ધતિઓ" },
      "desc": { en: "Adopt regenerative techniques for better soil longevity.", hi: "बेहतर मिट्टी की दीर्घायु के लिए पुनर्योजी तकनीक अपनाएं।", gu: "માટીના સારા આયુષ્ય માટે રિજનરેટિવ તકનીકો અપનાવો." }
    },
    "healthScore": { en: "Soil Health Score", hi: "मिट्टी स्वास्थ्य स्कोर", gu: "સોઈલ હેલ્થ સ્કોર" },
    "carbonReduction": { en: "Carbon Reduction", hi: "कार्बन की कमी", gu: "કાર્બન રિડક્શન" },
    "waterSaved": { en: "Water Saved", hi: "बचाया गया पानी", gu: "પાણીની બચત" },
    "sustainabilityScore": { en: "Sustainability Score", hi: "स्थिरता स्कोर", gu: "સસ્ટેનેબિલિટી સ્કોર" },
    "aiAdvisorTitle": { en: "AI Climate Advisor", hi: "एआई जलवायु सलाहकार", gu: "AI ક્લાયમેટ એડવાઈઝર" },
    "askGlobalWarming": { en: "Ask about global warming...", hi: "ग्लोबल वार्मिंग के बारे में पूछें...", gu: "ગ્લોબલ વોર્મિંગ વિશે પૂછો..." },
    "saveSoilNow": { en: "SAVE SOIL NOW", hi: "मिट्टी अब बचाएं", gu: "માટી અત્યારે બચાવો" },
    "modalTitle": { en: "Sustainable Farming Checklist", hi: "सतत खेती चेकलिस्ट", gu: "ટકાઉ ખેતીની ચેકલીસ્ટ" },
    "checklist": {
      "fertilizers": { en: "Reduce chemical fertilizers", hi: "रासायनिक उर्वरकों को कम करें", gu: "રાસાયણિક ખાતરો ઘટાડો" },
      "coverCrops": { en: "Plant cover crops", hi: "कवर फसलें लगाएं", gu: "કવર પાક વાવો" },
      "dripIrrigation": { en: "Drip irrigation", hi: "ड्रिप सिंचाई", gu: "ટપક સિંચાઈ" },
      "compost": { en: "Organic compost", hi: "जैविक खाद", gu: "જૈવિક ખાતર" },
      "tillage": { en: "Reduce tillage", hi: "जुताई कम करें", gu: "ખેડાણ ઘટાડો" },
      "agroforestry": { en: "Agroforestry", hi: "कृषि वानिकी", gu: "એગ્રોફોરેસ્ટ્રી" }
    }
  }
};

export function getSavedLanguage(): Language {
  return (localStorage.getItem('lang') as Language) || 'EN';
}

export function saveLanguage(lang: Language) {
  localStorage.setItem('lang', lang);
}

export function t(key: string, currentLang: Language = 'EN'): string {
  if (!key) return '';
  const parts = key.split('.');
  let result: any = translations;
  
  // Normal lookup
  let found = true;
  for (const part of parts) {
    if (result && result[part] !== undefined) {
      result = result[part];
    } else {
      found = false;
      break;
    }
  }

  // Fallback for flat keys or normalized keys
  if (!found) {
    // try exact flat key
    if (translations[key]) {
      result = translations[key];
    } else {
      // try normalized lookup (lowercase, no spaces/dots)
      const normalizedKey = key.toLowerCase().replace(/[\s._-]/g, '');
      
      // 1. Check keys
      const flatKey = Object.keys(translations).find(k => 
        k.toLowerCase().replace(/[\s._-]/g, '') === normalizedKey
      );
      
      if (flatKey) {
        result = translations[flatKey];
      } else {
        // 2. Check if key is an English value (useful for dynamic action items)
        const matchedValue = Object.values(translations).find(val => 
          val && typeof val === 'object' && val.en && 
          val.en.toLowerCase().replace(/[\s._-]/g, '') === normalizedKey
        );
        
        if (matchedValue) {
          result = matchedValue;
        } else {
          return key;
        }
      }
    }
  }

  if (typeof result === 'object' && result !== null) {
    const lang = currentLang.toLowerCase();
    return result[lang] || result['en'] || key;
  }
  
  return typeof result === 'string' ? result : key;
}
