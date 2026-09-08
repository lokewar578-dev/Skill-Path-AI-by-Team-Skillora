// MoSPI Official Competency Framework & Learning Platform Mock Data Engine

export const COMPETENCY_DOMAINS = {
  STATISTICAL: {
    id: 'STATISTICAL',
    title: 'Statistical Competencies',
    icon: 'BarChart3',
    description: 'Survey methodology, national accounting, price indices, sampling, and SDG metrics.',
    skills: [
      { id: 'survey_design', name: 'Survey Design & Questionnaire Formulation', weight: 1.0 },
      { id: 'sampling_theory', name: 'Sampling Theory & Weight Calibration', weight: 1.0 },
      { id: 'national_accounts', name: 'National Accounts (GDP / GVA Computation)', weight: 1.2 },
      { id: 'price_statistics', name: 'Price Statistics (CPI / WPI Construction)', weight: 1.0 },
      { id: 'labour_stats', name: 'Labour & Social Statistics (PLFS Standards)', weight: 0.9 },
      { id: 'sdg_indicators', name: 'SDG Indicators & Global Monitoring', weight: 0.8 },
      { id: 'data_quality', name: 'Metadata & Data Quality Assurance Frameworks', weight: 1.1 }
    ]
  },
  TECHNICAL: {
    id: 'TECHNICAL',
    title: 'Technical & Analytical Competencies',
    icon: 'Code',
    description: 'Statistical computing, programming languages, GIS, AI/ML, and cloud tools.',
    skills: [
      { id: 'python_stats', name: 'Python for Statistical Computing & Pandas', weight: 1.2 },
      { id: 'r_programming', name: 'R & R-Shiny Dashboard Development', weight: 1.1 },
      { id: 'sql_db', name: 'SQL & Enterprise Relational Databases', weight: 1.0 },
      { id: 'stata_spss', name: 'Stata / SPSS Econometric Packages', weight: 0.9 },
      { id: 'gis_spatial', name: 'GIS & Spatial Analytics (QGIS / ArcGIS)', weight: 1.1 },
      { id: 'aiml_official', name: 'Machine Learning & AI for Official Statistics', weight: 1.3 },
      { id: 'cloud_apis', name: 'Cloud Computing & Open Data APIs', weight: 1.0 }
    ]
  },
  DIGITAL_GOVERNANCE: {
    id: 'DIGITAL_GOVERNANCE',
    title: 'Digital Governance & Security',
    icon: 'ShieldCheck',
    description: 'Data privacy, DPDP Act 2023, cyber resilience, e-Office, and Cloud DPI.',
    skills: [
      { id: 'dpdp_privacy', name: 'Data Privacy & DPDP Act 2023 Compliance', weight: 1.2 },
      { id: 'cybersecurity', name: 'Cybersecurity & Official Data Protection', weight: 1.1 },
      { id: 'digital_signatures', name: 'Digital Signatures & e-Office Workflows', weight: 0.8 },
      { id: 'govt_cloud', name: 'MeghRaj Government Cloud & Infrastructure', weight: 1.0 },
      { id: 'dpi_integration', name: 'Digital Public Infrastructure (DPI) & India Stack', weight: 1.0 }
    ]
  },
  BEHAVIOURAL: {
    id: 'BEHAVIOURAL',
    title: 'Behavioural & Managerial Competencies',
    icon: 'Users',
    description: 'Leadership, strategic decision making, public communication, and ethics.',
    skills: [
      { id: 'leadership', name: 'Strategic Leadership in Statistical Governance', weight: 1.1 },
      { id: 'public_comm', name: 'Data Storytelling & Media Communication', weight: 1.0 },
      { id: 'project_mgmt', name: 'Public Sector Project & Field Team Management', weight: 1.1 },
      { id: 'ethics_integrity', name: 'Official Statistics Code of Ethics & Professional Integrity', weight: 1.2 },
      { id: 'change_mgmt', name: 'Digital Transformation & Change Management', weight: 1.0 }
    ]
  }
};

export const OFFICIAL_PERSONAS = [
  {
    id: 'persona_1',
    name: 'Dr. Rajesh Kumar Sharma',
    cadre: 'ISS (Indian Statistical Service)',
    designation: 'Deputy Director General',
    division: 'National Accounts Division (NAD)',
    location: 'MoSPI Hqrs, New Delhi',
    email: 'rajesh.sharma@mospi.gov.in',
    phone: '9876543210',
    experienceYears: 14,
    education: 'Ph.D. in Econometrics (ISI Kolkata)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    currentCompetencies: {
      survey_design: 4,
      sampling_theory: 5,
      national_accounts: 5,
      price_statistics: 4,
      labour_stats: 3,
      sdg_indicators: 4,
      data_quality: 5,
      python_stats: 2,
      r_programming: 3,
      sql_db: 3,
      stata_spss: 4,
      gis_spatial: 2,
      aiml_official: 2,
      cloud_apis: 2,
      dpdp_privacy: 3,
      cybersecurity: 3,
      digital_signatures: 4,
      govt_cloud: 3,
      dpi_integration: 3,
      leadership: 4,
      public_comm: 4,
      project_mgmt: 4,
      ethics_integrity: 5,
      change_mgmt: 3
    },
    targetCompetencies: {
      survey_design: 5,
      sampling_theory: 5,
      national_accounts: 5,
      price_statistics: 5,
      labour_stats: 4,
      sdg_indicators: 5,
      data_quality: 5,
      python_stats: 4,
      r_programming: 4,
      sql_db: 4,
      stata_spss: 4,
      gis_spatial: 4,
      aiml_official: 4,
      cloud_apis: 4,
      dpdp_privacy: 5,
      cybersecurity: 4,
      digital_signatures: 5,
      govt_cloud: 4,
      dpi_integration: 4,
      leadership: 5,
      public_comm: 5,
      project_mgmt: 5,
      ethics_integrity: 5,
      change_mgmt: 5
    },
    completedCoursesCount: 18,
    learningHoursTotal: 142
  },
  {
    id: 'persona_2',
    name: 'Smt. Ananya Sen',
    cadre: 'SSS (Subordinate Statistical Service)',
    designation: 'Senior Statistical Officer (SSO)',
    division: 'Field Operations Division (FOD)',
    location: 'Regional Office, Kolkata',
    email: 'priya.sen@mospi.gov.in',
    phone: '9123456789',
    experienceYears: 8,
    education: 'M.Sc. Statistics (Calcutta University)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    currentCompetencies: {
      survey_design: 3,
      sampling_theory: 3,
      national_accounts: 2,
      price_statistics: 4,
      labour_stats: 5,
      sdg_indicators: 3,
      data_quality: 4,
      python_stats: 3,
      r_programming: 2,
      sql_db: 4,
      stata_spss: 3,
      gis_spatial: 3,
      aiml_official: 1,
      cloud_apis: 2,
      dpdp_privacy: 4,
      cybersecurity: 3,
      digital_signatures: 5,
      govt_cloud: 2,
      dpi_integration: 3,
      leadership: 2,
      public_comm: 3,
      project_mgmt: 3,
      ethics_integrity: 5,
      change_mgmt: 2
    },
    targetCompetencies: {
      survey_design: 4,
      sampling_theory: 4,
      national_accounts: 3,
      price_statistics: 5,
      labour_stats: 5,
      sdg_indicators: 4,
      data_quality: 5,
      python_stats: 4,
      r_programming: 4,
      sql_db: 5,
      stata_spss: 4,
      gis_spatial: 4,
      aiml_official: 3,
      cloud_apis: 3,
      dpdp_privacy: 5,
      cybersecurity: 4,
      digital_signatures: 5,
      govt_cloud: 3,
      dpi_integration: 4,
      leadership: 4,
      public_comm: 4,
      project_mgmt: 4,
      ethics_integrity: 5,
      change_mgmt: 4
    },
    completedCoursesCount: 12,
    learningHoursTotal: 86
  },
  {
    id: 'persona_3',
    name: 'Shri Vikramaditya Verma',
    cadre: 'ISS (Indian Statistical Service)',
    designation: 'Director',
    division: 'Survey Design & Research Division (SDRD)',
    location: 'Mahalanobis Bhavan, Kolkata',
    email: 'amit.verma@nic.in',
    phone: '9988776655',
    experienceYears: 19,
    education: 'M.Stat (ISI Kolkata)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    currentCompetencies: {
      survey_design: 5,
      sampling_theory: 5,
      national_accounts: 3,
      price_statistics: 3,
      labour_stats: 4,
      sdg_indicators: 4,
      data_quality: 5,
      python_stats: 2,
      r_programming: 4,
      sql_db: 3,
      stata_spss: 4,
      gis_spatial: 3,
      aiml_official: 2,
      cloud_apis: 2,
      dpdp_privacy: 3,
      cybersecurity: 3,
      digital_signatures: 4,
      govt_cloud: 2,
      dpi_integration: 3,
      leadership: 5,
      public_comm: 4,
      project_mgmt: 5,
      ethics_integrity: 5,
      change_mgmt: 4
    },
    targetCompetencies: {
      survey_design: 5,
      sampling_theory: 5,
      national_accounts: 4,
      price_statistics: 4,
      labour_stats: 5,
      sdg_indicators: 5,
      data_quality: 5,
      python_stats: 4,
      r_programming: 5,
      sql_db: 4,
      stata_spss: 5,
      gis_spatial: 5,
      aiml_official: 4,
      cloud_apis: 4,
      dpdp_privacy: 5,
      cybersecurity: 4,
      digital_signatures: 5,
      govt_cloud: 4,
      dpi_integration: 4,
      leadership: 5,
      public_comm: 5,
      project_mgmt: 5,
      ethics_integrity: 5,
      change_mgmt: 5
    },
    completedCoursesCount: 22,
    learningHoursTotal: 178
  },
  {
    id: 'persona_4',
    name: 'Ms. Priya Deshmukh',
    cadre: 'SSS (Subordinate Statistical Service)',
    designation: 'Junior Statistical Officer (JSO)',
    division: 'Economic Statistics Division (ESD)',
    location: 'MoSPI, New Delhi',
    email: 'priya.deshmukh@mospi.gov.in',
    phone: '8765432109',
    experienceYears: 3,
    education: 'M.A. Economics (Delhi School of Economics)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    currentCompetencies: {
      survey_design: 2,
      sampling_theory: 2,
      national_accounts: 3,
      price_statistics: 3,
      labour_stats: 2,
      sdg_indicators: 2,
      data_quality: 3,
      python_stats: 2,
      r_programming: 1,
      sql_db: 2,
      stata_spss: 2,
      gis_spatial: 1,
      aiml_official: 1,
      cloud_apis: 1,
      dpdp_privacy: 2,
      cybersecurity: 2,
      digital_signatures: 3,
      govt_cloud: 1,
      dpi_integration: 2,
      leadership: 1,
      public_comm: 2,
      project_mgmt: 2,
      ethics_integrity: 4,
      change_mgmt: 1
    },
    targetCompetencies: {
      survey_design: 4,
      sampling_theory: 4,
      national_accounts: 4,
      price_statistics: 4,
      labour_stats: 3,
      sdg_indicators: 3,
      data_quality: 4,
      python_stats: 4,
      r_programming: 3,
      sql_db: 4,
      stata_spss: 3,
      gis_spatial: 3,
      aiml_official: 3,
      cloud_apis: 3,
      dpdp_privacy: 4,
      cybersecurity: 3,
      digital_signatures: 4,
      govt_cloud: 3,
      dpi_integration: 3,
      leadership: 3,
      public_comm: 3,
      project_mgmt: 3,
      ethics_integrity: 5,
      change_mgmt: 3
    },
    completedCoursesCount: 5,
    learningHoursTotal: 34
  }
];

export const IGOT_COURSES = [
  {
    id: 'IGOT-STAT-204',
    title: 'National Accounts Aggregates & GVA Computation',
    provider: 'iGOT Karmayogi / MoSPI NAD',
    domain: 'STATISTICAL',
    relatedSkill: 'national_accounts',
    level: 'Advanced',
    duration: '20 Hours',
    rating: 4.9,
    enrolledCount: 1420,
    tags: ['National Accounts', 'GDP/GVA', 'Base Year 2011-12', 'SNA 2008'],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80',
    url: 'https://igotkarmayogi.gov.in/',
    description: 'Comprehensive course covering System of National Accounts (SNA 2008), sequence of accounts, Gross Value Added estimation across agriculture, industry, and services.'
  },
  {
    id: 'IGOT-TECH-302',
    title: 'Python for Statistical Computing & Automated Data Pipelines',
    provider: 'iGOT Karmayogi / Digital India Academy',
    domain: 'TECHNICAL',
    relatedSkill: 'python_stats',
    level: 'Intermediate',
    duration: '25 Hours',
    rating: 4.8,
    enrolledCount: 3890,
    tags: ['Python', 'Pandas', 'NumPy', 'Data Cleaning', 'Automated Reports'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    url: 'https://igotkarmayogi.gov.in/',
    description: 'Hands-on programming module for statistical officers to automate survey data validation, perform outlier detection, and build automated reporting scripts.'
  },
  {
    id: 'IGOT-TECH-310',
    title: 'Spatial Analytics & QGIS Applications for Census & Sample Surveys',
    provider: 'iGOT Karmayogi / ISRO-NRSC & NSSTA',
    domain: 'TECHNICAL',
    relatedSkill: 'gis_spatial',
    level: 'Intermediate',
    duration: '18 Hours',
    rating: 4.9,
    enrolledCount: 980,
    tags: ['QGIS', 'Remote Sensing', 'Sampling Frame', 'Geo-tagging'],
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&auto=format&fit=crop&q=80',
    url: 'https://igotkarmayogi.gov.in/',
    description: 'Learn to leverage GIS maps, satellite imagery, and spatial sampling frames for field enumeration, boundary demarcation, and spatial economic indicators.'
  },
  {
    id: 'IGOT-GOV-401',
    title: 'Data Privacy, Anonymization & DPDP Act 2023 in Governance',
    provider: 'iGOT Karmayogi / Ministry of Electronics & IT (MeitY)',
    domain: 'DIGITAL_GOVERNANCE',
    relatedSkill: 'dpdp_privacy',
    level: 'Essential',
    duration: '12 Hours',
    rating: 4.9,
    enrolledCount: 5400,
    tags: ['DPDP Act 2023', 'Microdata Anonymization', 'Differential Privacy', 'Ethics'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    url: 'https://igotkarmayogi.gov.in/',
    description: 'Critical compliance module on safeguarding respondent microdata, applying statistical k-anonymity, l-diversity, and legal obligations under Digital Personal Data Protection Act.'
  },
  {
    id: 'IGOT-STAT-101',
    title: 'Advanced Sampling Techniques & Calibration Weights',
    provider: 'iGOT Karmayogi / NSSTA Mahalanobis Chair',
    domain: 'STATISTICAL',
    relatedSkill: 'sampling_theory',
    level: 'Advanced',
    duration: '16 Hours',
    rating: 4.9,
    enrolledCount: 1650,
    tags: ['Stratified Sampling', 'Cluster Sampling', 'Multi-Stage Design', 'Variance Estimation'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    url: 'https://igotkarmayogi.gov.in/',
    description: 'In-depth formulation of survey sampling, Horvitz-Thompson estimator, non-response adjustments, and multiplier calculations for NSSO large-scale rounds.'
  },
  {
    id: 'IGOT-TECH-320',
    title: 'Machine Learning & LLMs for Automated Survey Coding',
    provider: 'iGOT Karmayogi / AI Centre of Excellence',
    domain: 'TECHNICAL',
    relatedSkill: 'aiml_official',
    level: 'Expert',
    duration: '30 Hours',
    rating: 4.7,
    enrolledCount: 720,
    tags: ['NLP', 'NIC-NICSD Coding', 'Auto-Classification', 'LLMs in Govt'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500&auto=format&fit=crop&q=80',
    url: 'https://igotkarmayogi.gov.in/',
    description: 'Deploying machine learning models and NLP transformers to automatically code occupational (NCO) and industrial (NIC) text responses in survey data.'
  },
  {
    id: 'IGOT-MGMT-501',
    title: 'Strategic Leadership & Change Management in Statistical Systems',
    provider: 'iGOT Karmayogi / LBSNAA Mussoorie',
    domain: 'BEHAVIOURAL',
    relatedSkill: 'leadership',
    level: 'Executive',
    duration: '14 Hours',
    rating: 4.8,
    enrolledCount: 2100,
    tags: ['Leadership', 'Stakeholder Management', 'Public Policy', 'Ethics'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=80',
    url: 'https://igotkarmayogi.gov.in/',
    description: 'Executive development program designed for officers leading statistical offices, managing multi-thousand field enumerator teams, and driving digital transformation.'
  }
];

export const NSSTA_TPAC_PROGRAMS = [
  {
    id: 'TPAC-MCTP-03',
    title: 'Mid-Career Training Programme (MCTP) Phase III',
    organizer: 'NSSTA & IIM Ahmedabad',
    format: 'Residential Mandated Training',
    duration: '4 Weeks',
    targetCadre: 'ISS Officers (JAG to SAG Transition)',
    recommendedFor: ['leadership', 'change_mgmt', 'project_mgmt'],
    nextBatch: '05 November 2026',
    isMandatory: true,
    description: 'Statutory Mid-Career Training Programme required for promotion to Director / DDG grade. Covers strategic public policy, advanced data ecosystems, and global statistical governance.',
    url: 'https://nssta.gov.in/'
  },
  {
    id: 'TPAC-2026-01',
    title: 'NSSTA 2-Week Intensive Masterclass on Econometric Modeling & Big Data Analytics',
    organizer: 'National Statistical Systems Training Academy (NSSTA), Greater Noida',
    format: 'Residential / Hybrid Workshop',
    duration: '14 Days (80 Training Hours)',
    targetCadre: 'ISS Officers (STS / JAG & above)',
    recommendedFor: ['python_stats', 'aiml_official', 'national_accounts'],
    nextBatch: '15 October 2026',
    seatsAvailable: 35,
    description: 'TPAC approved flagship training focusing on high-frequency indicators, machine learning in macro-forecasting, and big data API integration.'
  },
  {
    id: 'TPAC-2026-02',
    title: 'CAPI & Digital Field Operations Leadership Workshop',
    organizer: 'NSSTA & FOD Regional Center, Hyderabad',
    format: 'On-site Field Immersion',
    duration: '5 Days (30 Hours)',
    targetCadre: 'SSS Officers (SSO / JSO)',
    recommendedFor: ['survey_design', 'project_mgmt', 'dpi_integration'],
    nextBatch: '01 November 2026',
    seatsAvailable: 40,
    description: 'Hands-on training for field officers in managing CAPI tablet software, real-time sync validation, geofencing, and supervisory inspection techniques.'
  },
  {
    id: 'TPAC-2026-03',
    title: 'National Accounts Statistics & SNA 2025 Global Revisions Seminar',
    organizer: 'NSSTA & Reserve Bank of India Staff College, Chennai',
    format: 'Executive Symposium',
    duration: '3 Days (18 Hours)',
    targetCadre: 'Senior ISS Officers & Policy Analysts',
    recommendedFor: ['national_accounts', 'price_statistics', 'sdg_indicators'],
    nextBatch: '20 November 2026',
    seatsAvailable: 25,
    description: 'Specialized seminar on adopting upcoming UN System of National Accounts (SNA 2025) guidelines, digital asset capitalization, and informal sector estimation.'
  }
];

export const SAMPLE_LEARNING_DOCUMENTS = [
  {
    id: 'doc_plfs_2025',
    title: 'MoSPI Periodic Labour Force Survey (PLFS) Sampling Design & Estimation Method.pdf',
    category: 'Labour Statistics & Survey Design',
    fileSize: '2.4 MB',
    pagesCount: 14,
    content: `
CHAPTER 1: INTRODUCTION TO PLFS SAMPLING DESIGN
The Periodic Labour Force Survey (PLFS) was launched by the National Sample Survey Office (NSSO) in April 2017. The main objective of PLFS is to estimate key employment and unemployment indicators (viz. Worker Population Ratio, Labour Force Participation Rate, Unemployment Rate) within a short time interval of three months for urban areas and annually for both rural and urban areas.

CHAPTER 2: SAMPLE DESIGN
A stratified multi-stage design has been adopted for the PLFS. The first stage units (FSU) are the Urban Frame Survey (UFS) blocks in urban areas and Census villages (Panchayat wards in Kerala) in rural areas. The Ultimate Stage Units (USU) are households in both sectors.

Section 2.1 Stratification in Rural Sector:
In rural sector, each district is treated as a stratum. However, if a district has a rural population of more than 2.5 million as per Census 2011, it is divided into two or more sub-strata by grouping contiguous tehsils.

Section 2.2 Stratification in Urban Sector:
In urban areas, strata are formed within each State/UT on the basis of population size of towns as per Census 2011. Towns with population 1 million or more form self-aggregating single strata.

Section 2.3 Allocation and Selection of First Stage Units:
Sample FSUs are selected with Probability Proportional to Size With Replacement (PPSWR) in rural areas using village population as size. In urban areas, FSUs are selected using Simple Random Sampling Without Replacement (SRSWOR).

CHAPTER 3: ESTIMATION PROCEDURE
Let Y denote the total of attribute y for a stratum. The unbiased multiplier M for the i-th FSU in the h-th stratum under PPSWR is calculated using the formula: M_hi = (1 / n_h) * (Z_h / z_hi), where Z_h is total stratum population size, z_hi is sample FSU size, and n_h is number of sampled FSUs.
    `
  },
  {
    id: 'doc_nas_gva_2025',
    title: 'MoSPI National Accounts Statistics: GVA Estimation by Economic Activity.docx',
    category: 'National Accounts & Macroeconomics',
    fileSize: '1.8 MB',
    pagesCount: 9,
    content: `
1. GROSS VALUE ADDED (GVA) CONCEPTUAL FRAMEWORK
Gross Value Added (GVA) is defined as the value of output minus the value of intermediate consumption. GVA measures the contribution to the economy of each individual producer, industry, or sector.

2. ESTIMATION OF AGRICULTURE & ALLIED SECTORS
Output of agriculture is estimated using the Production Approach. Volume of crop output is derived from the Crop Estimation Surveys (CES) conducted by Directorate of Economics and Statistics (DES) of respective State Governments. Producer prices (farmgate prices) during peak harvest periods are applied to obtain Gross Value of Output (GVO).

3. ESTIMATION OF MANUFACTURING SECTOR
Manufacturing is divided into Organized and Unorganized sectors.
- Organized Manufacturing: Estimated using Annual Survey of Industries (ASI) data and corporate financial results filed with Ministry of Corporate Affairs (MCA-21 database).
- Unorganized Manufacturing: Estimated using benchmark survey results from NSS Enterprise Surveys extrapolated using indicators like IIP (Index of Industrial Production) and GST collections.

4. BASE YEAR REVISION PROTOCOLS
Base year revisions are conducted periodically to reflect structural changes in the economy, update relative price structures, adopt latest international guidelines (SNA 2008 / SNA 2025), and incorporate newly available long-term census data.
    `
  },
  {
    id: 'doc_dpdp_act_2023',
    title: 'Guidelines on Data Anonymization & DPDP Act Compliance in Official Dissemination.pdf',
    category: 'Digital Governance & Privacy',
    fileSize: '1.1 MB',
    pagesCount: 6,
    content: `
DIGITAL PERSONAL DATA PROTECTION (DPDP) ACT 2023 - STATISTICAL IMPLICATIONS

1. SCOPE AND OBLIGATIONS FOR STATISTICAL AGENCIES
The DPDP Act 2023 regulates the processing of digital personal data. While Section 17 provides exemptions for processing personal data necessary for research, archiving, or statistical purposes, strict technical safeguards must be enforced prior to public microdata release.

2. STATISTICAL K-ANONYMITY AND DIFFERENTIAL PRIVACY
To prevent re-identification attacks on sample survey microdata:
- Direct Identifier Suppression: Removal of Name, Aadhaar number, Mobile number, exact GIS street coordinates.
- Quasi-Identifier Aggregation: Age must be grouped into 5-year cohorts; Geographical location restricted to District level for sample sizes < 50.
- k-Anonymity Requirement: Every combination of quasi-identifiers in a published microdata release must match at least k=5 distinct individual respondents.

3. PENALTIES AND AUDIT TRAIL
Failure to prevent data breach or unauthorized disclosure of non-anonymized microdata attracts financial penalties up to INR 250 Crores under the Data Protection Board of India mandate.
    `
  }
];

export const DIVISION_HEATMAP_DATA = [
  { division: 'National Accounts Division (NAD)', code: 'NAD', totalOfficers: 140, avgProficiency: 4.1, topGap: 'Python & Automated Pipelines', urgentCount: 12 },
  { division: 'Field Operations Division (FOD)', code: 'FOD', totalOfficers: 620, avgProficiency: 3.4, topGap: 'Sampling & Weight Calibration', urgentCount: 84 },
  { division: 'Survey Design & Research Division (SDRD)', code: 'SDRD', totalOfficers: 180, avgProficiency: 4.4, topGap: 'AI/ML & Big Data in Surveys', urgentCount: 19 },
  { division: 'Economic Statistics Division (ESD)', code: 'ESD', totalOfficers: 210, avgProficiency: 3.7, topGap: 'DPDP Act & Data Anonymization', urgentCount: 31 },
  { division: 'Social Statistics Division (SSD)', code: 'SSD', totalOfficers: 110, avgProficiency: 3.6, topGap: 'GIS Spatial Analytics', urgentCount: 22 }
];
