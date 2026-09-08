import React, { createContext, useContext, useState } from 'react';

// Basic Mock Dictionary for key UI elements
const DICTIONARY = {
  EN: {
    dashboard: "My Learning Hub",
    profiler: "Competency Profiler",
    gapMatrix: "Skill Gap Matrix",
    skillTree: "KCM Skill Roadmap",
    pathways: "iGOT & NSSTA Pathways",
    aiCopilot: "Skill Path AI Copilot",
    admin: "Cadre Executive Dashboard",
    welcome: "Welcome back",
    official_hub: "Official Capacity Building Hub",
    stat_ai_title: "Skill Path AI Assistant",
    upload_doc: "Upload Document / Image",
    contact_admin: "Contact Admin",
  },
  HI: {
    dashboard: "मेरा लर्निंग हब",
    profiler: "योग्यता विश्लेषक",
    gapMatrix: "कौशल अंतर मैट्रिक्स",
    skillTree: "KCM कौशल रोडमैप",
    pathways: "iGOT और NSSTA पथ",
    aiCopilot: "कौशल पथ AI कोपायलट",
    admin: "कैडर कार्यकारी डैशबोर्ड",
    welcome: "वापसी पर स्वागत है",
    official_hub: "आधिकारिक क्षमता निर्माण केंद्र",
    stat_ai_title: "कौशल पथ AI सहायक",
    upload_doc: "दस्तावेज़ / छवि अपलोड करें",
    contact_admin: "व्यवस्थापक से संपर्क करें",
  },
  TE: {
    dashboard: "నా లెర్నింగ్ హబ్",
    profiler: "సామర్థ్య ప్రొఫైలర్",
    gapMatrix: "నైపుణ్య గ్యాప్ మ్యాట్రిక్స్",
    skillTree: "KCM నైపుణ్య రోడ్‌మ్యాప్",
    pathways: "iGOT మరియు NSSTA మార్గాలు",
    aiCopilot: "స్కిల్ పాత్ AI కోపైలట్",
    admin: "క్యాడర్ ఎగ్జిక్యూటివ్ డ్యాష్‌బోర్డ్",
    welcome: "తిరిగి స్వాగతం",
    official_hub: "అధికారిక కెపాసిటీ బిల్డింగ్ హబ్",
    stat_ai_title: "స్కిల్ పాత్ AI అసిస్టెంట్",
    upload_doc: "పత్రం / చిత్రాన్ని అప్‌లోడ్ చేయండి",
    contact_admin: "అడ్మిన్‌ను సంప్రదించండి",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('EN'); // 'EN', 'HI', 'TE'

  const t = (key) => {
    return DICTIONARY[lang][key] || DICTIONARY['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
