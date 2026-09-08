/**
 * Karmayogi Competency Model (KCM) / FRAC Data Layer
 *
 * Tri-Pillar Classification:
 *   BEHAVIOURAL  — Civil service values, ethics, citizen-centricity
 *   FUNCTIONAL   — Operational & management skills (cross-cutting)
 *   DOMAIN       — MoSPI/ISS-specific technical statistical skills
 *
 * Each competency node has:
 *   - id, pillar, name, shortName, description
 *   - level: required proficiency for current role (1–5)
 *   - prerequisites: [] array of competency IDs that must be ≥3 before this unlocks
 *   - igotCourseIds: matching course IDs from the iGOT catalogue
 *   - kcmCode: official FRAC code reference
 */

// ─── PILLAR METADATA ─────────────────────────────────────────────────────────
export const KCM_PILLARS = {
  BEHAVIOURAL: {
    id: 'BEHAVIOURAL',
    label: 'Behavioural',
    color: '#7C3AED',       // violet
    lightColor: 'rgba(124,58,237,0.08)',
    borderColor: 'rgba(124,58,237,0.35)',
    description: 'Core civil service values — integrity, citizen-centricity, empathy, and constitutional conduct.',
    icon: 'Heart',
  },
  FUNCTIONAL: {
    id: 'FUNCTIONAL',
    label: 'Functional',
    color: '#0F6FE8',       // blue
    lightColor: 'rgba(15,111,232,0.08)',
    borderColor: 'rgba(15,111,232,0.35)',
    description: 'Cross-cutting operational and management skills applicable across MoSPI divisions.',
    icon: 'Settings',
  },
  DOMAIN: {
    id: 'DOMAIN',
    label: 'Domain',
    color: '#0F766E',       // teal
    lightColor: 'rgba(15,118,110,0.08)',
    borderColor: 'rgba(15,118,110,0.35)',
    description: 'MoSPI & ISS-specific technical statistical skills — surveys, national accounts, AI/ML.',
    icon: 'BarChart3',
  },
};

// ─── NODE STATUS COLOUR TOKENS ────────────────────────────────────────────────
export const NODE_STATUS = {
  PROFICIENT:    { id: 'PROFICIENT',  color: '#10B981', bg: 'rgba(16,185,129,0.12)', label: 'Proficient / Completed' },
  GAP:           { id: 'GAP',         color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Current Gap' },
  LOCKED:        { id: 'LOCKED',      color: '#6B7280', bg: 'rgba(107,114,128,0.10)', label: 'Locked / Future Role' },
  CRITICAL_PATH: { id: 'CRITICAL_PATH', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'Critical Path Gap' },
};

// ─── KCM COMPETENCY NODES ─────────────────────────────────────────────────────
export const KCM_COMPETENCIES = [

  // ── BEHAVIOURAL PILLAR ──────────────────────────────────────────────────────
  {
    id: 'ethics_integrity',
    pillar: 'BEHAVIOURAL',
    kcmCode: 'KCM-BEH-01',
    name: 'Ethics, Integrity & Constitutional Conduct',
    shortName: 'Ethics & Integrity',
    description: 'Upholding constitutional values, probity in public life, and zero-tolerance for data manipulation. Includes adherence to the UN Fundamental Principles of Official Statistics.',
    prerequisites: [],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'citizen_centricity',
    pillar: 'BEHAVIOURAL',
    kcmCode: 'KCM-BEH-02',
    name: 'Citizen-Centricity & Public Service Orientation',
    shortName: 'Citizen-Centricity',
    description: 'Keeping citizens as end-beneficiaries — designing surveys and dissemination strategies that maximise social impact and data accessibility.',
    prerequisites: ['ethics_integrity'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'change_mgmt',
    pillar: 'BEHAVIOURAL',
    kcmCode: 'KCM-BEH-03',
    name: 'Change Management & Digital Transformation',
    shortName: 'Change Management',
    description: 'Leading organisational transformation in statistical offices — adopting digital tools, CAPI, cloud systems, and AI without disrupting data quality.',
    prerequisites: ['citizen_centricity'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'leadership',
    pillar: 'BEHAVIOURAL',
    kcmCode: 'KCM-BEH-04',
    name: 'Strategic Leadership in Statistical Governance',
    shortName: 'Strategic Leadership',
    description: 'Setting vision and direction for statistical systems. Managing multi-thousand field investigator teams and inter-ministerial coordination for data ecosystems.',
    prerequisites: ['change_mgmt', 'project_mgmt'],
    igotCourseIds: ['IGOT-MGMT-501'],
    nsstaProgIds: [],
  },

  // ── FUNCTIONAL PILLAR ───────────────────────────────────────────────────────
  {
    id: 'project_mgmt',
    pillar: 'FUNCTIONAL',
    kcmCode: 'KCM-FUN-01',
    name: 'Public Sector Project & Field Team Management',
    shortName: 'Project Management',
    description: 'Planning, scheduling, and monitoring large-scale field surveys (PLFS, HCES, ASI). Coordinating between FSU-level supervisors, state DES offices, and central processing units.',
    prerequisites: [],
    igotCourseIds: [],
    nsstaProgIds: ['TPAC-2026-02'],
  },
  {
    id: 'public_comm',
    pillar: 'FUNCTIONAL',
    kcmCode: 'KCM-FUN-02',
    name: 'Data Storytelling & Stakeholder Communication',
    shortName: 'Data Communication',
    description: 'Translating complex statistical outputs into accessible narratives for policy makers, media, and the public. Includes press release writing, infographic design, and parliamentary brief preparation.',
    prerequisites: ['ethics_integrity'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'dpdp_privacy',
    pillar: 'FUNCTIONAL',
    kcmCode: 'KCM-FUN-03',
    name: 'Data Privacy & DPDP Act 2023 Compliance',
    shortName: 'Data Privacy (DPDP)',
    description: 'Legal obligations under the Digital Personal Data Protection Act 2023. Includes k-anonymity, differential privacy techniques, and respondent microdata safeguards before public dissemination.',
    prerequisites: ['ethics_integrity'],
    igotCourseIds: ['IGOT-GOV-401'],
    nsstaProgIds: [],
  },
  {
    id: 'cybersecurity',
    pillar: 'FUNCTIONAL',
    kcmCode: 'KCM-FUN-04',
    name: 'Cybersecurity & Official Data Protection',
    shortName: 'Cybersecurity',
    description: 'Securing survey microdata, national accounts databases, and e-Office workflows against breaches. CERT-In compliance and incident response protocols.',
    prerequisites: ['dpdp_privacy'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'digital_signatures',
    pillar: 'FUNCTIONAL',
    kcmCode: 'KCM-FUN-05',
    name: 'Digital Signatures & e-Office Workflows',
    shortName: 'e-Office & DSC',
    description: 'Proficiency in NIC e-Office platform, digital signature certificates (DSC), and paperless file movement within MoSPI headquarters and regional offices.',
    prerequisites: [],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'govt_cloud',
    pillar: 'FUNCTIONAL',
    kcmCode: 'KCM-FUN-06',
    name: 'MeghRaj Government Cloud & Infrastructure',
    shortName: 'Govt Cloud (MeghRaj)',
    description: 'Deploying and managing statistical databases, dashboards, and data pipelines on NIC MeghRaj cloud. Includes GI Cloud policy, data residency, and SLA management.',
    prerequisites: ['digital_signatures', 'cybersecurity'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'dpi_integration',
    pillar: 'FUNCTIONAL',
    kcmCode: 'KCM-FUN-07',
    name: 'Digital Public Infrastructure (DPI) & India Stack',
    shortName: 'DPI & India Stack',
    description: 'Integrating MoSPI data systems with Aadhaar e-KYC, DigiLocker, ONDC, Open Credit Enablement Network, and UPI data APIs for enriched administrative records.',
    prerequisites: ['govt_cloud'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },

  // ── DOMAIN PILLAR ───────────────────────────────────────────────────────────
  {
    id: 'survey_design',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-01',
    name: 'Survey Design & Questionnaire Formulation',
    shortName: 'Survey Design',
    description: 'Designing statistically valid questionnaires for large-scale NSSO rounds — PLFS, HCES, MFI. Includes cognitive testing, pilot surveys, and translation of complex concepts into verifiable survey items.',
    prerequisites: [],
    igotCourseIds: [],
    nsstaProgIds: ['TPAC-2026-02'],
  },
  {
    id: 'sampling_theory',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-02',
    name: 'Sampling Theory & Calibration Weights',
    shortName: 'Sampling Theory',
    description: 'Multi-stage stratified sampling designs, Horvitz-Thompson estimation, non-response adjustments, and post-stratification calibration weights for NSSO surveys.',
    prerequisites: ['survey_design'],
    igotCourseIds: ['IGOT-STAT-101'],
    nsstaProgIds: [],
  },
  {
    id: 'national_accounts',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-03',
    name: 'National Accounts — GDP / GVA Computation',
    shortName: 'National Accounts',
    description: 'SNA 2008 framework, sequence of accounts, GVA estimation by industry, GDP reconciliation across production, income, and expenditure approaches.',
    prerequisites: ['sampling_theory'],
    igotCourseIds: ['IGOT-STAT-204'],
    nsstaProgIds: ['TPAC-2026-03'],
  },
  {
    id: 'price_statistics',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-04',
    name: 'Price Statistics — CPI / WPI Construction',
    shortName: 'Price Statistics',
    description: 'Consumer Price Index and Wholesale Price Index compilation methodology. Basket selection, price collection, index aggregation, and seasonal adjustment techniques.',
    prerequisites: ['national_accounts'],
    igotCourseIds: [],
    nsstaProgIds: ['TPAC-2026-03'],
  },
  {
    id: 'labour_stats',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-05',
    name: 'Labour & Social Statistics (PLFS Standards)',
    shortName: 'Labour Statistics',
    description: 'ILO-compliant measurement of employment, unemployment, and labour force participation. PLFS Usual Principal Status (UPS) and Current Weekly Status (CWS) concepts.',
    prerequisites: ['survey_design'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'sdg_indicators',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-06',
    name: 'SDG Indicators & Global Monitoring Framework',
    shortName: 'SDG Indicators',
    description: 'UN 2030 Agenda indicator methodology, India VNR reporting, and coordination with MOSPI\'s National Indicator Framework (NIF) for tracking 306+ SDG indicators.',
    prerequisites: ['labour_stats', 'national_accounts'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'data_quality',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-07',
    name: 'Metadata & Data Quality Assurance Frameworks',
    shortName: 'Data Quality (DQAF)',
    description: 'IMF Data Quality Assessment Framework (DQAF), UN SDMX metadata standards, and internal MoSPI quality audit protocols across NSO data products.',
    prerequisites: ['sampling_theory'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'python_stats',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-08',
    name: 'Python for Statistical Computing & Automated Pipelines',
    shortName: 'Python / Pandas',
    description: 'NumPy, Pandas, SciPy, and Statsmodels for survey data cleaning, tabulation, and automated NSSO report generation. Building data pipelines from CAPI output to publishable tables.',
    prerequisites: ['data_quality'],
    igotCourseIds: ['IGOT-TECH-302'],
    nsstaProgIds: ['TPAC-2026-01'],
  },
  {
    id: 'r_programming',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-09',
    name: 'R & R-Shiny Interactive Dashboard Development',
    shortName: 'R / R-Shiny',
    description: 'survey, srvyr, and complex sampling packages in R. Building interactive R-Shiny dashboards for district-level PLFS visualisations and NSO indicator monitoring.',
    prerequisites: ['python_stats'],
    igotCourseIds: [],
    nsstaProgIds: ['TPAC-2026-01'],
  },
  {
    id: 'sql_db',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-10',
    name: 'SQL & Enterprise Statistical Databases',
    shortName: 'SQL & Databases',
    description: 'PostgreSQL/Oracle query design for NSSO microdata repositories. Joins, window functions, and aggregations for generating official tabulation outputs from survey unit-level databases.',
    prerequisites: ['data_quality'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'stata_spss',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-11',
    name: 'Stata / SPSS Econometric & Survey Packages',
    shortName: 'Stata / SPSS',
    description: 'Stata\'s svy complex survey estimators, svyset, and postestimation for variance estimation. SPSS for legacy NSSO survey datasets and manual tabulation verification.',
    prerequisites: ['sampling_theory'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
  {
    id: 'gis_spatial',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-12',
    name: 'GIS & Spatial Analytics for Surveys',
    shortName: 'GIS / Spatial',
    description: 'QGIS and ArcGIS for sampling frame digitisation, geo-tagging FSUs, and spatial distribution of economic and social indicators at sub-district level.',
    prerequisites: ['survey_design', 'sql_db'],
    igotCourseIds: ['IGOT-TECH-310'],
    nsstaProgIds: [],
  },
  {
    id: 'aiml_official',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-13',
    name: 'Machine Learning & AI for Official Statistics',
    shortName: 'AI/ML (Official)',
    description: 'Applying NLP transformers for NCO/NIC occupation coding, satellite imagery for crop production estimates, and anomaly detection in price collection data. LLM integration with NSO workflows.',
    prerequisites: ['python_stats', 'r_programming'],
    igotCourseIds: ['IGOT-TECH-320'],
    nsstaProgIds: ['TPAC-2026-01'],
  },
  {
    id: 'cloud_apis',
    pillar: 'DOMAIN',
    kcmCode: 'KCM-DOM-14',
    name: 'Cloud Computing & Open Data APIs',
    shortName: 'Cloud & Open APIs',
    description: 'Building and consuming RESTful APIs for public data dissemination. Integration with data.gov.in, SDMX web services, and cloud-hosted statistical databases.',
    prerequisites: ['govt_cloud', 'sql_db'],
    igotCourseIds: [],
    nsstaProgIds: [],
  },
];

// ─── ROLE PROFILES ─────────────────────────────────────────────────────────────
// Each role specifies required proficiency level per competency.
// Missing entries default to 0 (not required for that role).
export const ROLE_PROFILES = {
  JSO: {
    id: 'JSO',
    title: 'Junior Statistical Officer (JSO)',
    cadre: 'SSS',
    tier: 1,
    description: 'Entry-level field data collection, questionnaire administration, and basic tabulation.',
    competencyLevels: {
      ethics_integrity: 3, citizen_centricity: 2, change_mgmt: 1,
      project_mgmt: 2, public_comm: 1, dpdp_privacy: 2, digital_signatures: 3,
      survey_design: 3, sampling_theory: 2, labour_stats: 3, data_quality: 2,
      stata_spss: 2, sql_db: 2, python_stats: 1,
    },
  },
  SSO: {
    id: 'SSO',
    title: 'Senior Statistical Officer (SSO)',
    cadre: 'SSS',
    tier: 2,
    description: 'Survey supervision, data validation, and sectoral analysis responsibilities.',
    competencyLevels: {
      ethics_integrity: 4, citizen_centricity: 3, change_mgmt: 2,
      project_mgmt: 3, public_comm: 2, dpdp_privacy: 3, cybersecurity: 2, digital_signatures: 4,
      survey_design: 4, sampling_theory: 3, national_accounts: 2, labour_stats: 4,
      sdg_indicators: 2, data_quality: 3, stata_spss: 3, sql_db: 3, python_stats: 2, gis_spatial: 2,
    },
  },
  SRO: {
    id: 'SRO',
    title: 'Statistical Research Officer (SRO)',
    cadre: 'ISS',
    tier: 3,
    description: 'ISS entry-level — quantitative research, survey methodology development, and national estimates.',
    competencyLevels: {
      ethics_integrity: 4, citizen_centricity: 3, change_mgmt: 2,
      project_mgmt: 3, public_comm: 3, dpdp_privacy: 4, cybersecurity: 3,
      digital_signatures: 4, govt_cloud: 2,
      survey_design: 4, sampling_theory: 4, national_accounts: 3, price_statistics: 3,
      labour_stats: 4, sdg_indicators: 3, data_quality: 4,
      python_stats: 3, r_programming: 2, sql_db: 3, stata_spss: 4, gis_spatial: 3, aiml_official: 2,
    },
  },
  DSP: {
    id: 'DSP',
    title: 'Deputy Director / Dy. Statistician & Professor',
    cadre: 'ISS',
    tier: 4,
    description: 'Technical lead for a survey round or national accounts domain. Manages a team of SROs and SSOs.',
    competencyLevels: {
      ethics_integrity: 5, citizen_centricity: 4, change_mgmt: 3, leadership: 3,
      project_mgmt: 4, public_comm: 4, dpdp_privacy: 4, cybersecurity: 3,
      digital_signatures: 5, govt_cloud: 3, dpi_integration: 3,
      survey_design: 5, sampling_theory: 5, national_accounts: 4, price_statistics: 4,
      labour_stats: 4, sdg_indicators: 4, data_quality: 5,
      python_stats: 4, r_programming: 3, sql_db: 4, stata_spss: 4,
      gis_spatial: 4, aiml_official: 3, cloud_apis: 3,
    },
  },
  DDG: {
    id: 'DDG',
    title: 'Deputy Director General (DDG)',
    cadre: 'ISS',
    tier: 5,
    description: 'Senior-most technical authority for a MoSPI division — sets methodology, represents India in global statistical fora.',
    competencyLevels: {
      ethics_integrity: 5, citizen_centricity: 5, change_mgmt: 4, leadership: 5,
      project_mgmt: 5, public_comm: 5, dpdp_privacy: 5, cybersecurity: 4,
      digital_signatures: 5, govt_cloud: 4, dpi_integration: 4,
      survey_design: 5, sampling_theory: 5, national_accounts: 5, price_statistics: 5,
      labour_stats: 5, sdg_indicators: 5, data_quality: 5,
      python_stats: 4, r_programming: 4, sql_db: 4, stata_spss: 4,
      gis_spatial: 4, aiml_official: 4, cloud_apis: 4, cloud_apis: 4,
    },
  },
};

// ─── ROLE ORDERED LIST (for UI selector) ─────────────────────────────────────
export const ROLE_ORDER = ['JSO', 'SSO', 'SRO', 'DSP', 'DDG'];

// ─── CAPACITY BUILDING PLAN TEMPLATE ─────────────────────────────────────────
// Used by the gap engine to generate step-by-step plans
export const CBP_TIMELINES = {
  1: '2 Weeks',
  2: '1 Month',
  3: '2 Months',
  4: '3 Months',
  5: '4+ Months',
};
