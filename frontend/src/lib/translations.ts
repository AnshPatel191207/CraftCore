export type Language = 'EN' | 'HI' | 'GU';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'EN', label: 'English', nativeLabel: 'English' },
  { code: 'HI', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'GU', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
];

export const translations: Record<string, any> = {
  // Navigation & General
  "dashboard": { en: "Dashboard", hi: "डैशबोर्ड", gu: "ડેશબોર્ડ" },
  "fertilizer": { en: "Fertilizer", hi: "उर्वरक", gu: "ખાતર" },
  "advisory": {
    en: "Advisory", hi: "सलाह", gu: "સલાહ",
    "rainfall": {
      "title": { en: "Heavy Rainfall Expected This Week", hi: "इस सप्ताह भारी वर्षा की संभावना", gu: "આ અઠવાડીયે ભારે વરસાદની શકયતા" },
      "desc": { en: "Heavy rainfall of 80-120mm expected over the next 3 days.", hi: "अगले 3 दिनों में 80-120 मिमी भारी वर्षा की उम्मीद है।", gu: "આગામી ૩ દિવસમાં ૮૦-૧૨૦ મીમી ભારે વરસાદની અપેક્ષા છે." }
    },
    "fertilizer": { en: "Fertilizer Advisory", hi: "उर्वरक सलाह", gu: "ખાતર સલાહ" },
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
  "soilReports": { en: "Soil Reports", hi: "मिट्टी रिपोर्ट", gu: "સોઈલ રિપોર્ટસ" },
  "advisoryPortal": { en: "Advisory Portal", hi: "सलाह पोर्टल", gu: "સલાહ પોર્ટલ" },
  "settings": { en: "Settings", hi: "सेटिंग्स", gu: "સેટિંગ્સ" },
  "intelligence": { en: "Intelligence", hi: "इंटेलिजेंस", gu: "ઇન્ટેલિજન્સ" },
  "loginAccount": { en: "Sign In to KrishiSetu", hi: "KrishiSetu में साइन इन करें", gu: "KrishiSetu માં સાઇન ઇન કરો" },
  "signin": { en: "Sign In", hi: "साइन इन", gu: "સાઇન ઇન" },
  "logout": { en: "Logout", hi: "लॉगआउट", gu: "લોગઆઉટ" },
  "tagline": { en: "AI Powered Smart Farming & Soil Intelligence", hi: "एआई संचालित स्मार्ट खेती और मिट्टी बुद्धिमत्ता", gu: "AI સંચાલિત સ્માર્ટ ખેતી અને સોઈલ ઇન્ટેલિજન્સ" },
  "saveSoilAI": { en: "SAVE SOIL AI", hi: "सेव सॉइल AI", gu: "સેવિ સોઈલ AI" },
  "mainCommand": { en: "Main Command", hi: "मुख्य कमान", gu: "મુખ્ય કમાન" },
  "globalSync": { en: "Global Sync", hi: "ग्लोबल सिंक", gu: "ગ્લોબલ સિંક" },
  "totalArea": { en: "total area", hi: "कुल क्षेत्र", gu: "કુલ વિસ્તાર" },
  "live": { en: "LIVE", hi: "लाइव", gu: "લાઇવ" },
  "receivingLiveSensorData": { en: "Receiving live sensor data from", hi: "से लाइव सेंसर डेटा प्राप्त हो रहा है", gu: "થી લાઇવ સેન્સર ડેટા મળી રહ્યો છે" },
  "mainHub": { en: "Main Hub", hi: "मुख्य हब", gu: "મુખ્ય હબ" },
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
  "nov": { en: "Nov", hi: "नंबर", gu: "નવેમ્બર" },
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
  "growSmarterWithAI": { en: "Grow Smarter with KrishiSetu AI", hi: "KrishiSetu AI के साथ बेहतर खेती करें", gu: "KrishiSetu AI સાથે સ્માર્ટ ખેતી કરો" },
  "getPersonalizedYield": { en: "Get personalized yield optimization strategies.", hi: "व्यक्तिगत उपज अनुकूलन रणनीतियां प्राप्त करें।", gu: " વૈયક્તિકૃત ઉપજ ઓપ્ટિમાઇઝેશન વ્યૂહરચનાઓ મેળવો." },
  "openAIAdvisor": { en: "Open KrishiSetu AI", hi: "KrishiSetu AI खोलें", gu: "KrishiSetu AI ખોલો" },
  "GreenValleyFarm": { en: "Green Valley Farm", hi: "ग्रीन वैली फार्म", gu: "ગ્રીન વેલી ફાર્મ" },
  "AgriTech": { en: "AgriTech", hi: "एग्रीटेक", gu: "એગ્રીટેક" },
  "readyToOptimize": { en: "Ready to Optimize Your Yield?", hi: "अपनी उपज को अनुकूलित करने के लिए तैयार हैं?", gu: "તમારી ઉપજ વધારવા માટે તૈયાર છો?" },
  "getStartedFree": { en: "Get Started Free", hi: "मुफ्त में शुरू करें", gu: "મફતમાં શરૂ કરો" },

  // Stats
  "cropHealth": { en: "Crop Health", hi: "फसल स्वास्थ्य", gu: "પાકનું સ્વાસ્થ્ય" },
  "activeArea": { en: "Active Area", hi: "सक्रिय क्षेत्र", gu: "સક્રિય વિસ્તાર" },
  "yieldEst": { en: "Yield Est.", hi: "उपज अनुमान", gu: "ઉપજ અંદાજ" },
  "priorityAlerts": { en: "Priority Alerts", hi: "प्राथमिकता अलर्ट", gu: "પ્રાયોરિટી એલર્ટ" },
  "systemNominal": { en: "System Nominal", hi: "सिस्टम सामान्य", gu: "સિસટમ નોર્મલ" },
  "digitalMapping": { en: "Digital Mapping", hi: "डिजिटल मैपिंग", gu: "ડિજિટલ મેપિંગ" },
  "forecastQ1": { en: "Forecast Q1", hi: "पूर्वानुमान Q1", gu: "પૂર્વસૂચન Q1" },
  "actionRequired": { en: "Action Required", hi: "कार्रवाई आवश्यक", gu: "એક્શન જરૂરી" },

  // Bento Grid
  "topAdvisory": { en: "Top Advisory", hi: "शीर्ष सलाह", gu: "ટોપ એડવાઇઝરી" },
  "wheatSowing": { en: "Wheat Sowing", hi: "गेहूं की बुवाई", gu: "ઘઉંનું વાવેતર" },
  "plantingWindow": { en: "Planting Window", hi: "रोपण अवधि", gu: "વાવેતર સમયગાળો" },
  "healthIndex": { en: "Health Index", hi: "स्वास्थ्य सूचकांक", gu: "હેલ્થ ઇન્ડેક્સ" },
  "environmentStable": { en: "Environment Stable", hi: "पर्यावरण स्थिर", gu: "પર્યાવરણ સ્થિર" },
  "soilChemistry": { en: "Soil Chemistry", hi: "मिट्टी रसायन", gu: "માટીનું રસાયણ" },
  "neutral": { en: "Neutral", hi: "तटस्थ", gu: "તટસ્થ" },
  "normalRange": { en: "Normal Range", hi: "सामान्य श्रेणी", gu: "સામાન્ય રેન્જ" },
  "intelligenceLog": { en: "Intelligence Log", hi: "इंटेलिजेंस लॉग", gu: "ઇન્ટેલિજન્સ લોગ" },
  "liveSubmission": { en: "Live Submission Stream", hi: "लाइव सबमिशन स्ट्रीम", gu: "લાઇવ સબમિશન સ્ટ્રીમ" },
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
  "headline": { en: "Precision Agriculture for the Modern Farmer", hi: "आधुनिक किसानों के लिए सटीक कृषि", gu: "આધૂનિક ખેડૂતો માટે સચોટ ખેતી" },
  "transformComplex": { en: "Transform complex soil reports into simple, actionable insights.", hi: "जटिल मिट्टी रिपोर्ट को सरल, व्यावहारिक जानकारी में बदलें।", gu: "સોઈલ રિપોર્ટસને સરળ અને અસરકારક બનાવો." },
  "builtForIndian": { en: "Built for Bharat, powered by AI.", hi: "भारत के लिए निर्मित, एआई द्वारा संचालित।", gu: "ભારત માટે નિર્મિત, AI દ્વારા સંચાલિત." },
  "soilIntelEngine": { en: "Soil Intel Engine", hi: "मिट्टी इंटेल इंजन", gu: "માટી ઇન્ટેલ એન્જિન" },
  "soilIntelDesc": { en: "Deep analysis of 12+ nutrients with personalized correction strategies.", hi: "व्यक्तिगत सुधार रणनीतियों के साथ 12+ पोषक तत्वों का गहरा विश्लेषण।", gu: "વૈયક્તિકૃત વ્યૂહરચનાઓ સાથે ૧૨+ પોષક તત્વોનું ઊંડું વિશ્લેષણ." },
  "multiInputAnalysis": { en: "Multi-input Analysis", hi: "बहु-इनपुट विश्लेषण", gu: "મલ્ટી-ઇનપુટ વિશ્લેષણ" },
  "multiInputDesc": { en: "Upload PDFs, scan physical reports, or input data manually with ease.", hi: "पीडीएफ अपलोड करें, भौतिक रिपोर्ट स्कैन करें, या आसानी से मैनुअल रूप से डेटा इनपुट करें।", gu: "PDF અપલોડ કરો, રિપોર્ટસ સ્કેન કરો અથવા સરળતાથી ડેટા ઇનપુટ કરો." },
  "plainLanguageGuidance": { en: "Plain Language Guidance", hi: "सरल भाषा मार्गदर्शन", gu: "સરળ ભાષા માર્ગદર્શન" },
  "plainLanguageDesc": { en: "Get prescriptions in your local language that any farmer can understand.", hi: "अपनी स्थानीय भाषा में नुस्खे प्राप्त करें जिन्हें कोई भी किसान समझ सके।", gu: "તમારી સ્થાનિક ભાષામાં સમજણ મેળવો." },
  "uploadData": { en: "Upload Data", hi: "डेटा अपलोड करें", gu: "ડેટા અપલોડ કરો" },
  "uploadDataDesc": { en: "Drop your soil test report or enter values manually.", hi: "अपनी मिट्टी परीक्षण रिपोर्ट डालें या मैनुअल रूप से मान दर्ज करें।", gu: "રિપોર્ટ અપલોડ કરો અથવા મેન્યુઅલ ડેટા એન્ટર કરો." },
  "aiAnalysis": { en: "AI Analysis", hi: "एआई विश्लेषण", gu: "AI એનાલિસિસ" },
  "aiAnalysisDesc": { en: "Our neural engine processes your data and cross-references crop needs.", hi: "हमारा न्यूरल इंजन आपके डेटा को प्रोसेस करता है और फसल की जरूरतों की जांच करता है।", gu: "અમારું એન્જિન ડેટા પ્રોસેસ કરે છે અને જરૂરિયાત તપાસે છે." },
  "getGuidance": { en: "Get Guidance", hi: "मार्गदर्शन प्राप्त करें", gu: "માર્ગદર્શન મેળવો" },
  "getGuidanceDesc": { en: "Receive precise fertilizer and crop recommendations instantly.", hi: "तुरंत सटीक उर्वरक और फसल सिफारिशें प्राप्त करें।", gu: "તરત જ ખાતર અને પાકની ભલામણો મેળવો." },
  "reportsAnalysed": { en: "Reports Analysed", hi: "विश्लेषण की गई रिपोर्ट", gu: "એનાાાઇઝ્ડ રિપોર્ટસ" },
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
  "portalTitle": { en: "Advisory Portal", hi: "सलाह पोर्टल", gu: "એડવાઇઝરી પોર્ટલ" },
  "portalSub": { en: "Real-time AI-powered guidance for your specific farm needs.", hi: "आपके खेत की विशिष्ट आवश्यकताओं के लिए वास्तविक समय में एआई-संचालित मार्गदर्शन।", gu: "તમારી જરૂરિયાતો માટે રિયલ-ટાઇમ AI-સંચાલિત માર્ગદર્શન." },
  "filterAll": { en: "All Advisories", hi: "सभी सलाह", gu: "બધી સલાહ" },
  "catWeather": { en: "Weather", hi: "मौसम", gu: "હવામાન" },
  "catPest": { en: "Pests", hi: "कीट", gu: "જીવાત" },
  "catCrop": { en: "Crop Care", hi: "फसल देखभाल", gu: "પાકની સંભાળ" },
  "catSoil": { en: "Soil", hi: "मिट्टी", gu: "માટી" },
  "catMarket": { en: "Market", hi: "बाज़ार", gu: "બજાર" },
  "sevLow": { en: "Low Priority", hi: "कम प्राथमिकता", gu: "ઓછી પ્રથમીકતા" },
  "sevMedium": { en: "Medium Priority", hi: "सामान्य प्राथमिकता", gu: "સામાન્ય પ્રથમીકતા" },
  "sevHigh": { en: "High Priority", hi: "उच्च प्राथमिकता", gu: "ઉચ્ચ પ્રથમીકતા" },
  "sevCritical": { en: "Critical Alert", hi: "महत्वपूर्ण अलर्ट", gu: "ક્રિટિકલ એલર્ટ" },
  "actionItems": { en: "Action Items", hi: "कार्य सूची", gu: "એક્શન આઇટમ્સ" },
  "impactZone": { en: "Impact Zone", hi: "प्रभाव क्षेत्र", gu: "અસર વિસ્તાર" },
  "category": { en: "Category", hi: "श्रेणी", gu: "કેટેગરી" },
  "viewDetails": { en: "View Details", hi: "विवरण देखें", gu: "વિગત જુઓ" },
  "national": { en: "National", hi: "राष्ट्रीय", gu: "રાષ્ટ્રીય" },
  "searchAdvisories": { en: "Search advisories...", hi: "सलाह खोजें...", gu: "એડવાઇઝરી શોધો..." },
  "noAdvisories": { en: "No advisories found for this category.", hi: "इस श्रेणी के लिए कोई सलाह नहीं मिली।", gu: "આ કેટેગરી માટે કોઈ સલાહ મળી નથી." },

  // Weather Page
  "weatherForecast": { en: "Weather Forecast", hi: "मौसम का पूर्वानुमान", gu: "હવામાન પૂર્વસૂચન" },
  "weatherSub": { en: "7-day outlook and hourly agricultural metrics.", hi: "7-दिवसीय आउटलुक और प्रति घंटा कृषि मैट्रिक्स।", gu: "૭-દિવસના આઉટલુક અને એગ્રીકલ્ચર મેટ્રિક્સ." },
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

  "fertilizerAdvisory": {
    "title": { en: "Fertilizer Advisory System", hi: "उर्वरक सलाह प्रणाली", gu: "ખાતર સલાહ પ્રણાલી" },
    "sub": { en: "Smart recommendations for better crop yield", hi: "बेहतर फसल उपज के लिए स्मार्ट सिफारिशें", gu: "સારી ઉપજ માટે સ્માર્ટ ભલામણો" },
    "soilHealth": { en: "Soil Health Score", hi: "मिट्टी स्वास्थ्य स्कोर", gu: "જમીન આરોગ્ય સ્કોર" },
    "healthy": { en: "Healthy", hi: "स्वस्थ", gu: "સ્વસ્થ" },
    "moderate": { en: "Moderate", hi: "मध्यम", gu: "મધ્યમ" },
    "deficient": { en: "Deficient", hi: "कमी", gu: "ઊણપ" },
    "nitrogen": { en: "Nitrogen (N)", hi: "नाइट्रोजन (N)", gu: "નાઈટ્રોજન (N)" },
    "phosphorus": { en: "Phosphorus (P)", hi: "फास्फोरस (P)", gu: "ફોસ્ફરસ (P)" },
    "potassium": { en: "Potassium (K)", hi: "पोटेशियम (K)", gu: "પોટેશિયમ (K)" },
    "phLevel": { en: "pH Level", hi: "पीएच स्तर", gu: "pH સ્તર" },
    "organicCarbon": { en: "Organic Carbon", hi: "कार्बनिक कार्बन", gu: "સેન્દ્રિય કાર્બન" },
    "moisture": { en: "Moisture", hi: "नमी", gu: "ભેજ" },
    "low": { en: "Low", hi: "कम", gu: "ઓછું" },
    "optimal": { en: "Optimal", hi: "इष्टतम", gu: "યોગ્ય" },
    "high": { en: "High", hi: "उच्च", gu: "વધારે" },
    "deficiencyDetected": { en: "Nutrient Deficiency Detected", hi: "पोषक तत्वों की कमी का पता चला", gu: "પોષક તત્વોની ઊણપ જોવા મળી" },
    "recs": { en: "Fertilizer Recommendations", hi: "उर्वरक सिफारिशें", gu: "ખાતર ભલામણો" },
    "dosage": { en: "Dosage", hi: "खुराक", gu: "ડોઝ" },
    "timing": { en: "Application Timing", hi: "लगाने का समय", gu: "વાપરવાનો સમય" },
    "timeline": { en: "Application Schedule Timeline", hi: "अनुप्रयोग अनुसूची समयरेखा", gu: "ખાતર વ્યવસ્થાપન સમયરેખા" },
    "aiSuggestions": { en: "Smart Suggestions", hi: "स्मार्ट सुझाव", gu: "સ્માર્ટ સૂચનો" },
    "summary": { en: "Summary", hi: "सारांश", gu: "સારાંશ" },
    "soilQuality": { en: "Soil Quality Score", hi: "मिट्टी की गुणवत्ता", gu: "જમીનની ગુણવત્તા" },
    "totalRequired": { en: "Total Fertilizer Required", hi: "कुल आवश्यक उर्वरक", gu: "કુલ જરૂરી ખાતર" },
    "yieldImp": { en: "Estimated Yield Improvement", hi: "अनुमानित उपज सुधार", gu: "અંદાજિત ઉપજ સુધારો" },
    "impactLeaf": { en: "Reduced leaf growth", hi: "पत्तों की वृद्धि में कमी", gu: "પાંદડાની વૃદ્ધિમાં ઘટાડો" },
    "impactRoot": { en: "Stunted root development", hi: "जड़ों के विकास में रुकावट", gu: "મૂળના વિકાસમાં અવરોધ" },
    "fixUrea": { en: "Apply Urea or Ammonium Nitrate", hi: "यूरिया या अमोनियम नाइट्रेट का प्रयोग करें", gu: "યુરિયા કે એમોનિયમ નાઈट્રેટ વાપરો" },
    "fixDAP": { en: "Apply DAP or Bone Meal", hi: "डीएपी या बोन मील का प्रयोग करें", gu: "DAP કે બોન મીલ વાપરો" },
    "beforeSowing": { en: "Before sowing", hi: "बुवाई से पहले", gu: "વાવેતર પહેલા" },
    "after20Days": { en: "Top dressing after 20 days", hi: "20 दिनों के बाद टॉप ड्रेसिंग", gu: "૨૦ દિવસ પછી" },
    "after45Days": { en: "Growth support after 45 days", hi: "45 दिनों के बाद वृद्धि सहायता", gu: "૪૫ દિવસ પછી" },
    "kgAcre": { en: "kg/acre", hi: "किलो/एकड़", gu: "કિલો/એકર" },
    "suggestion1": { en: "Use organic compost to improve soil", hi: "मिट्टी सुधारने के लिए जैविक खाद का प्रयोग करें", gu: "જમીન સુધારવા માટે સેન્દ્રિય ખાતરનો ઉપયોગ કરો" },
    "suggestion2": { en: "Reduce chemical overuse", hi: "रसायनों के अत्यधिक उपयोग को कम करें", gu: "રાસાયણિક ખાતરોનો વધુ પડતો ઉપયોગ ઘટાડો" },
    "suggestion3": { en: "Try crop rotation", hi: "फसल चक्र अपनाएं", gu: "પાકની ફેરબદલી (ક્રોપ રોટેશન) અજમાવો" },
    "noSoilData": { en: "No Soil Data Found", hi: "मिट्टी का कोई डेटा नहीं मिला", gu: "સોઈલ ડેટા મળ્યો નથી" },
    "noSoilDataSub": { en: "Please upload a soil report or enter your metrics manually to view your plan.", hi: "अपनी योजना देखने के लिए कृपया मिट्टी की रिपोर्ट अपलोड करें या मैन्युअल रूप से डेटा दर्ज करें।", gu: "તમારો પ્લાન જોવા માટે કૃપા કરીને સોઈલ રિપોર્ટ અપલોડ કરો અથવા મેન્યુઅલી ડેટા એન્ટર કરો." },
    "goToSoilAnalysis": { en: "Go to Soil Analysis", hi: "मिट्टी विश्लेषण पर जाएं", gu: "સોઈલ એનાલિસિસ પર જાઓ" }
  },
  "soilHealth": {
    "title": { en: "Soil Health Analysis", hi: "मिट्टी स्वास्थ्य विश्लेषण", gu: "સોઈલ હેલ્થ એનાલિસિસ" },
    "sub": { en: "Understand your soil and improve productivity", hi: "अपनी मिट्टी को समझें और उत्पादकता में सुधार करें", gu: "તમારી જમીનને સમજો અને ઉત્પાદકતામાં સુધારો કરો" },
    "analysisReport": { en: "Analysis Report", hi: "विश्लेषण रिपोर्ट", gu: "એનાલિસિસ રિપોર્ટ" },
    "scoreLabel": { en: "Overall Soil Health", hi: "समग्र मिट्टी स्वास्थ्य", gu: "કુલ સોઈલ હેલ્થ" },
    "status": {
      "healthy": { en: "Healthy", hi: "स्वस्थ", gu: "સ્વસ્થ" },
      "moderate": { en: "Moderate", hi: "मध्यम", gu: "મધ્યમ" },
      "poor": { en: "Poor", hi: "खराब", gu: "નબળી" }
    },
    "parameters": {
      "nitrogen": { en: "Nitrogen (N)", hi: "नाइट्रोजन (N)", gu: "નાઈટ્રોજન (N)" },
      "phosphorus": { en: "Phosphorus (P)", hi: "फास्फोरस (P)", gu: "ફોસ્ફરસ (P)" },
      "potassium": { en: "Potassium (K)", hi: "पोटेशियम (K)", gu: "પોટેશિયમ (K)" },
      "ph": { en: "pH Level", hi: "पीएच स्तर", gu: "pH સ્તર" },
      "carbon": { en: "Organic Carbon", hi: "कार्बनिक कार्बन", gu: "સેન્દ્રિય કાર્બન" },
      "moisture": { en: "Moisture", hi: "नमी", gu: "ભેજ" }
    },
    "explanation": {
      "lowN": { en: "Low nitrogen may reduce crop growth", hi: "कम नाइट्रोजन फसल की वृद्धि को कम कर सकता है", gu: "ઓછું નાઈટ્રોજન પાકની વૃદ્ધિ ઘટાડી શકે છે" },
      "highPH": { en: "High pH may hinder nutrient absorption", hi: "अधिक पीएच पोषक तत्वों के अवशोषण में बाधा डाल सकता है", gu: "વધારે pH પોષક તત્વોના શોષણમાં અવરોધ લાવી શકે છે" },
      "lowOC": { en: "Low carbon reduces soil fertility", hi: "कम कार्बन मिट्टी की उर्वरता को कम करता है", gu: "ઓછું કાર્બન જમીનની ફળદ્રુપતા ઘટાડે છે" }
    },
    "imbalanceDetected": { en: "Soil Imbalance Detected", hi: "मिट्टी में असंतुलन पाया गया", gu: "જમીનમાં અસંતુલન જોવા મળ્યું" },
    "correctiveActions": { en: "Corrective Actions", hi: "सुधारात्मक उपाय", gu: "સુધારાત્મક પગલાં" },
    "smartRecs": { en: "Smart Recommendations", hi: "स्मार्ट सिफारिशें", gu: "સ્માર્ટ ભલામણો" },
    "improvementPlan": { en: "Soil Improvement Plan", hi: "मिट्टी सुधार योजना", gu: "સોઈલ ઇમ્પ્રૂવમેન્ટ પ્લાન" },
    "timeline": {
      "week1": { en: "Week 1", hi: "सप्ताह 1", gu: "અઠવાડિયું ૧" },
      "week2": { en: "Week 2", hi: "सप्ताह 2", gu: "અઠવાડિયું ૨" },
      "week4": { en: "Week 4", hi: "सप्ताह 4", gu: "અઠવાડિયું ૪" },
      "addCompost": { en: "Add organic compost", hi: "जैविक खाद डालें", gu: "સેન્દ્રિય ખાતર ઉમેરો" },
      "applyFert": { en: "Apply balanced fertilizer", hi: "संतुलित उर्वरक का प्रयोग करें", gu: "સંતુલિત ખાતર વાપરો" },
      "monitor": { en: "Monitor crop growth", hi: "फसल की वृद्धि की निगरानी करें", gu: "પાકની વૃદ્ધિનું નિરીક્ષણ કરો" }
    },
    "ux": {
      "needsN": { en: "Your soil needs more nitrogen for better crop growth", hi: "बेहतर फसल वृद्धि के लिए आपकी मिट्टी को अधिक नाइट्रोजन की आवश्यकता है", gu: "વધારે ઉપજ માટે તમારી જમીનને નાઈટ્રોજનની જરૂર છે" },
      "highPH_UX": { en: "Acidic treatment needed to balance soil pH", hi: "मिट्टी के पीएच को संतुलित करने के लिए अम्लीय उपचार की आवश्यकता है", gu: "pH સંતુલિત કરવા માટે એસિડિક ટ્રીટમેન્ટની જરૂર છે" }
    },
    "recsList": {
      "irrigation": { en: "Improve irrigation timing", hi: "सिंचाई के समय में सुधार करें", gu: "પિયત (સિંચાઇ) ના સમયમાં સુધારો કરો" },
      "organic": { en: "Add organic matter regularly", hi: "नियमित रूप से जैविक पदार्थ डालें", gu: "નિયમિતપણે સેન્દ્રિય પદાર્થો ઉમેરો" },
      "rotation": { en: "Rotate crops between seasons", hi: "मौसम के बीच फसल चक्र बदलें", gu: "ઋતુઓ વચ્ચે પાકની ફેરબદલી કરો" },
      "fertilizer": { en: "Avoid over-fertilization", hi: "अत्यधिक उर्वरक के उपयोग से बचें", gu: "વધુ પડતા ખાતરના ઉપયોગથી બચો" }
    },
    "actions": {
      "nitrogen": { en: "Add Nitrogen fertilizer", hi: "नाइट्रोजन उर्वरक डालें", gu: "નાઈટ્રોજન ખાતર ઉમેરો" },
      "phBalance": { en: "pH Balance Treatment", hi: "पीएच संतुलन उपचार", gu: "pH સંતુલન ટ્રીટમેન્ટ" }
    },
    "timelineDesc": { en: "Essential step for soil structure and long term fertility.", hi: "मिट्टी की संरचना और दीर्घकालिक उर्वरता के लिए आवश्यक कदम।", gu: "જમીનનું બંધારણ અને લાંબા ગાળાની ફળદ્રુપતા માટે આવશ્યક પગલું." }
  },
  "market": {
    "title": { en: "Market Intelligence Dashboard", hi: "बाज़ार खुफिया डैशबोर्ड", gu: "માર્કેટ ઇન્ટેલિજન્સ ડેશબોર્ડ" },
    "sub": { en: "Smart insights to maximize your farming profit", hi: "अपनी खेती के लाभ को अधिकतम करने के लिए स्मार्ट अंतर्दृष्टि", gu: "તમારા ખેતીના નફાને વધારવા માટે સ્માર્ટ આંતરદૃષ્ટિ" },
    "trendingCrops": { en: "Trending Crops in Market", hi: "बाज़ार में चर्चित फसलें", gu: "માર્કેટમાં ટ્રેન્ડિંગ પાક" },
    "demand": { en: "Market Demand", hi: "बाज़ार की मांग", gu: "બજારની માંગ" },
    "priceTrend": { en: "Price Trend", hi: "मूल्य रुझान", gu: "કિંમતમાં ફેરફાર" },
    "currentPrice": { en: "Current Price", hi: "वर्तमान मूल्य", gu: "વર્તમાન કિંમત" },
    "profitIndicator": { en: "Profit Indicator", hi: "लाभ सूचक", gu: "નફાનું સૂચક" },
    "high": { en: "High", hi: "उच्च", gu: "વધારે" },
    "medium": { en: "Medium", hi: "मध्यम", gu: "મધ્યમ" },
    "low": { en: "Low", hi: "कम", gu: "ઓછું" },
    "increasing": { en: "Increasing", hi: "बढ़ रहा है", gu: "વધી રહી છે" },
    "decreasing": { en: "Decreasing", hi: "घट रहा है", gu: "ઘટી રહી છે" },
    "profitCalc": { en: "Profit Calculator", hi: "लाभ कैलकुलेटर", gu: "નફાનું કેલ્ક્યુલેટર" },
    "cropType": { en: "Crop Type", hi: "फसल का प्रकार", gu: "પાકનો પ્રકાર" },
    "landArea": { en: "Land Area (Acre)", hi: "भूमि क्षेत्र (एकड़)", gu: "જમીનનો વિસ્તાર (એકર)" },
    "expectedYield": { en: "Expected Yield (Quintal)", hi: "अपेक्षित उपज (क्विंटल)", gu: "અપેક્ષિત ઉપજ (ક્વિન્ટલ)" },
    "marketPrice": { en: "Market Price (₹/Quintal)", hi: "बाज़ार मूल्य (₹/क्विंटल)", gu: "બજાર ભાવ (₹/ક્વિન્ટલ)" },
    "totalRevenue": { en: "Total Revenue", hi: "कुल राजस्व", gu: "કુલ આવક" },
    "estimatedCost": { en: "Estimated Cost", hi: "अनुमानित लागत", gu: "અંદાજિત ખર્ચ" },
    "netProfit": { en: "Net Profit", hi: "शुद्ध लाभ", gu: "ચોખ્ખો નફો" },
    "priceTable": { en: "Market Price Table", hi: "बाज़ार मूल्य तालिका", gu: "બજાર ભાવ પત્રક" },
    "lastWeek": { en: "Last Week", hi: "पिछले सप्ताह", gu: "ગયા અઠવાડિયે" },
    "trend": { en: "Trend", hi: "रुझान", gu: "ટ્રેન્ડ" },
    "sellSmartly": { en: "Sell Your Crops Smartly", hi: "अपनी फसलें समझदारी से बेचें", gu: "તમારો પાક સ્માર્ટ રીતે વેચો" },
    "bestTimeToSell": { en: "Best time to sell", hi: "बेचने का सही समय", gu: "વેચવાનો શ્રેષ્ઠ સમય" },
    "suggestedMarkets": { en: "Suggested Markets", hi: "सुझाए गए बाज़ार", gu: "સૂચિત બજારો" },
    "listForSale": { en: "List Your Crop for Sale", hi: "बिक्री के लिए अपनी फसल सूचीबद्ध करें", gu: "વેચાણ માટે તમારા પાકની યાદી બનાવો" },
    "priceTrendGraph": { en: "Price Trend Graph", hi: "मूल्य रुझान ग्राफ", gu: "કિંમતના ફેરફારનો ગ્રાફ" },
    "aiAdvisor": { en: "KrishiSetu Market AI", hi: "KrishiSetu बाज़ार AI", gu: "KrishiSetu માર્કેટ AI" },
    "askAdvisor": { en: "Ask about market trends", hi: "बाज़ार के रुझानों के बारे में पूछें", gu: "બજારના ટ્રેન્ડ વિશે પૂછો" },
    "smartInsights": { en: "Smart Insights", hi: "स्मार्ट अंतर्दृष्टि", gu: "સ્માર્ટ આંતરદૃષ્ટિ" },
    "cottonRising": { en: "Cotton demand is rising this month", hi: "इस महीने कपास की मांग बढ़ रही है", gu: "આ મહિને કપાસની માંગ વધી રહી છે" },
    "wheatIncreasing": { en: "Wheat prices expected to increase next week", hi: "अगले सप्ताह गेहूं की कीमतों में वृद्धि की उम्मीद है", gu: "આગામી સપ્તાહે ઘઉંના ભાવમાં વધારો થવાની ધારણા છે" },
    "quintal": { en: "Quintal", hi: "क्विंटल", gu: "ક્વિન્ટલ" },
    "rupeeQuintal": { en: "₹/quintal", hi: "₹/क्विंटल", gu: "₹/ક્વિન્ટલ" }
  },
  "crops": {
    "wheat": { en: "Wheat", hi: "गेहूं", gu: "ઘઉં" },
    "rice": { en: "Rice", hi: "चावल", gu: "ચોખા" },
    "cotton": { en: "Cotton", hi: "कपास", gu: "કપાસ" },
    "maize": { en: "Maize", hi: "मक्का", gu: "મકાઈ" },
    "soybean": { en: "Soybean", hi: "सोयाबीन", gu: "સોયાબીન" }
  },

  "textureSoil": { en: "Texture", hi: "बनावट", gu: "ટેક્સચર" },
  "soil": { en: "Soil", hi: "मिट्टी", gu: "માટી" },
  "recs_ai": { en: "AI Recommendations", hi: "एआई सिफारिशें", gu: "AI ભલામણો" },
  "kg/ha": { en: "kg/ha", hi: "किग्रा/हेक्टेयर", gu: "કિગ્રા/હેક્ટર" },
  "%": { en: "%", hi: "%", gu: "%" },

  // Mock Data Items
  "heavyRainTitle": { en: "Heavy Rainfall Expected This Week", hi: "इस सप्ताह भारी वर्षा की संभावना", gu: "આ અઠવાડીયે ભારે વરસાદની આગાહી" },
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
  "applyFungicide": { en: "Apply preventive fungicide", hi: "निवारक कवकनाशी लगाएं", gu: "ફૂગનાશકનો ઉપયોગ કરો" },
  "scoutFields": { en: "Scout fields every 2-3 days", hi: "हर 2-3 दिनों में खेतों की निगरानी करें", gu: "દર ૨-૩ દિવસે ખેતરની તપાસ કરો" },
  "checkLeaves": { en: "Look for window-pane damage on leaves", hi: "पत्तियों पर क्षति के निशान देखें", gu: "પાંદડા પર નુકસાનના નિશાન તપાસો" },
  "applyLiming": { en: "Apply agricultural lime at 2 tons/acre", hi: "2 टन/एकड़ की दर से कृषि चूना लगाएं", gu: "એકર દીઠ ૨ ટન ચૂનાનો ઉપયોગ કરો" },
  "reviewInventory": { en: "Review current corn inventory", hi: "वर्तमान मकई इन्वेंट्री की समीक्षा करें", gu: "મકાઈના સ્ટોકનું નિરીક્ષણ કરો" },

  "cropCorn": { en: "Corn (Maize)", hi: "मकई", gu: "મકાઈ" },
  "cropWinter": { en: "Winter Wheat", hi: "रबी गेहूं", gu: "શિયાળુ ઘઉં" },
  "cropSoybeans": { en: "Soybeans", hi: "सोयाबीन", gu: "સોયાબીન" },
  "cropRice": { en: "Rice (Paddy)", hi: "चावल (धान)", gu: "ચોખા (ડાંગર)" },
  
  "stageTasseling": { en: "Tasseling", hi: "फूल आना", gu: "તસલિંગ" },
  "stageTillering": { en: "Tillering", hi: "फुटाવ", gu: "ટિલરિંગ" },
  "stagePodFill": { en: "Pod Fill", hi: "फली भरना", gu: "પોડ ફીલ" },
  "stageHeading": { en: "Heading", hi: "निकलना", gu: "હેડિંગ" },

  "auditUploadedsoilreport": { en: "Uploaded soil report", hi: "मिट्टी की रिपोर्ट अपलोड की", gu: "સોઈલ રિપોર્ટ અપલોડ કર્યો" },
  "auditRequestedcropadvice": { en: "Requested crop advice", hi: "फसल सलाह का अनुरोध किया", gu: "પાકની સલાહ માંગી" },
  "auditAppliedureadosage": { en: "Applied urea dosage", hi: "यूरिया की खुराक लागू की", gu: "યુરિયાનો ડોઝ આપ્યો" },
  "auditUpdatedfieldhealth": { en: "Updated field health", hi: "खेत के स्वास्थ्य को अपडेट किया", gu: "ખેતરનું હેલ્થ અપડેટ કર્યું" },
  "justNow": { en: "Just now", hi: "अभी", gu: "હમણાં જ" },
  "ago": { en: "ago", hi: "पहले", gu: "પહેલા" },
  "krishiSetu": { en: "KrishiSetu", hi: "कृषिसेतु", gu: "કૃષિસેતુ" },

  "soilMatrix": {
    "title": { en: "Soil Nutrient Matrix", hi: "मिट्टी पोषक तत्व मैट्रिक्स", gu: "માટી પોષક તત્વો મેટ્રિક્સ" },
    "labAnalysis": { en: "Real-time Lab Analysis • Live", hi: "वास्तविक समय प्रयोगशाला विश्लेषण • लाइव", gu: "રીયલ-ટાઇમ લેબ એનાલિસિસ • લાઇવ" },
    "detailedScan": { en: "Detailed Scan", hi: "विस्तृत स्कैन", gu: "વિગતવાર સ્કેન" },
    "nitrogen": { en: "Nitrogen (N)", hi: "नाइट्रोजन (N)", gu: "નાઈટ્રોજન (N)" },
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
    "aiAdvisorTitle": { en: "AI Climate Advisor", hi: "एआई जलवायु सलाहकार", gu: "AI ક્લાયમેટ એડવાઇઝર" },
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
    },
    "expertSupport": { en: "Expert Support", hi: "विशेषज्ञ सहायता", gu: "નિષ્ણાત સપોર્ટ" }
  },
  "analyzer": {
    "title": { en: "Plant and Crop Analyzer", hi: "पौधा और फसल विश्लेषक", gu: "છોડ અને પાક વિશ્લેષક" },
    "sub": { en: "Use separate analysis cards for plants and crops. Each card includes identification, disease detection, and treatment suggestions with its own API flow.", hi: "पौधों और फसलों के लिए अलग-अलग विश्लेषण कार्ड का उपयोग करें। प्रत्येक कार्ड में अपनी स्वयं की एपीआई प्रवाह के साथ पहचान, बीमारी का पता लगाने और उपचार के सुझाव शामिल हैं।", gu: "છોડ અને પાક માટે અલગ વિશ્લેષણ કાર્ડનો ઉપયોગ કરો. દરેક કાર્ડમાં તેની પોતાની API પ્રક્રિયા સાથે ઓળખ, રોગની તપાસ અને સારવારના સૂચનોનો સમાવેશ થાય છે." },
    "plantBadge": { en: "PLANT.ID ANALYZER", hi: "PLANT.ID विश्लेषक", gu: "PLANT.ID વિશ્લેષક" },
    "plantTitle": { en: "Plant Analysis Card", hi: "पौधा विश्लेषण कार्ड", gu: "છોડ વિશ્લેષણ કાર્ડ" },
    "plantSub": { en: "Uses the Plant.id API key for plant identification and plant disease checks.", hi: "पौधे की पहचान और रोग की जांच के लिए Plant.id API कुंजी का उपयोग करता है।", gu: "છોડની ઓળખ અને રોગની તપાસ માટે Plant.id API કીનો ઉપયોગ કરે છે." },
    "cropTitle": { en: "Crop Analysis Card", hi: "फसल विश्लेषण कार्ड", gu: "પાક વિશ્લેષણ કાર્ડ" },
    "cropSub": { en: "Uses the Crop API key for crop identification and crop disease checks.", hi: "फसल की पहचान और रोग की जांच के लिए Crop API कुंजी का उपयोग करता है।", gu: "પાકની ઓળખ અને રોગની તપાસ માટે Crop API કીનો ઉપયોગ કરે છે." },
    "supports": { en: "Supports JPG, PNG and WEBP images", hi: "JPG, PNG और WEBP छवियों का समर्थन करता है", gu: "JPG, PNG અને WEBP ઈમેજો સપોર્ટ કરે છે" },
    "uploadPlant": { en: "UPLOAD PLANT IMAGE", hi: "पौधे की छवि अपलोड करें", gu: "છોડની તસવીર અપલોડ કરો" },
    "uploadCrop": { en: "UPLOAD CROP IMAGE", hi: "फसल की छवि अपलोड करें", gu: "પાકની તસવીર અપલોડ કરો" },
    "uploadDesc": { en: "Tap to browse and choose a clear leaf, plant, or crop photo.", hi: "ब्राउज़ करने और स्पष्ट पत्ती, पौधे या फसल की तस्वीर चुनने के लिए टैप करें।", gu: "બ્રાઉઝ કરવા માટે ટેપ કરો અને સ્પષ્ટ પાંદડું, છોડ અથવા પાકની તસવીર પસંદ કરો." },
    "analyzePlant": { en: "ANALYZE PLANT", hi: "पौधे का विश्लेषण करें", gu: "છોડનું વિશ્લેષણ કરો" },
    "checkPlantDisease": { en: "CHECK PLANT DISEASE", hi: "पौधे की बीमारी की जाँच करें", gu: "છોડના રોગની તપાસ કરો" },
    "analyzeCrop": { en: "ANALYZE CROP", hi: "फसल का विश्लेषण करें", gu: "પાકનું વિશ્લેષણ કરો" },
    "checkCropDisease": { en: "CHECK CROP DISEASE", hi: "फसल की बीमारी की जाँच करें", gu: "પાકના રોગની તપાસ કરો" },
    "plantResult": { en: "PLANT RESULT", hi: "पौधा परिणाम", gu: "છોડનું પરિણામ" },
    "plantDiseaseResult": { en: "PLANT DISEASE RESULT", hi: "पौधा रोग परिणाम", gu: "છોડના રોગનું પરિણામ" },
    "cropResult": { en: "CROP RESULT", hi: "फसल परिणाम", gu: "પાકનું પરિણામ" },
    "cropDiseaseResult": { en: "CROP DISEASE RESULT", hi: "फसल रोग परिणाम", gu: "પાકના રોગનું પરિણામ" },
    "placeholderPlant": { en: "Plant identification results will appear here.", hi: "पौधे की पहचान के परिणाम यहां दिखाई देंगे।", gu: "છોડની ઓળખના પરિણામો અહીં દેખાશે." },
    "placeholderPlantDisease": { en: "Plant disease results will appear here.", hi: "पौधे की बीमारियों के परिणाम यहां दिखाई देंगे।", gu: "છોડના રોગના પરિણામો અહીં દેખાશે." },
    "placeholderCrop": { en: "Crop identification results will appear here.", hi: "फसल पहचान के परिणाम यहां दिखाई देंगे।", gu: "પાકની ઓળખના પરિણામો અહીં દેખાશે." },
    "placeholderCropDisease": { en: "Crop disease results will appear here.", hi: "फसल रोग के परिणाम यहां दिखाई देंगे।", gu: "પાકના રોગના પરિણામો અહીં દેખાશે." },
    "analyzing": { en: "Analyzing...", hi: "विश्लेषण कर रहा है...", gu: "વિશ્લેષણ કરી રહ્યું છે..." },
    "pleaseUpload": { en: "Please upload an image first", hi: "कृपया पहले एक छवि अपलोड करें", gu: "કૃપા કરીને પહેલા તસવીર અપલોડ કરો" },
    "confidence": { en: "Confidence", hi: "आत्मविश्वास", gu: "વિશ્વાસ" },
    "probability": { en: "Probability", hi: "संभावना", gu: "સંભાવના" },
    "scientificName": { en: "Scientific Name", hi: "वैज्ञानिक नाम", gu: "વૈજ્ઞાનિક નામ" },
    "reason": { en: "Reason", hi: "कारण", gu: "કારણ" },
    "solution": { en: "Solution", hi: "समाधान", gu: "સમાધાન" },
    "mock": {
      "tomato": { en: "Tomato Plant", hi: "टमाटर का पौधा", gu: "ટમેટાનો છોડ" },
      "tomatoDesc": { en: "Common vegetable plant used in farming", hi: "खेती में उपयोग किया जाने वाला सामान्य सब्जी का पौधा", gu: "ખેતીમાં ઉપયોગમાં લેવાતો સામાન્ય શાકભાજીનો છોડ" },
      "leafSpot": { en: "Leaf Spot", hi: "लीफ स्पॉट", gu: "લીફ સ્પોટ" },
      "leafSpotReason": { en: "Caused by fungal infection due to high humidity", hi: "उच्च आर्द्रता के कारण कवक संक्रमण से होता है", gu: "વધારે પડતા ભેજને કારણે ફૂગના ચેપથી થાય છે" },
      "leafSpotSolution": { en: "Use fungicide spray and avoid overwatering", hi: "कवकनाशी स्प्रे का उपयोग करें और अधिक पानी देने से बचें", gu: "ફૂગનાશક સ્પ્રેનો ઉપયોગ કરો અને વધારે પાણી પીવડાવવાનું ટાળો" },
      "wheat": { en: "Wheat", hi: "गेंहू", gu: "ઘઉં" },
      "wheatDesc": { en: "Widely grown cereal crop", hi: "व्यापक रूप से उगाई जाने वाली अनाज की फसल", gu: "વ્યાપકપણે ઉગાડવામાં આવતો અનાજ પાક" },
      "rust": { en: "Rust Disease", hi: "रस्ट रोग", gu: "રસ્ટ રોગ" },
      "rustReason": { en: "Caused by fungal spores in moist conditions", hi: "नम स्थितियों में कवक बीजाणुओं के कारण होता है", gu: "ભેજવાળી સ્થિતિમાં ફૂગના બીજકણને કારણે થાય છે" },
      "rustSolution": { en: "Apply sulfur-based fungicide and monitor crops", hi: "सल्फर आधारित कवकनाशी लगाएं और फसलों की निगरानी करें", gu: "સલ્ફર આધારિત ફૂગનાશકનો ઉપયોગ કરો અને પાકની દેખરેખ રાખો" }
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
