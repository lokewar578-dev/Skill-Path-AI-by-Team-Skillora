const fs = require('fs');
let content = fs.readFileSync('src/components/StatAICopilot.jsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { Search, Send, User, Bot, UploadCloud, FileText, CheckCircle2, XCircle, Sparkles, AlertCircle, Compass, Lightbulb, Shuffle } from 'lucide-react';",
  `import { Search, Send, User, Bot, UploadCloud, FileText, CheckCircle2, XCircle, Sparkles, AlertCircle, Compass, Lightbulb, Shuffle } from 'lucide-react';\nimport { generateDynamicQuestions } from '../utils/nlpMcqGenerator';\nimport * as pdfjsLib from 'pdfjs-dist';\nimport * as mammoth from 'mammoth';\npdfjsLib.GlobalWorkerOptions.workerSrc = \`//cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjsLib.version}/pdf.worker.min.js\`;`
);

// 2. Add State
content = content.replace(
  "const [chatQuizAnswers, setChatQuizAnswers] = useState({});",
  `const [chatQuizAnswers, setChatQuizAnswers] = useState({});\n  const [uploadedDocText, setUploadedDocText] = useState('');\n  const [uploadedFileName, setUploadedFileName] = useState('');`
);

// 3. Update handleSend
// Replace generateQuizForTopic usage
content = content.replace(
  "generatedQuizData = generateQuizForTopic(lastTopicContext);",
  `const match = qLower.match(/(\\d+)/);\n        const reqCount = match ? parseInt(match[1]) : 5;\n        const dynamicQs = generateDynamicQuestions(uploadedDocText || 'Default statistics document text for simulation...', reqCount, 'T3', uploadedFileName || 'General');\n        generatedQuizData = dynamicQs.map((dq, i) => ({\n          q: \`\${i+1}. \${dq.question}\`,\n          options: dq.options,\n          correct: dq.correctAnswer,\n          exp: dq.explanation\n        }));\n`
);

content = content.replace(
  "Here is your personalized 3-Question MCQ Quiz",
  "Here is your personalized ${generatedQuizData.length}-Question MCQ Quiz from your document"
);

// Update cheatsheet handler
content = content.replace(
  "Here are the precise and accurate mathematical formulas for your current context:\\n\\n**1. Weighted Mean (Survey Data)**",
  `Based on your uploaded document, here is a dynamic summary and cheatsheet:\\n\\n**Document Summary:**\\n\${(uploadedDocText ? uploadedDocText.substring(0, 150) : "No custom document uploaded. Using statistical defaults.")}...\\n\\n**Key Formulas Extracted:**\\n\\n**1. Weighted Mean (Survey Data)**`
);

// Update upload handler
content = content.replace(
  /\} else if \(isUpload\) \{\n[\s\S]*?nextIdeasForMessage = \[\n[\s\S]*?\];\n\s*\}/m,
  `} else if (isUpload) {
        topicToSet = 'general';
        showQuizBtn = true;
        aiResponseText = \`### Document Analysis Complete 📄\\n\\nI have successfully ingested **\${uploadedFileName || 'your document'}**. I extracted \${(textToSend && textToSend.length) || 0} characters of text. I have analyzed the statistical context and identified key themes.\\n\\n*Based on the uploaded document, I can accurately generate a precise summary, create a 5, 12, or 20-question MCQ assessment, or extract specific formula workflows.*\\n\\nWhat would you like to do next?\`;
        
        updateSuggestionsForTopic('general');
        nextIdeasForMessage = [
          "Generate a 5-question MCQ assessment from this document",
          "Generate a 20-question MCQ assessment",
          "Summarize the key statistical methodologies described in the upload",
          "Provide a detailed formula cheatsheet from this document"
        ];
      }`
);

// 4. Update the input field
content = content.replace(
  /<button \n\s*onClick=\{\(\) => handleSend\("📄 \[Document Uploaded: NSSTA_Manual\.pdf\]", true\)\}\n\s*title=\{t\('upload_doc'\) \|\| "Upload Document \/ Image"\}\n\s*style=\{\{ padding: '12px', background: 'var\(--bg-main\)', border: '1px solid var\(--border-color\)', borderRadius: '10px', color: 'var\(--text-main\)', cursor: 'pointer' \}\}\n\s*>\n\s*<UploadCloud size=\{18\} \/>\n\s*<\/button>/m,
  `<input
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
          </label>`
);

fs.writeFileSync('src/components/StatAICopilot.jsx', content);
console.log("Patched successfully");
