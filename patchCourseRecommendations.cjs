const fs = require('fs');
let content = fs.readFileSync('src/components/CourseRecommendations.jsx', 'utf8');

// Add import
content = content.replace(
  "import { BookOpen, ShieldCheck, CheckCircle, ExternalLink, AlertTriangle, ArrowRight, MapPin, Calendar, Briefcase, Award } from 'lucide-react';",
  "import { BookOpen, ShieldCheck, CheckCircle, ExternalLink, AlertTriangle, ArrowRight, MapPin, Calendar, Briefcase, Award } from 'lucide-react';\nimport { useLearnerProgress } from '../context/LearnerProgressContext';"
);

// Add hook
content = content.replace(
  "const [enrollingId, setEnrollingId] = useState(null);",
  "const [enrollingId, setEnrollingId] = useState(null);\n  const { getAccuracy } = useLearnerProgress();"
);

// Update gap logic to use accuracy
content = content.replace(
  "const current = userCompetencies[s.id] || 1;",
  "const accuracy = getAccuracy(s.id) || 0;\n    const current = Math.max(userCompetencies[s.id] || 1, Math.floor(accuracy / 20) + 1);"
);

fs.writeFileSync('src/components/CourseRecommendations.jsx', content);
console.log("Patched successfully");
