/**
 * ragDocumentChunks.js
 * Simulates a RAG vector-store chunk index.
 *
 * Each chunk represents a logical paragraph from an official MoSPI document,
 * tagged with precise metadata so every AI-generated question can be grounded
 * to an exact page + section citation.
 *
 * Schema per chunk:
 *   chunkId         — globally unique identifier
 *   documentId      — matches SAMPLE_LEARNING_DOCUMENTS[].id
 *   documentName    — full title of the source document
 *   chapter         — e.g. "Chapter 2: Sample Design"
 *   section         — e.g. "Section 2.3"
 *   pageNumber      — page reference for the physical PDF
 *   tokenOffset     — simulated start-token in the full document for retrieval ranking
 *   excerpt         — 1–2 verbatim sentences directly from the source chunk
 *   keywords        — used to match against generated question topics
 */

export const RAG_DOCUMENT_CHUNKS = [

  // ═══════════════════════════════════════════════════════
  // DOC 1: PLFS Sampling Design Manual
  // ═══════════════════════════════════════════════════════

  {
    chunkId: 'plfs-c1-intro',
    documentId: 'doc_plfs_2025',
    documentName: 'MoSPI Periodic Labour Force Survey (PLFS) Sampling Design & Estimation Method',
    chapter: 'Chapter 1: Introduction to PLFS Sampling Design',
    section: 'Section 1.1 — Objectives and Coverage',
    pageNumber: 'pp. 1–3',
    tokenOffset: 0,
    excerpt: 'The Periodic Labour Force Survey (PLFS) was launched by the National Sample Survey Office (NSSO) in April 2017. The main objective of PLFS is to estimate key employment and unemployment indicators (viz. Worker Population Ratio, Labour Force Participation Rate, Unemployment Rate) within a short time interval of three months for urban areas and annually for both rural and urban areas.',
    keywords: ['PLFS', 'labour force', 'objectives', 'urban', 'rural', 'PLFS launch'],
  },
  {
    chunkId: 'plfs-c2-fsu',
    documentId: 'doc_plfs_2025',
    documentName: 'MoSPI Periodic Labour Force Survey (PLFS) Sampling Design & Estimation Method',
    chapter: 'Chapter 2: Sample Design',
    section: 'Section 2.0 — First Stage Units and Ultimate Stage Units',
    pageNumber: 'pp. 4–5',
    tokenOffset: 512,
    excerpt: 'A stratified multi-stage design has been adopted for the PLFS. The first stage units (FSU) are the Urban Frame Survey (UFS) blocks in urban areas and Census villages (Panchayat wards in Kerala) in rural areas. The Ultimate Stage Units (USU) are households in both sectors.',
    keywords: ['FSU', 'first stage unit', 'UFS blocks', 'census villages', 'stratified multi-stage'],
  },
  {
    chunkId: 'plfs-c2-strat-rural',
    documentId: 'doc_plfs_2025',
    documentName: 'MoSPI Periodic Labour Force Survey (PLFS) Sampling Design & Estimation Method',
    chapter: 'Chapter 2: Sample Design',
    section: 'Section 2.1 — Stratification in Rural Sector',
    pageNumber: 'pp. 5–6',
    tokenOffset: 768,
    excerpt: 'In rural sector, each district is treated as a stratum. However, if a district has a rural population of more than 2.5 million as per Census 2011, it is divided into two or more sub-strata by grouping contiguous tehsils.',
    keywords: ['stratification', 'rural', 'district', 'sub-strata', 'tehsils', '2.5 million'],
  },
  {
    chunkId: 'plfs-c2-strat-urban',
    documentId: 'doc_plfs_2025',
    documentName: 'MoSPI Periodic Labour Force Survey (PLFS) Sampling Design & Estimation Method',
    chapter: 'Chapter 2: Sample Design',
    section: 'Section 2.2 — Stratification in Urban Sector',
    pageNumber: 'pp. 6–7',
    tokenOffset: 1024,
    excerpt: 'In urban areas, strata are formed within each State/UT on the basis of population size of towns as per Census 2011. Towns with population 1 million or more form self-aggregating single strata.',
    keywords: ['stratification', 'urban', 'strata', 'population size', 'self-aggregating'],
  },
  {
    chunkId: 'plfs-c2-selection',
    documentId: 'doc_plfs_2025',
    documentName: 'MoSPI Periodic Labour Force Survey (PLFS) Sampling Design & Estimation Method',
    chapter: 'Chapter 2: Sample Design',
    section: 'Section 2.3 — Allocation and Selection of First Stage Units',
    pageNumber: 'pp. 7–8',
    tokenOffset: 1280,
    excerpt: 'Sample FSUs are selected with Probability Proportional to Size With Replacement (PPSWR) in rural areas using village population as size. In urban areas, FSUs are selected using Simple Random Sampling Without Replacement (SRSWOR).',
    keywords: ['PPSWR', 'SRSWOR', 'selection', 'FSU', 'probability proportional', 'simple random sampling'],
  },
  {
    chunkId: 'plfs-c3-multiplier',
    documentId: 'doc_plfs_2025',
    documentName: 'MoSPI Periodic Labour Force Survey (PLFS) Sampling Design & Estimation Method',
    chapter: 'Chapter 3: Estimation Procedure',
    section: 'Section 3.1 — Unbiased Multiplier Calculation',
    pageNumber: 'pp. 9–11',
    tokenOffset: 1792,
    excerpt: 'The unbiased multiplier M for the i-th FSU in the h-th stratum under PPSWR is calculated using the formula: M_hi = (1 / n_h) × (Z_h / z_hi), where Z_h is total stratum population size, z_hi is sample FSU size, and n_h is number of sampled FSUs.',
    keywords: ['multiplier', 'M_hi', 'estimation', 'formula', 'PPSWR', 'unbiased', 'stratum', 'n_h', 'Z_h'],
  },
  {
    chunkId: 'plfs-c1-frequency',
    documentId: 'doc_plfs_2025',
    documentName: 'MoSPI Periodic Labour Force Survey (PLFS) Sampling Design & Estimation Method',
    chapter: 'Chapter 1: Introduction to PLFS Sampling Design',
    section: 'Section 1.2 — Estimation Frequency',
    pageNumber: 'pp. 3–4',
    tokenOffset: 256,
    excerpt: 'PLFS estimates key employment indicators at quarterly frequency for urban areas, and annually for both rural and urban areas combined. This dual-frequency design allows timely monitoring of urban labour markets.',
    keywords: ['quarterly', 'annual', 'frequency', 'urban', 'estimation frequency', 'labour market monitoring'],
  },

  // ═══════════════════════════════════════════════════════
  // DOC 2: National Accounts GVA Manual
  // ═══════════════════════════════════════════════════════

  {
    chunkId: 'nas-s1-gva-concept',
    documentId: 'doc_nas_gva_2025',
    documentName: 'MoSPI National Accounts Statistics: GVA Estimation by Economic Activity',
    chapter: 'Section 1: Gross Value Added (GVA) Conceptual Framework',
    section: 'Section 1.1 — Definition and Measurement',
    pageNumber: 'pp. 1–2',
    tokenOffset: 0,
    excerpt: 'Gross Value Added (GVA) is defined as the value of output minus the value of intermediate consumption. GVA measures the contribution to the economy of each individual producer, industry, or sector.',
    keywords: ['GVA', 'gross value added', 'output', 'intermediate consumption', 'definition', 'SNA'],
  },
  {
    chunkId: 'nas-s2-agriculture',
    documentId: 'doc_nas_gva_2025',
    documentName: 'MoSPI National Accounts Statistics: GVA Estimation by Economic Activity',
    chapter: 'Section 2: Estimation of Agriculture & Allied Sectors',
    section: 'Section 2.1 — Production Approach for Crop Output',
    pageNumber: 'pp. 2–3',
    tokenOffset: 512,
    excerpt: 'Output of agriculture is estimated using the Production Approach. Volume of crop output is derived from the Crop Estimation Surveys (CES) conducted by Directorate of Economics and Statistics (DES) of respective State Governments. Producer prices (farmgate prices) during peak harvest periods are applied to obtain Gross Value of Output (GVO).',
    keywords: ['agriculture', 'production approach', 'CES', 'crop estimation', 'farmgate', 'GVO'],
  },
  {
    chunkId: 'nas-s3-manufacturing',
    documentId: 'doc_nas_gva_2025',
    documentName: 'MoSPI National Accounts Statistics: GVA Estimation by Economic Activity',
    chapter: 'Section 3: Estimation of Manufacturing Sector',
    section: 'Section 3.1 — Organized vs Unorganized Manufacturing',
    pageNumber: 'pp. 3–5',
    tokenOffset: 1024,
    excerpt: 'Organized Manufacturing is estimated using Annual Survey of Industries (ASI) data and corporate financial results filed with the Ministry of Corporate Affairs (MCA-21 database). Unorganized Manufacturing is estimated using benchmark survey results from NSS Enterprise Surveys extrapolated using indicators like IIP (Index of Industrial Production) and GST collections.',
    keywords: ['manufacturing', 'ASI', 'MCA-21', 'organized', 'unorganized', 'IIP', 'GST', 'enterprise survey'],
  },
  {
    chunkId: 'nas-s4-baseyear',
    documentId: 'doc_nas_gva_2025',
    documentName: 'MoSPI National Accounts Statistics: GVA Estimation by Economic Activity',
    chapter: 'Section 4: Base Year Revision Protocols',
    section: 'Section 4.1 — Rationale and Methodology for Revisions',
    pageNumber: 'pp. 5–7',
    tokenOffset: 1536,
    excerpt: 'Base year revisions are conducted periodically to reflect structural changes in the economy, update relative price structures, adopt latest international guidelines (SNA 2008/SNA 2025), and incorporate newly available long-term census data.',
    keywords: ['base year', 'revision', 'SNA 2008', 'SNA 2025', 'structural change', 'price structure'],
  },

  // ═══════════════════════════════════════════════════════
  // DOC 3: DPDP Act / Anonymization Guidelines
  // ═══════════════════════════════════════════════════════

  {
    chunkId: 'dpdp-s1-scope',
    documentId: 'doc_dpdp_act_2023',
    documentName: 'Guidelines on Data Anonymization & DPDP Act Compliance in Official Statistical Dissemination',
    chapter: 'Part 1: Scope and Obligations for Statistical Agencies',
    section: 'Section 1.1 — DPDP Act 2023 Overview',
    pageNumber: 'pp. 1–2',
    tokenOffset: 0,
    excerpt: 'The DPDP Act 2023 regulates the processing of digital personal data. While Section 17 provides exemptions for processing personal data necessary for research, archiving, or statistical purposes, strict technical safeguards must be enforced prior to public microdata release.',
    keywords: ['DPDP', 'Section 17', 'exemption', 'statistical', 'research', 'safeguards'],
  },
  {
    chunkId: 'dpdp-s2-kanonymity',
    documentId: 'doc_dpdp_act_2023',
    documentName: 'Guidelines on Data Anonymization & DPDP Act Compliance in Official Statistical Dissemination',
    chapter: 'Part 2: Statistical K-Anonymity and Differential Privacy',
    section: 'Section 2.1 — k-Anonymity Protocol',
    pageNumber: 'pp. 2–4',
    tokenOffset: 512,
    excerpt: 'To prevent re-identification attacks: Direct identifiers (Name, Aadhaar, Mobile number, exact GIS street coordinates) must be suppressed entirely. k-Anonymity Requirement: Every combination of quasi-identifiers in a published microdata release must match at least k=5 distinct individual respondents.',
    keywords: ['k-anonymity', 'k=5', 'quasi-identifier', 're-identification', 'Aadhaar', 'direct identifier', 'suppression'],
  },
  {
    chunkId: 'dpdp-s2-geo',
    documentId: 'doc_dpdp_act_2023',
    documentName: 'Guidelines on Data Anonymization & DPDP Act Compliance in Official Statistical Dissemination',
    chapter: 'Part 2: Statistical K-Anonymity and Differential Privacy',
    section: 'Section 2.2 — Geographic Aggregation Limits',
    pageNumber: 'pp. 4–5',
    tokenOffset: 768,
    excerpt: 'Quasi-Identifier Aggregation: Age must be grouped into 5-year cohorts. Geographical location is restricted to District level or State level for sample sizes less than 50 respondents to prevent spatial re-identification.',
    keywords: ['geographic', 'district level', 'age cohort', 'quasi-identifier', 'aggregation', 'small sample'],
  },
  {
    chunkId: 'dpdp-s3-penalties',
    documentId: 'doc_dpdp_act_2023',
    documentName: 'Guidelines on Data Anonymization & DPDP Act Compliance in Official Statistical Dissemination',
    chapter: 'Part 3: Penalties and Audit Trail Requirements',
    section: 'Section 3.1 — Financial Penalties Under DPDP Act',
    pageNumber: 'pp. 5–6',
    tokenOffset: 1024,
    excerpt: 'Failure to prevent data breach or unauthorized disclosure of non-anonymized microdata attracts financial penalties up to INR 250 Crores under the Data Protection Board of India mandate.',
    keywords: ['penalty', '250 crores', 'data breach', 'Data Protection Board', 'unauthorized disclosure', 'DPDP penalty'],
  },
];

/**
 * Look up a chunk by its ID.
 * @param {string} chunkId
 * @returns {object|undefined}
 */
export function getChunkById(chunkId) {
  return RAG_DOCUMENT_CHUNKS.find((c) => c.chunkId === chunkId);
}

/**
 * Find the most relevant chunk for a given document and keyword array.
 * Simple keyword-overlap scoring (simulates vector similarity).
 * @param {string} documentId
 * @param {string[]} keywords
 * @returns {object|undefined}
 */
export function findBestChunk(documentId, keywords) {
  const docChunks = RAG_DOCUMENT_CHUNKS.filter((c) => c.documentId === documentId);
  let best = null;
  let bestScore = -1;
  const kwLower = keywords.map((k) => k.toLowerCase());

  docChunks.forEach((chunk) => {
    const score = chunk.keywords.filter((kw) =>
      kwLower.some((q) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()))
    ).length;
    if (score > bestScore) {
      bestScore = score;
      best = chunk;
    }
  });

  return best;
}
