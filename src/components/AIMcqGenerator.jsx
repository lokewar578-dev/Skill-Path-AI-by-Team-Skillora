import React, { useState } from 'react';
import { SAMPLE_LEARNING_DOCUMENTS } from '../data/mockData';
import MathFormattedText from './MathFormattedText';
import { FileText, Sparkles, Upload, CheckCircle2, XCircle, ArrowRight, Download, RefreshCw, Layers, Sigma, ExternalLink } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import { getQuestionsForTier } from '../data/adaptiveQuizData';
import { generateDynamicQuestions } from '../utils/nlpMcqGenerator';
import { IGOT_COURSES } from '../data/mockData';
import { useLearnerProgress } from '../context/LearnerProgressContext';
import AdaptiveDifficultyBadge from './Quiz/AdaptiveDifficultyBadge';
import RemediationCard from './Quiz/RemediationCard';

export default function AIMcqGenerator({ onCompleteQuiz }) {
  const { overallStats } = useLearnerProgress();
  const [selectedDoc, setSelectedDoc] = useState(SAMPLE_LEARNING_DOCUMENTS[0]);
  const [customText, setCustomText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);

  const currentTier = overallStats.overallTier || 'T3';

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState([]);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // Active Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { recordQuizResult } = useLearnerProgress();

  const handleGenerateQuiz = () => {
    setIsGenerating(true);
    setGenerationSteps([{ text: 'Extracting key statistical concepts and formulas using NLP...', status: 'loading' }]);

    setTimeout(() => {
      setGenerationSteps(prev => [
        { ...prev[0], status: 'done' },
        { text: 'Chunking & Generating Semantic Embeddings...', status: 'loading' }
      ]);
    }, 900);

    setTimeout(() => {
      setGenerationSteps(prev => [
        prev[0],
        { ...prev[1], status: 'done' },
        { text: `Applying Bloom's Taxonomy filters for ${currentTier} tier...`, status: 'loading' }
      ]);
    }, 1800);

    setTimeout(() => {
      setGenerationSteps(prev => [
        prev[0], prev[1],
        { ...prev[2], status: 'done' },
        { text: 'Linking Grounded Citations & Formatting MCQs...', status: 'loading' }
      ]);
    }, 2600);

    setTimeout(() => {
      setIsGenerating(false);
      
      let docId = selectedDoc.id;
      let questions = [];

      if (isCustomMode) {
        const fileName = uploadedFiles.length > 0 ? uploadedFiles[0].name : 'Pasted Text';
        questions = generateDynamicQuestions(customText, questionCount, currentTier, fileName);
      } else {
        if (selectedDoc.title.toLowerCase().includes('gva')) docId = 'doc_nas_gva_2025';
        else if (selectedDoc.title.toLowerCase().includes('dpdp')) docId = 'doc_dpdp_act_2023';
        else docId = 'doc_plfs_2025';

        // Get static questions
        const staticQs = getQuestionsForTier(docId, currentTier, questionCount);
        
        // If not enough static questions, generate dynamic ones to fill the gap
        if (staticQs.length < questionCount) {
          const needed = questionCount - staticQs.length;
          const dynamicQs = generateDynamicQuestions(selectedDoc.title + " " + selectedDoc.category, needed, currentTier, selectedDoc.title);
          questions = [...staticQs, ...dynamicQs];
        } else {
          questions = staticQs;
        }
      }

      setGeneratedQuiz({
        title: isCustomMode ? "Custom Uploaded Document Assessment" : selectedDoc.title,
        category: isCustomMode ? "User Document NLP Generation" : selectedDoc.category,
        questionsCount: questions.length,
        difficultyTier: currentTier,
        questions
      });
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setIsSubmitted(false);
    }, 3500);
  };

  const handleOptionSelect = (qId, optionIdx) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    if (!generatedQuiz) return 0;
    let score = 0;
    generatedQuiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) score += 1;
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    // Simulate mapping back to competencies
    const results = generatedQuiz.questions.map(q => {
      let compId = 'survey_design';
      if (q.id.includes('nas')) compId = 'national_accounts';
      if (q.id.includes('dpdp')) compId = 'data_privacy';
      
      return {
        competencyId: compId,
        correct: userAnswers[q.id] === q.correctAnswer,
        timeMs: 45000 // mock time
      };
    });
    recordQuizResult(results);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(234,88,12,0.08) 0%, rgba(15,44,89,0.06) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-saffron" style={{ marginBottom: '8px' }}>
              <Sparkles size={14} /> AI-Powered Intelligent Assessment Engine
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Adaptive MCQ Generator & RAG Citations</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Upload MoSPI manuals to generate textbook-grade MCQs. Difficulty adapts based on your prior performance, with exact document citations for incorrect answers.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-navy"><Sigma size={14} /> Math Typography Active</span>
          </div>
        </div>
      </div>

      {!generatedQuiz ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Source Doc Selection */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--navy-primary)" />
              1. Select Learning Material
            </h3>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'var(--bg-main)', padding: '4px', borderRadius: '10px' }}>
              <button
                onClick={() => setIsCustomMode(false)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  background: !isCustomMode ? 'var(--bg-card)' : 'transparent',
                  color: !isCustomMode ? 'var(--navy-primary)' : 'var(--text-muted)',
                  fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
                  boxShadow: !isCustomMode ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Pre-Loaded MoSPI Documents
              </button>
              <button
                onClick={() => setIsCustomMode(true)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  background: isCustomMode ? 'var(--bg-card)' : 'transparent',
                  color: isCustomMode ? 'var(--navy-primary)' : 'var(--text-muted)',
                  fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
                  boxShadow: isCustomMode ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Upload File / Paste Text
              </button>
            </div>

            {!isCustomMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {SAMPLE_LEARNING_DOCUMENTS.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                      padding: '14px', borderRadius: '12px',
                      border: selectedDoc.id === doc.id ? '2px solid var(--saffron-main)' : '1px solid var(--border-color)',
                      background: selectedDoc.id === doc.id ? 'var(--saffron-light)' : 'var(--bg-main)',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{doc.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{doc.category}</span>
                      <span>{doc.pagesCount} Pages</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    border: '2px dashed var(--border-color)',
                    padding: '24px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    background: 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}>
                    <Upload size={24} color="var(--navy-primary)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--navy-primary)' }}>
                      Upload Documents or Images
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Supports PDF, DOCX, JPG, PNG, etc.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          const files = Array.from(e.target.files);
                          setUploadedFiles(prev => [...prev, ...files]);
                          
                          // Try to read text if it's a text file
                          const file = files[0];
                          if (file.name.endsWith('.txt') || file.type === 'text/plain') {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              setCustomText(evt.target.result);
                            };
                            reader.readAsText(file);
                          } else if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
                            setCustomText(`[File Uploaded: ${file.name}] \nExtracting PDF content... Please wait.`);
                            const reader = new FileReader();
                            reader.onload = async (evt) => {
                              try {
                                const typedarray = new Uint8Array(evt.target.result);
                                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                                let fullText = '';
                                const maxPages = Math.min(pdf.numPages, 10); // Limit to first 10 pages for performance
                                for (let i = 1; i <= maxPages; i++) {
                                  const page = await pdf.getPage(i);
                                  const content = await page.getTextContent();
                                  const strings = content.items.map(item => item.str);
                                  fullText += strings.join(' ') + ' ';
                                }
                                setCustomText(fullText || `[File Uploaded: ${file.name}] \nFailed to extract text from PDF. It may be an image-only PDF.`);
                              } catch (err) {
                                console.error('PDF parsing error', err);
                                setCustomText(`[File Uploaded: ${file.name}] \nFailed to parse PDF document.`);
                              }
                            };
                            reader.readAsArrayBuffer(file);
                          } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                            setCustomText(`[File Uploaded: ${file.name}] \nExtracting Word Document content... Please wait.`);
                            const reader = new FileReader();
                            reader.onload = async (evt) => {
                              try {
                                const arrayBuffer = evt.target.result;
                                const result = await mammoth.extractRawText({ arrayBuffer });
                                setCustomText(result.value || `[File Uploaded: ${file.name}] \nFailed to extract text from Word Document.`);
                              } catch (err) {
                                console.error('Docx parsing error', err);
                                setCustomText(`[File Uploaded: ${file.name}] \nFailed to parse Word document.`);
                              }
                            };
                            reader.readAsArrayBuffer(file);
                          } else {
                            // For Images/others
                            setCustomText(`[File Uploaded: ${file.name}] \nParsing not supported for this file type offline. Please paste raw text for specific extraction.`);
                          }
                        }
                      }}
                      style={{ opacity: 0, position: 'absolute', width: '1px', height: '1px' }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="btn-outline" style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.8rem', padding: '6px 12px' }}>
                      Browse Files
                    </label>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>OR</div>
                  <textarea
                    placeholder="Paste learning document content text directly here... (Tip: Mention PLFS, GVA, or DPDP)"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    rows={4}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px',
                      border: '1px solid var(--border-color)', background: 'var(--bg-card)',
                      color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'inherit'
                    }}
                  />
                </div>
                
                {/* Right side summary */}
                <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>Uploaded Documents Summary</h4>
                  {uploadedFiles.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                      {uploadedFiles.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                          <FileText size={16} color="var(--navy-primary)" />
                          <div style={{ fontSize: '0.75rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No files uploaded yet.</div>
                  )}
                  {customText.length > 50 && (
                    <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--navy-primary)', marginBottom: '4px' }}>Extracted Text snippet:</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{customText.substring(0, 80)}...</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Settings & Generation */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="var(--saffron-main)" />
                2. AI Assessment Parameters
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                    Auto-Detected Difficulty Tier
                  </label>
                  <AdaptiveDifficultyBadge 
                    tier={currentTier} 
                    accuracy={overallStats.overallAccuracy} 
                    attemptCount={overallStats.totalAttempts} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Number of MCQs
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[5, 12, 20].map(n => (
                      <button
                        key={n}
                        onClick={() => setQuestionCount(n)}
                        style={{
                          flex: 1, padding: '8px', borderRadius: '8px',
                          border: questionCount === n ? '2px solid var(--navy-primary)' : '1px solid var(--border-color)',
                          background: questionCount === n ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                          color: questionCount === n ? 'var(--navy-primary)' : 'var(--text-main)',
                          fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button
                disabled={isGenerating}
                onClick={handleGenerateQuiz}
                className="btn-saffron"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              >
                {isGenerating ? (
                  <span>AI Parsing Document...</span>
                ) : (
                  <>
                    <Sparkles size={18} /> Generate Adaptive Quiz <ArrowRight size={18} />
                  </>
                )}
              </button>
              {isGenerating && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--saffron-main)', marginBottom: '4px' }}>RAG Pipeline Execution:</div>
                  {generationSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: step.status === 'done' ? '#10B981' : 'var(--text-main)' }}>
                      {step.status === 'done' ? <CheckCircle2 size={16} /> : <RefreshCw size={16} className="pulse-glow" />}
                      <span style={{ fontWeight: step.status === 'loading' ? '600' : '500' }}>{step.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Generated Quiz Room */
        <div className="glass-card" style={{ padding: '28px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-saffron">Assessment</span>
                <AdaptiveDifficultyBadge tier={generatedQuiz.difficultyTier} accuracy={overallStats.overallAccuracy} attemptCount={0} compact={true} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{generatedQuiz.title}</h3>
            </div>
            <button 
              onClick={() => setGeneratedQuiz(null)} 
              className="btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} /> Exit Quiz
            </button>
          </div>

          {isSubmitted && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                marginTop: '20px', padding: '20px 24px', borderRadius: '16px', 
                background: calculateScore() >= (generatedQuiz.questionsCount / 2) ? 'var(--emerald-light)' : 'var(--saffron-light)', 
                border: `2px solid ${calculateScore() >= (generatedQuiz.questionsCount / 2) ? 'var(--emerald-main)' : 'var(--saffron-main)'}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
              }}>
                <div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: calculateScore() >= (generatedQuiz.questionsCount / 2) ? 'var(--emerald-main)' : 'var(--saffron-main)' }}>
                    Score: {calculateScore()} / {generatedQuiz.questionsCount}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Your performance has been recorded. The adaptive engine will calibrate future difficulty.
                  </p>
                </div>
              </div>

              {/* Recommended Courses Section */}
              <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--saffron-main)" />
                  Suggested Improvement Topics & Recommended Courses
                </h4>
                
                {(() => {
                  // Dynamically extract keywords from the text to suggest topics
                  const words = (customText || "").split(/\W+/).filter(w => w.length > 5);
                  const wordCounts = {};
                  words.forEach(w => { wordCounts[w.toLowerCase()] = (wordCounts[w.toLowerCase()] || 0) + 1; });
                  const topWords = Object.entries(wordCounts).sort((a,b) => b[1] - a[1]).slice(0, 4).map(e => e[0]);
                  const topics = topWords.length > 0 ? topWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)) : ['Data Quality', 'Statistical Variance'];

                  // Try to find matching courses based on topics
                  let recommendedCourses = IGOT_COURSES.filter(course => 
                    topics.some(t => course.title.toLowerCase().includes(t.toLowerCase()) || course.description.toLowerCase().includes(t.toLowerCase()))
                  );
                  if (recommendedCourses.length === 0) {
                    recommendedCourses = [...IGOT_COURSES].sort(() => Math.random() - 0.5).slice(0, 2);
                  } else {
                    recommendedCourses = recommendedCourses.slice(0, 2);
                  }

                  return (
                    <>
                      {/* Improvement Topics */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        {topics.map(topic => (
                          <span key={topic} style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', color: 'var(--saffron-main)', fontSize: '0.75rem', fontWeight: '700', border: '1px solid rgba(245,158,11,0.3)' }}>
                            Focus: {topic}
                          </span>
                        ))}
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        Based on the content you uploaded, these verified courses are recommended for you.
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                        {recommendedCourses.map(course => (
                    <a
                      key={course.id}
                      href={course.url || 'https://igotkarmayogi.gov.in/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        gap: '12px',
                        textDecoration: 'none',
                        color: 'inherit',
                        alignItems: 'center',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <img src={course.image} alt={course.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: '1.3', marginBottom: '4px' }}>
                          {course.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--navy-primary)', fontWeight: '600' }}>
                          {course.level} • {course.duration}
                        </div>
                      </div>
                      <ExternalLink size={16} color="var(--text-muted)" />
                    </a>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', margin: '20px 0', overflowX: 'auto' }}>
            {generatedQuiz.questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = currentQuestionIdx === idx;
              let btnStyle = {
                padding: '8px 16px', borderRadius: '10px',
                border: isCurrent ? '2px solid var(--navy-primary)' : '1px solid var(--border-color)',
                background: isCurrent ? 'var(--navy-primary)' : isAnswered ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-main)',
                color: isCurrent ? '#ffffff' : 'var(--text-main)',
                fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s ease'
              };

              return (
                <button key={q.id} onClick={() => setCurrentQuestionIdx(idx)} style={btnStyle}>
                  Q{idx + 1} {isAnswered && '✓'}
                </button>
              );
            })}
          </div>

          {(() => {
            if (generatedQuiz.questions.length === 0) return <div>No questions available for this tier.</div>;
            const q = generatedQuiz.questions[currentQuestionIdx];
            const selectedOpt = userAnswers[q.id];
            const isCorrect = isSubmitted && q.correctAnswer === selectedOpt;

            return (
              <div style={{ padding: '24px', borderRadius: '18px', background: 'var(--bg-main)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--navy-primary)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sigma size={16} /> Question {currentQuestionIdx + 1} of {generatedQuiz.questionsCount}
                  <span style={{ marginLeft: 'auto', background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(124, 58, 237, 0.3)', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'none' }}>
                    <Layers size={14} /> Cognitive Skill: <strong>{q.bloomVerb}</strong> ({generatedQuiz.difficultyTier})
                  </span>
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '24px', lineHeight: '1.6' }}>
                  <MathFormattedText text={q.question} />
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const optIsCorrect = q.correctAnswer === optIdx;

                    let bg = 'var(--bg-card)';
                    let border = '1px solid var(--border-color)';
                    let icon = null;

                    if (isSubmitted) {
                      if (optIsCorrect) {
                        bg = 'rgba(16,185,129,0.1)'; border = '2px solid #10B981';
                        icon = <CheckCircle2 size={20} color="#10B981" />;
                      } else if (isSelected) {
                        bg = 'rgba(239,68,68,0.1)'; border = '2px solid #EF4444';
                        icon = <XCircle size={20} color="#EF4444" />;
                      }
                    } else if (isSelected) {
                      bg = 'rgba(59, 130, 246, 0.1)'; border = '2px solid var(--navy-primary)';
                    }

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleOptionSelect(q.id, optIdx)}
                        style={{
                          padding: '16px 20px', borderRadius: '14px', background: bg, border: border,
                          cursor: isSubmitted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          fontWeight: isSelected ? '700' : '500', fontSize: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ 
                            width: '32px', height: '32px', borderRadius: '50%', 
                            background: isSelected ? 'var(--navy-primary)' : 'var(--bg-main)', 
                            color: isSelected ? '#ffffff' : 'var(--navy-primary)',
                            border: isSelected ? 'none' : '1px solid var(--border-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.88rem', fontWeight: '800'
                          }}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span style={{ flex: 1 }}><MathFormattedText text={opt} /></span>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {isSubmitted && selectedOpt !== undefined && (
                  <RemediationCard question={q} userAnswerIdx={selectedOpt} isCorrect={isCorrect} />
                )}

              </div>
            );
          })()}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
              className="btn-outline"
            >
              Previous Question
            </button>

            {!isSubmitted ? (
              <button
                disabled={Object.keys(userAnswers).length < generatedQuiz.questionsCount}
                onClick={handleSubmit}
                className="btn-saffron"
              >
                Submit Exam & Calibrate
              </button>
            ) : (
              <button
                disabled={currentQuestionIdx === generatedQuiz.questionsCount - 1}
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                className="btn-primary"
              >
                Next Question <ArrowRight size={16} />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
