/**
 * nlpMcqGenerator.js
 * A client-side NLP engine to dynamically generate MCQs from raw text.
 * Overhauled to include strict sanitization and smart entity blanking.
 */

// Basic NLP to extract 'distractors' from the text itself
function extractKeywords(sentences) {
  const words = sentences.join(' ').split(/\W+/);
  return Array.from(new Set(words.filter(w => w.length > 5 && !w.match(/^[a-z]+[A-Z][a-z]+/)))); // Ignore camelCase
}

function isCodeOrGibberish(sentence) {
  const badPatterns = [
    /[{}<>=\[\]]/,           // Code brackets and equals
    /function\s*\(/,         // JS function
    /=>/,                    // Arrow functions
    /console\.log/,          // Logs
    /const\s+|let\s+|var\s+/,// Variable declarations
    /import\s+/,             // Imports
    /http:\/\//, /https:\/\//, // URLs
    /style={{/,              // React inline styles
    /className=/,            // React classes
    /px|em|rem/              // CSS units
  ];
  return badPatterns.some(pattern => pattern.test(sentence));
}

// Generate distractors based on the correct answer and a pool of keywords
function generateDistractors(correctAnswer, keywordPool, count = 3) {
  const distractors = new Set();
  const isCapitalized = /^[A-Z]/.test(correctAnswer);

  // Try to find words of similar length and casing
  const similarWords = keywordPool.filter(w => {
    if (w.toLowerCase() === correctAnswer.toLowerCase()) return false;
    if (isCapitalized && !/^[A-Z]/.test(w)) return false;
    return Math.abs(w.length - correctAnswer.length) <= 4;
  });
  
  // Shuffle similar words
  similarWords.sort(() => Math.random() - 0.5);
  
  for (const word of similarWords) {
    if (distractors.size < count) {
      distractors.add(word);
    }
  }

  // Fallbacks if not enough distractors
  const fallbacks = isCapitalized ? 
    ["Variance", "Stratification", "Anonymity", "Imputation", "Aggregation", "Correlation", "Dispersion", "Estimation"] :
    ["variance", "stratification", "anonymity", "imputation", "aggregation", "correlation", "dispersion", "estimation"];
    
  while (distractors.size < count) {
    const f = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    if (f.toLowerCase() !== correctAnswer.toLowerCase()) {
      distractors.add(f);
    }
  }

  return Array.from(distractors);
}

export function generateDynamicQuestions(text, count, tier, fileName = 'Uploaded Document') {
  if (!text || text.length < 50) {
    text = `Official Statistics rely on rigorous methodologies including Stratified Random Sampling and Multi-stage designs. 
    The primary goal is to minimize standard error while maintaining representativeness.
    Gross Value Added (GVA) is calculated as Output minus Intermediate Consumption.
    Data privacy must strictly follow the DPDP Act 2023, ensuring k-anonymity for microdata releases.
    Periodic Labour Force Survey (PLFS) uses Urban Frame Survey blocks in urban areas.
    Base year revisions in National Accounts happen periodically to reflect structural economic shifts.
    Sample design optimization involves balancing cost, variance, and operational feasibility.
    Imputation methods are employed to handle non-response bias in household surveys.
    Data visualization techniques aid in interpreting complex demographic distributions.
    Statistical inference relies on probability theory and the central limit theorem.
    Confidence intervals provide a range of plausible values for a population parameter.
    Regression analysis identifies relationships between dependent and independent variables.
    Quality assurance in official statistics ensures accuracy, timeliness, and coherence.
    Survey weights adjust for unequal probabilities of selection and non-response.
    Metadata standardization facilitates data interoperability across different statistical agencies.
    Spatial data analysis utilizes GIS to uncover geographic patterns in statistical data.`;
  }

  // 1. Sanitize text by removing URLs and newlines within sentences
  let cleanText = text.replace(/https?:\/\/[^\s]+/g, '').replace(/\n/g, ' ');

  // 2. Split into sentences
  let rawSentences = cleanText.match(/[^.!?]+[.!?]+/g) || [];
  
  // 3. Filter sentences strictly
  let sentences = rawSentences
    .map(s => s.trim())
    .filter(s => s.length > 40 && s.length < 250) // Good length for a question
    .filter(s => !isCodeOrGibberish(s));

  if (sentences.length === 0) {
    // Ultimate fallback if the user uploaded ONLY code
    sentences = [
      "The uploaded document contains invalid structural formatting, causing the NLP parser to fallback to statistical defaults.",
      "Data validation ensures that collected statistics are free from structural anomalies."
    ];
  }

  // Do not duplicate excessively. Just shuffle what we have.
  sentences.sort(() => Math.random() - 0.5);
  // Cap at max possible unique sentences if shorter than requested count
  const actualCount = Math.min(count, sentences.length);
  const selectedSentences = sentences.slice(0, actualCount);
  const keywordPool = extractKeywords(sentences);

  const questions = [];

  const tierVerbs = {
    'T12': ['Identify', 'Define', 'Recall'],
    'T3': ['Apply', 'Calculate', 'Implement'],
    'T45': ['Analyse', 'Evaluate', 'Formulate']
  };

  selectedSentences.forEach((sentence, idx) => {
    const words = sentence.split(' ');
    
    // Smart Entity Recognition: Find the best word to blank out
    // Priority 1: Acronyms (e.g., GVA, PLFS)
    // Priority 2: Capitalized words > 4 chars in the middle of a sentence
    // Priority 3: Technical words ending in -tion, -ity, -ment
    // Priority 4: Longest word > 6 chars
    
    let targetWordIdx = -1;
    let maxPriority = 99;

    words.forEach((w, i) => {
      const cleanW = w.replace(/[^a-zA-Z]/g, '');
      if (cleanW.length < 4) return;
      
      if (/^[A-Z]{3,}$/.test(cleanW)) { // Acronym
        if (1 < maxPriority) { targetWordIdx = i; maxPriority = 1; }
      } else if (i > 0 && /^[A-Z][a-z]{4,}/.test(cleanW)) { // Proper noun in middle
        if (2 < maxPriority) { targetWordIdx = i; maxPriority = 2; }
      } else if (/(tion|ity|ment|ics|sis)$/i.test(cleanW)) { // Technical suffix
        if (3 < maxPriority) { targetWordIdx = i; maxPriority = 3; }
      } else if (cleanW.length > 6) { // Long word fallback
        if (4 < maxPriority) { targetWordIdx = i; maxPriority = 4; }
      }
    });

    if (targetWordIdx === -1) {
      targetWordIdx = Math.floor(Math.random() * (words.length - 2)) + 1; // Pick random non-first/last
    }

    const correctWordRaw = words[targetWordIdx];
    const correctWord = correctWordRaw.replace(/[.,!?]/g, ''); // Clean punctuation
    
    words[targetWordIdx] = "________";
    const questionText = words.join(' ');

    const distractors = generateDistractors(correctWord, keywordPool, 3);
    const options = [correctWord, ...distractors];
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctWord);

    const verbs = tierVerbs[tier] || tierVerbs['T3'];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];

    questions.push({
      id: `dyn-${Math.random().toString(36).substring(7)}`,
      difficultyTier: tier,
      bloomVerb: verb,
      type: 'MCQ',
      question: `What is the missing term in the following statement extracted from the document? \n\n"${questionText}"`,
      options: options,
      correctAnswer: correctIndex,
      explanation: `The correct term is "${correctWord}". This is directly extracted from the uploaded source material: "${sentence}"`,
      citation: {
        chunkId: `chunk-${idx}`,
        sourceTitle: fileName,
        chapterOrSection: 'NLP Extracted Content',
        pageNumber: 'Auto-scanned',
        excerpt: sentence
      }
    });
  });

  return questions;
}
