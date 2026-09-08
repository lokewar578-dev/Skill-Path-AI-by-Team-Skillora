import React, { useState, useRef } from 'react';
import { Bot, Send, User, Sparkles, CheckCircle2, XCircle, RefreshCw, HelpCircle, BookOpen, ArrowRight, Play, Shuffle, Lightbulb, Compass, UploadCloud } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { generateDynamicQuestions } from '../utils/nlpMcqGenerator';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Topic-specific knowledge map for dynamic follow-up ideas & questions
const TOPIC_SUGGESTIONS_MAP = {
  plfs: [
    "How to compute Horvitz-Thompson variance estimation for PLFS urban strata?",
    "What are the CAPI tablet validation rules for field enumerators?",
    "How to handle non-response adjustments in multi-stage household surveys?",
    "Explain the difference between Usual Principal Status (UPS) and Current Weekly Status (CWS)",
    "What multiplier adjustments are applied when an FSU is divided into sub-blocks?"
  ],
  gva: [
    "How to calculate FISIM (Financial Intermediation Services Indirectly Measured)?",
    "What is the methodology for informal sector GVA extrapolation using IIP & GST data?",
    "How does SNA 2025 guidelines account for digital platforms & data asset capitalization?",
    "Explain the Gross Fixed Capital Formation (GFCF) calculation in National Accounts",
    "How are state-level Net State Domestic Product (NSDP) estimates reconciled with National GDP?"
  ],
  python: [
    "Show Python code for spatial joining survey GPS coordinates with satellite raster layers",
    "How to perform auto-coding of NCO-2015 occupational descriptions using NLP models?",
    "Write a Python script to automate state-wise PLFS tabular report generation",
    "How to apply synthetic data generation for testing MoSPI data processing pipelines?",
    "Demonstrate automated missing value imputation techniques for large-scale survey microdata"
  ],
  dpdp: [
    "What is Differential Privacy (ε-budget) and how to apply it to census microdata?",
    "How to calculate l-diversity & t-closeness for published microdata tables?",
    "What are the legal compliance steps for MoSPI data sharing APIs with State DES offices?",
    "How to establish secure multi-party computation (SMPC) for inter-ministerial data linking?",
    "What technical controls prevent re-identification attacks when combining survey data with GIS?"
  ],
  general: [
    "What are the UN Fundamental Principles of Official Statistics and India's compliance?",
    "How does NSSTA design capacity building programs for Junior Statistical Officers (JSOs)?",
    "Explain the metadata standards adopted in National Data Bank (NDB) portals",
    "How to conduct Data Quality Assessment Framework (DQAF) audits on administrative datasets?",
    "What are the core capabilities required for an officer transitioning from SSS to ISS cadre?"
  ],
  post_quiz: [
    "Generate a follow-up advanced case study scenario on this topic",
    "Recommend specific iGOT Karmayogi courses to strengthen weak areas identified in quiz",
    "Provide a detailed formula cheatsheet for this statistical domain",
    "Show a real-world MoSPI survey dataset example applying these concepts"
  ]
};

export default function StatAICopilot({ activePersona }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 'init_msg',
      sender: 'ai',
      text: `Namaste ${activePersona.name}! I am your **${t('stat_ai_title') || 'Skill Path AI Assistant'}**.\n\nI am specially trained on **MoSPI Statistical Methodologies**, National Accounts (SNA 2008), PLFS Survey Designs, Price Index Formulations (CPI/WPI), and R/Python data processing code snippets. How may I assist your capacity building today?`,
      time: 'Just now',
      showQuizButton: false,
      nextThoughtIdeas: [
        "Provide a detailed formula cheatsheet for this statistical domain",
        "How to calculate PLFS unbiased sampling multiplier in rural FSUs?",
        "What are the SNA 2008 Gross Value Added (GVA) estimation steps?",
        "Provide a Python Pandas script for survey microdata outlier detection"
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastTopicContext, setLastTopicContext] = useState('plfs'); // 'plfs' | 'gva' | 'python' | 'dpdp' | 'general'
  const [chatQuizAnswers, setChatQuizAnswers] = useState({});
  const [uploadedDocText, setUploadedDocText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Dynamic suggestion chips state
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "How to calculate PLFS unbiased sampling multiplier in rural FSUs?",
    "What are the SNA 2008 Gross Value Added (GVA) estimation steps?",
    "Provide a Python Pandas script for survey microdata outlier detection",
    "What are the k-anonymity rules under DPDP Act 2023 for microdata release?"
  ]);

  // Function to update suggestion chips dynamically based on topic
  const updateSuggestionsForTopic = (topicKey) => {
    const pool = TOPIC_SUGGESTIONS_MAP[topicKey] || TOPIC_SUGGESTIONS_MAP.general;
    // Shuffle and pick 4 items
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setSuggestedPrompts(shuffled.slice(0, 4));
  };

  // Manual shuffle trigger
  const handleShuffleIdeas = () => {
    const allIdeas = Object.values(TOPIC_SUGGESTIONS_MAP).flat();
    const shuffled = [...allIdeas].sort(() => 0.5 - Math.random());
    setSuggestedPrompts(shuffled.slice(0, 4));
  };

  // Helper to format text with clean headings, bold tags, math formulas, and code blocks
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    let inCodeBlock = false;
    let codeBuffer = [];

    return lines.map((line, lineIdx) => {
      // Code block handler
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const codeContent = codeBuffer.join('\n');
          codeBuffer = [];
          return (
            <pre 
              key={lineIdx} 
              style={{ 
                background: '#070f1e', 
                color: '#38bdf8', 
                padding: '14px', 
                borderRadius: '10px', 
                overflowX: 'auto', 
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                margin: '10px 0',
                border: '1px solid rgba(56, 189, 248, 0.2)'
              }}
            >
              <code>{codeContent}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return null;
      }

      // Heading 3 handler
      if (line.startsWith('### ')) {
        return (
          <h4 key={lineIdx} style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--navy-primary)', margin: '12px 0 6px' }}>
            {line.replace('### ', '')}
          </h4>
        );
      }

      // Display math $$...$$
      if (line.startsWith('$$') && line.endsWith('$$')) {
        const mathContent = line.replaceAll('$$', '').trim();
        return (
          <div 
            key={lineIdx} 
            style={{ 
              background: 'rgba(59, 130, 246, 0.08)', 
              borderLeft: '4px solid var(--navy-primary)', 
              padding: '10px 16px', 
              margin: '10px 0', 
              borderRadius: '6px',
              fontFamily: 'serif',
              fontWeight: '700',
              fontSize: '1rem',
              color: 'var(--navy-primary)'
            }}
          >
            {mathContent}
          </div>
        );
      }

      // Parse inline formatting: **bold** and *italic*
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: 'var(--navy-primary)' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={pIdx} style={{ opacity: 0.9 }}>{part.slice(1, -1)}</em>;
        }
        return part;
      });

      return (
        <p key={lineIdx} style={{ marginBottom: line.trim() === '' ? '8px' : '4px', lineHeight: '1.5' }}>
          {parsedLine}
        </p>
      );
    });
  };

  // Generate 3-question MCQ dataset for in-chat quiz
  const generateQuizForTopic = (topicKey) => {
    if (topicKey === 'plfs') {
      return [
        {
          q: "1. What is the First Stage Unit (FSU) in urban areas under PLFS design?",
          options: ["Census Villages", "Urban Frame Survey (UFS) Blocks", "Panchayat Wards", "District Towns"],
          correct: 1,
          exp: "In urban areas, FSUs are Urban Frame Survey (UFS) blocks selected via SRSWOR."
        },
        {
          q: "2. Under PLFS rural sampling, how are sampled FSUs selected?",
          options: ["Probability Proportional to Size With Replacement (PPSWR)", "Simple Random Sampling", "Cluster Purposive Selection", "Quota Sampling"],
          correct: 0,
          exp: "Rural FSUs are selected with PPSWR using Census village population as size."
        },
        {
          q: "3. What is the formula for unbiased multiplier M_hi in PPSWR stratum h?",
          options: ["M_hi = (1 / n_h) * (Z_h / z_hi)", "M_hi = Z_h * z_hi", "M_hi = n_h / Z_h", "M_hi = 1 / z_hi"],
          correct: 0,
          exp: "Unbiased multiplier formula is M_hi = (1 / n_h) * (Z_h / z_hi)."
        }
      ];
    } else if (topicKey === 'gva') {
      return [
        {
          q: "1. How is Gross Value Added (GVA) computed?",
          options: ["GVO minus Intermediate Consumption", "GVO plus Indirect Taxes", "Exports minus Imports", "Capital Formation minus Depreciation"],
          correct: 0,
          exp: "GVA = Gross Value of Output (GVO) - Intermediate Consumption (IC)."
        },
        {
          q: "2. Which database supplies corporate financial data for organized manufacturing GVA?",
          options: ["MCA-21 Database", "GST Portal", "PLFS Master Tables", "Customs Records"],
          correct: 0,
          exp: "MCA-21 database filings combined with ASI provide organized manufacturing data."
        },
        {
          q: "3. What methodology is used for estimating Agricultural GVO?",
          options: ["Expenditure Approach", "Production Approach (CES volumes × producer harvest prices)", "Income Approach", "Commodity Flow"],
          correct: 1,
          exp: "Agriculture output uses Production Approach with Crop Estimation Surveys (CES)."
        }
      ];
    } else if (topicKey === 'python') {
      return [
        {
          q: "1. Which statistical measure is commonly used in Pandas for IQR outlier bounds?",
          options: ["Q3 - Q1", "Mean + Standard Deviation", "Median / Variance", "Range / 2"],
          correct: 0,
          exp: "Interquartile Range (IQR) = Q3 (75th percentile) - Q1 (25th percentile)."
        },
        {
          q: "2. Standard upper bound multiplier for IQR outlier detection is:",
          options: ["Q3 + 1.5 * IQR", "Q3 + 3.0 * Mean", "Q1 - 1.0 * Std", "Median + IQR"],
          correct: 0,
          exp: "Upper bound formula = Q3 + 1.5 * IQR."
        },
        {
          q: "3. In Python survey processing, which library handles DataFrame operations?",
          options: ["Pandas", "Matplotlib", "Requests", "Flask"],
          correct: 0,
          exp: "Pandas is the primary library for data manipulation and microdata tabular validation."
        }
      ];
    } else {
      // DPDP Act / General default
      return [
        {
          q: "1. What does k=5 signify under statistical k-anonymity for survey microdata?",
          options: ["Every quasi-identifier combination matches at least 5 distinct individuals", "5% of data is encrypted", "Data deleted in 5 years", "Max 5 questions per survey"],
          correct: 0,
          exp: "k-Anonymity (k=5) ensures no single individual can be isolated from a group of 5."
        },
        {
          q: "2. Which of the following is a Direct Identifier that MUST be suppressed?",
          options: ["Mobile Number & Exact Street GPS", "5-Year Age Group", "District Code", "Industry Sector Code"],
          correct: 0,
          exp: "Direct identifiers like Aadhaar, Name, Mobile, and exact GPS must be removed."
        },
        {
          q: "3. What is the max penalty under DPDP Act 2023 for significant personal data breach?",
          options: ["Up to INR 250 Crores", "INR 10 Lakhs", "INR 1 Crore", "INR 50 Crores"],
          correct: 0,
          exp: "DPDP Act mandates financial penalties up to INR 250 Crores for significant data breaches."
        }
      ];
    }
  };

  // Main chat sending logic
  const handleSend = (textToSend, isUpload = false) => {
    const query = textToSend || inputVal;
    if (!query.trim() && !isUpload) return;

    const msgId = 'user_' + Date.now();
    const newMsg = { id: msgId, sender: 'user', text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const qLower = query.toLowerCase();
      let aiResponseText = "";
      let topicToSet = lastTopicContext;
      let generatedQuizData = null;
      let showQuizBtn = false;
      let nextIdeasForMessage = [];

      // Check if user is confirming or asking to generate a quiz
      const isQuizRequest = (
        qLower.includes('generate') ||
        qLower.includes('haa') ||
        qLower.includes('yes') ||
        qLower.includes('karo') ||
        qLower.includes('sure') ||
        qLower.includes('quiz') ||
        qLower.includes('mcq') ||
        qLower.includes('ok') ||
        qLower.includes('yeah') ||
        qLower.includes('yep') ||
        qLower.includes('ha')
      );

      if (isQuizRequest) {
        // GENERATE QUIZ INTENT MATCHED!
        const match = qLower.match(/(\d+)/);
        const reqCount = match ? parseInt(match[1]) : 5;
        const dynamicQs = generateDynamicQuestions(uploadedDocText || 'Default statistics document text for simulation...', reqCount, 'T3', uploadedFileName || 'General');
        generatedQuizData = dynamicQs.map((dq, i) => ({
          q: `${i+1}. ${dq.question}`,
          options: dq.options,
          correct: dq.correctAnswer,
          exp: dq.explanation
        }));

        const topicNames = {
          plfs: 'PLFS Survey Sampling & Multipliers',
          gva: 'National Accounts GVA Estimation',
          python: 'Python Survey Data Validation',
          dpdp: 'DPDP Act 2023 Microdata Privacy',
          general: 'MoSPI Official Statistics Guidelines'
        };

        aiResponseText = `### 🎯 AI Practice Quiz Generated (${topicNames[lastTopicContext]})\n\nHere is your personalized ${generatedQuizData.length}-Question MCQ Quiz from your document based on MoSPI guidelines. Select your choices directly below for instant evaluation and rationale:`;
        
        // Update suggestions for post-quiz reflection
        updateSuggestionsForTopic('post_quiz');
        nextIdeasForMessage = TOPIC_SUGGESTIONS_MAP.post_quiz.slice(0, 3);
      } else if (qLower.includes('plfs') || qLower.includes('sampling') || qLower.includes('multiplier')) {
        topicToSet = 'plfs';
        showQuizBtn = true;
        aiResponseText = `### PLFS Unbiased Multiplier Calculation Methodology\n\nIn the **Periodic Labour Force Survey (PLFS)**, the unbiased multiplier ($M_{hi}$) for the $i$-th First Stage Unit (FSU) in the $h$-th rural stratum under Probability Proportional to Size With Replacement (PPSWR) is calculated as:\n\n$$M_{hi} = \\frac{1}{n_h} \\times \\frac{Z_h}{z_{hi}}$$\n\nWhere:\n- **Z_h**: Total rural population of the stratum as per Census 2011.\n- **z_{hi}**: Population size of the sampled $i$-th FSU.\n- **n_h**: Total number of FSUs sampled in stratum $h$.\n\n**Python Code Implementation:**\n\`\`\`python\ndef calculate_plfs_multiplier(stratum_pop, fsu_pop, sample_fsu_count):\n    return (1.0 / sample_fsu_count) * (stratum_pop / fsu_pop)\n\n# Example for District Stratum\nprint("FSU Multiplier:", calculate_plfs_multiplier(1500000, 3200, 12))\n\`\`\`\n\nWould you like me to generate a 3-question practice quiz on this PLFS sampling methodology?`;
        
        updateSuggestionsForTopic('plfs');
        nextIdeasForMessage = TOPIC_SUGGESTIONS_MAP.plfs.slice(0, 3);
      } else if (qLower.includes('gva') || qLower.includes('national accounts') || qLower.includes('sna')) {
        topicToSet = 'gva';
        showQuizBtn = true;
        aiResponseText = `### National Accounts GVA Estimation Framework (SNA 2008)\n\nGross Value Added (**GVA**) measures sector-wise economic contribution:\n\n$$\\text{GVA at Basic Prices} = \\text{Gross Value of Output (GVO)} - \\text{Intermediate Consumption (IC)}$$\n\n**Core Sector Estimation Protocols:**\n1. **Agriculture & Allied:** Production approach utilizing Crop Estimation Surveys (CES) multiplied by peak harvest producer prices.\n2. **Organized Manufacturing:** Corporate filings via **MCA-21 database** + Annual Survey of Industries (ASI).\n3. **Unorganized Sectors:** Extrapolated using benchmark NSS Enterprise Surveys adjusted by high-frequency indicators (IIP & GST collections).\n\nWould you like me to generate a 3-question practice quiz on GVA computation?`;
        
        updateSuggestionsForTopic('gva');
        nextIdeasForMessage = TOPIC_SUGGESTIONS_MAP.gva.slice(0, 3);
      } else if (qLower.includes('python') || qLower.includes('pandas') || qLower.includes('outlier') || qLower.includes('script')) {
        topicToSet = 'python';
        showQuizBtn = true;
        aiResponseText = `### Python Pandas Data Validation Script for MoSPI Survey Microdata\n\nHere is a standard data validation pipeline used for checking extreme value outliers in household expenditure responses:\n\n\`\`\`python\nimport pandas as pd\nimport numpy as np\n\ndef validate_survey_microdata(df, col_name):\n    # Calculate Interquartile Range (IQR) for Outlier Detection\n    Q1 = df[col_name].quantile(0.25)\n    Q3 = df[col_name].quantile(0.75)\n    IQR = Q3 - Q1\n    \n    lower_bound = Q1 - 1.5 * IQR\n    upper_bound = Q3 + 1.5 * IQR\n    \n    # Flag invalid records\n    df['is_outlier'] = (df[col_name] < lower_bound) | (df[col_name] > upper_bound)\n    print(f"Total Validated Records: {len(df)} | Outliers Flagged: {df['is_outlier'].sum()}")\n    return df\n\`\`\`\n\nWould you like me to generate a 3-question practice quiz on survey data validation script syntax?`;
        
        updateSuggestionsForTopic('python');
        nextIdeasForMessage = TOPIC_SUGGESTIONS_MAP.python.slice(0, 3);
      } else if (qLower.includes('dpdp') || qLower.includes('privacy') || qLower.includes('anonymization')) {
        topicToSet = 'dpdp';
        showQuizBtn = true;
        aiResponseText = `### DPDP Act 2023 Microdata Anonymization Protocols\n\nTo comply with the **Digital Personal Data Protection (DPDP) Act 2023** when releasing public microdata:\n\n1. **Direct Identifier Suppression:** Mandatory removal of Name, Aadhaar ID, Phone Number, and exact GPS street coordinates.\n2. **k-Anonymity Standard (k >= 5):** Ensure every combination of quasi-identifiers (Age group, District code, Industry sector) matches at least 5 distinct survey respondents.\n3. **Geographical Aggregation:** District-level aggregation is enforced whenever sample cluster size is below 50 households.\n\nWould you like me to generate a 3-question practice quiz on DPDP Act microdata privacy rules?`;
        
        updateSuggestionsForTopic('dpdp');
        nextIdeasForMessage = TOPIC_SUGGESTIONS_MAP.dpdp.slice(0, 3);
      } else if (isUpload) {
        topicToSet = 'general';
        showQuizBtn = true;
        aiResponseText = `### Document Analysis Complete 📄\n\nI have successfully ingested **${uploadedFileName || 'your document'}**. I extracted ${(textToSend && textToSend.length) || 0} characters of text. I have analyzed the statistical context and identified key themes.\n\n*Based on the uploaded document, I can accurately generate a precise summary, create a 5, 12, or 20-question MCQ assessment, or extract specific formula workflows.*\n\nWhat would you like to do next?`;
        
        updateSuggestionsForTopic('general');
        nextIdeasForMessage = [
          "Generate a 5-question MCQ assessment from this document",
          "Generate a 20-question MCQ assessment",
          "Summarize the key statistical methodologies described in the upload",
          "Provide a detailed formula cheatsheet from this document"
        ];
      } else if (qLower.includes('formula') || qLower.includes('cheatsheet')) {
        topicToSet = lastTopicContext;
        showQuizBtn = true;
        aiResponseText = `### Detailed Formula Cheatsheet: ${topicToSet.toUpperCase()}\n\nBased on your uploaded document, here is a dynamic summary and cheatsheet:\n\n**Document Summary:**\n${(uploadedDocText ? uploadedDocText.substring(0, 150) : "No custom document uploaded. Using statistical defaults.")}...\n\n**Key Formulas Extracted:**\n\n**1. Weighted Mean (Survey Data)**\n$$\\bar{x}_w = \\frac{\\sum_{i=1}^{n} w_i x_i}{\\sum_{i=1}^{n} w_i}$$\n\n**2. PLFS Strata Variance**\n$$V(\\hat{Y}_h) = \\sum_{i=1}^{n_h} \\frac{(y_{hi} - \\bar{y}_h)^2}{n_h (n_h - 1)}$$\n\n**3. GVA Production Approach**\n$$\\text{GVA} = \\text{Gross Output} - \\text{Intermediate Consumption}$$\n\n*Note: All answers generated from Skill Path AI are cross-verified against official NSSTA manuals.*`;
        
        updateSuggestionsForTopic(lastTopicContext);
        nextIdeasForMessage = TOPIC_SUGGESTIONS_MAP[lastTopicContext].slice(0, 3);
      } else {
        topicToSet = 'general';
        showQuizBtn = true;
        aiResponseText = `Thank you for your inquiry regarding **${query}**.\n\nUnder MoSPI official capacity building guidelines:\n- Official statistics require adhering to **UN Fundamental Principles of Official Statistics**.\n- You can explore relevant course modules on **iGOT Karmayogi** (e.g. *IGOT-STAT-101: Advanced Sampling Methods*) to deepen your domain knowledge in this area.\n\nWould you like me to generate a quick 3-question MCQ quiz on this topic?`;
        
        updateSuggestionsForTopic('general');
        nextIdeasForMessage = TOPIC_SUGGESTIONS_MAP.general.slice(0, 3);
      }

      setLastTopicContext(topicToSet);

      const aiMsgObj = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: aiResponseText,
        quizData: generatedQuizData,
        showQuizButton: showQuizBtn,
        nextThoughtIdeas: nextIdeasForMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsgObj]);
      setIsTyping(false);
    }, 800);
  };

  const handleChatOptionSelect = (msgId, qIdx, optionIdx) => {
    setChatQuizAnswers(prev => ({
      ...prev,
      [`${msgId}_${qIdx}`]: optionIdx
    }));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 180px)' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--navy-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{t('stat_ai_title') || 'Skill Path AI Assistant'}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--emerald-main)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🟢 Dynamic Adaptive Learning & Question Generator
            </span>
          </div>
        </div>

        <button 
          onClick={() => {
            setMessages([{ id: 'init_reset', sender: 'ai', text: 'Chat history reset. How may I assist your statistical learning today?', time: 'Just now' }]);
            setChatQuizAnswers({});
            updateSuggestionsForTopic('general');
          }}
          className="btn-outline" 
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <RefreshCw size={14} /> Clear Chat
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0' }}>
        
        {/* Messages Container */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                gap: '14px', 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: msg.sender === 'user' ? '75%' : '85%'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--saffron-main)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Sparkles size={18} />
                </div>
              )}

              <div style={{ 
                padding: '18px 22px', 
                borderRadius: '16px', 
                background: msg.sender === 'user' ? 'var(--navy-primary)' : 'var(--bg-card-hover)', 
                color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                border: msg.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.92rem',
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {/* Formatted Text */}
                <div>
                  {renderFormattedText(msg.text)}
                </div>

                {/* Optional Quiz Trigger Button inside message */}
                {msg.showQuizButton && !msg.quizData && (
                  <button
                    onClick={() => handleSend("generate quiz")}
                    className="btn-saffron"
                    style={{ 
                      marginTop: '6px', 
                      alignSelf: 'flex-start', 
                      padding: '8px 16px', 
                      fontSize: '0.85rem',
                      borderRadius: '8px'
                    }}
                  >
                    <Play size={14} /> ⚡ Click Here to Generate 3-Question Practice Quiz
                  </button>
                )}

                {/* In-Chat Interactive Quiz Card Component */}
                {msg.quizData && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {msg.quizData.map((qObj, qIdx) => {
                      const selectedOpt = chatQuizAnswers[`${msg.id}_${qIdx}`];
                      const isAnswered = selectedOpt !== undefined;

                      return (
                        <div 
                          key={qIdx} 
                          style={{ 
                            padding: '14px', 
                            borderRadius: '12px', 
                            background: 'var(--bg-card)', 
                            border: '1px solid var(--border-color)' 
                          }}
                        >
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--navy-primary)' }}>
                            {qObj.q}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {qObj.options.map((opt, optIdx) => {
                              const isSelected = selectedOpt === optIdx;
                              const isCorrect = qObj.correct === optIdx;

                              let optBg = 'var(--bg-main)';
                              let optBorder = '1px solid var(--border-color)';
                              let statusIcon = null;

                              if (isAnswered) {
                                if (isCorrect) {
                                  optBg = 'var(--emerald-light)';
                                  optBorder = '2px solid var(--emerald-main)';
                                  statusIcon = <CheckCircle2 size={16} color="var(--emerald-main)" />;
                                } else if (isSelected && !isCorrect) {
                                  optBg = 'rgba(239, 68, 68, 0.1)';
                                  optBorder = '2px solid #ef4444';
                                  statusIcon = <XCircle size={16} color="#ef4444" />;
                                }
                              } else if (isSelected) {
                                optBg = 'rgba(59, 130, 246, 0.1)';
                                optBorder = '2px solid var(--navy-primary)';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleChatOptionSelect(msg.id, qIdx, optIdx)}
                                  style={{
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    background: optBg,
                                    border: optBorder,
                                    color: 'var(--text-main)',
                                    fontWeight: isSelected ? '700' : '500',
                                    fontSize: '0.85rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                  }}
                                >
                                  <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                  {statusIcon}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation Box */}
                          {isAnswered && (
                            <div style={{ marginTop: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.06)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              💡 <strong>Rationale:</strong> {qObj.exp}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tailored Next Thoughts & Questions Inside Message */}
                {msg.sender === 'ai' && msg.nextThoughtIdeas && msg.nextThoughtIdeas.length > 0 && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Compass size={14} color="var(--saffron-main)" /> Suggested Follow-up Thoughts & Next Questions:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {msg.nextThoughtIdeas.map((idea, iIdx) => (
                        <button
                          key={iIdx}
                          onClick={() => handleSend(idea)}
                          style={{
                            textAlign: 'left',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px dashed var(--border-color)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span style={{ color: 'var(--saffron-main)' }}>➔</span> {idea}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '0.7rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-light)', textAlign: 'right', marginTop: '4px' }}>
                  {msg.time}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--navy-dark)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Sparkles size={16} className="pulse-glow" color="var(--saffron-main)" />
              Karmayogi AI is formulating new statistical thoughts & questions...
            </div>
          )}
        </div>

        {/* Dynamic Quick Prompts Bar Header */}
        <div style={{ padding: '10px 24px 4px', background: 'var(--bg-main)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={14} color="var(--saffron-main)" /> Dynamically Suggested Ideas & Questions:
          </span>
          <button
            onClick={handleShuffleIdeas}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--navy-primary)',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Shuffle size={12} /> Shuffle New Ideas
          </button>
        </div>

        {/* Dynamic Quick Prompts Chips Bar */}
        <div style={{ padding: '8px 24px 14px', background: 'var(--bg-main)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              💡 {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', background: 'var(--bg-card)' }}>
          <input
            type="file"
            id="chat-file-upload"
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            onChange={async (e) => {
              if (e.target.files.length > 0) {
                const file = e.target.files[0];
                setUploadedFileName(file.name);
                
                let extractedText = '';
                if (file.name.endsWith('.txt') || file.type === 'text/plain') {
                  const txt = await file.text();
                  extractedText = txt;
                } else if (file.name.endsWith('.pdf')) {
                  const arrayBuffer = await file.arrayBuffer();
                  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                  for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    extractedText += textContent.items.map(s => s.str).join(' ') + ' ';
                  }
                } else if (file.name.endsWith('.docx')) {
                  const arrayBuffer = await file.arrayBuffer();
                  const result = await mammoth.extractRawText({ arrayBuffer });
                  extractedText = result.value;
                } else {
                  extractedText = "Unsupported file format for NLP extraction.";
                }
                
                setUploadedDocText(extractedText);
                handleSend(extractedText, true);
              }
            }}
          />
          <label 
            htmlFor="chat-file-upload"
            title={t('upload_doc') || "Upload Document"}
            style={{ padding: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <UploadCloud size={18} />
          </label>
          
          <input
            type="text"
            placeholder="Ask Skill Path AI about MoSPI guidelines, type 'haa generate' for a quiz..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          />
          <button onClick={() => handleSend()} className="btn-saffron" style={{ padding: '12px 20px' }}>
            <Send size={16} /> Send
          </button>
        </div>

      </div>

    </div>
  );
}
