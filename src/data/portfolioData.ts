export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Full-Stack & AI' | 'Computer Vision & Deep Learning' | 'Platform Engineering';
  role: string;
  status: 'Live & Operational' | 'Academic Major Project' | 'Academic Minor Project';
  liveUrl?: string;
  githubUrl?: string;
  description: string;
  problem: string;
  solution: string;
  aiAssistant?: {
    name: string;
    description: string;
    icon: string;
  };
  highlights: string[];
  techStack: { name: string; category: string }[];
  architecture: string[];
  badgeColor: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  image: string;
  category: 'AI & Data Science' | 'Software & .NET' | 'Cloud & Security';
  skills: string[];
}

export interface TechItem {
  name: string;
  category: 'AI & Machine Learning' | 'Frontend & 3D' | 'Backend & Architecture' | 'Database & Cloud';
  level: string;
  iconName: string;
  color: string;
  description: string;
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Imran A",
    title: "Software Engineer & AI Engineer",
    company: "Owlsure",
    companyUrl: "https://www.owlsure.com/home-global/?geo=global&geosub=in",
    location: "Chennai / Coimbatore, India",
    email: "imran.abdul.official@gmail.com",
    github: "https://github.com/imranabdul-cmd",
    linkedin: "https://www.linkedin.com/in/imran-aupe",
    bio: "Passionate Software & AI Engineer at Owlsure building high-impact Generative AI applications, RAG pipelines, and scalable full-stack architectures. Winner of Owlsure's 'Mission Possible' 54-member Hackathon with dual flagship ideations.",
    status: "SYSTEM ACTIVE // READY TO DEPLOY",
    stats: [
      { label: "CGPA (B.Sc CS)", value: "7.5", sub: "PSG College of Arts & Science" },
      { label: "Hackathon Win", value: "#1 Rank", sub: "Mission Possible (54 Devs / 6 Teams)" },
      { label: "Flagship Projects", value: "4+", sub: "RAG, GenAI & Medical AI" },
      { label: "Certifications", value: "9+", sub: "Deep Learning, Cloud & .NET" }
    ]
  },

  education: [
    {
      institution: "SRM University",
      location: "Chennai, India",
      degree: "Generative AI Specialization (Online)",
      duration: "Present / Ongoing",
      focus: "LLMs, RAG Architectures, Vector Databases, Neural Networks, LangChain & Agentic AI",
      status: "In Progress",
      color: "from-cyan-500 to-blue-600"
    },
    {
      institution: "PSG College of Arts and Science",
      location: "Coimbatore, India",
      degree: "B.Sc. Computer Science",
      duration: "Graduated",
      grade: "7.5 CGPA",
      focus: "Algorithms, Data Structures, Machine Learning, Computer Vision, Software Engineering",
      status: "Completed",
      color: "from-purple-500 to-indigo-600"
    }
  ],

  experience: {
    company: "Owlsure",
    role: "Software Engineer / AI Engineer",
    website: "https://www.owlsure.com/home-global/?geo=global&geosub=in",
    description: "Architecting and implementing enterprise Generative AI integrations, intelligent document retrieval, vector pipelines, and modern high-performance microservices.",
    hackathon: {
      eventName: "Mission Possible Hackathon",
      organization: "Owlsure",
      scope: "6 Teams • 54 Members",
      result: "🏆 1st Place Champion (Sole Team with 2 Winning Ideations)",
      ideations: [
        {
          name: "ClanSure",
          subtitle: "Family Insurance Management & AI Clara Platform",
          description: "Centralized family policy hub solving scattered insurance data with automated renewal alerts, family tree mapping, and Clara AI advisor."
        },
        {
          name: "GT Companion",
          subtitle: "Enterprise Training & Knowledge Discovery Platform",
          description: "Unified learning hub bringing scattered mentor training assets, quizzes, and structured roadmaps powered by Pico AI."
        }
      ]
    }
  },

  projects: [
    {
      id: "clansure",
      title: "ClanSure",
      tagline: "Centralized Family Insurance Management Platform",
      category: "Full-Stack & AI",
      role: "Lead Full-Stack & AI Architect",
      status: "Live & Operational",
      liveUrl: "https://family-portal.up.railway.app/",
      description: "ClanSure solves the fragmentation of family insurance records scattered across disparate portals, unifying policies, documents, claims, and renewal tracking into one intelligent dashboard with Clara AI.",
      problem: "During emergencies or renewals, family members struggle to locate policy documents, compare options, and track critical expiry dates across isolated provider accounts.",
      solution: "A centralized platform featuring family tree relations, protection scores, automated expiration monitors, document vault, and contextual AI recommendations.",
      aiAssistant: {
        name: "Clara AI",
        description: "Intelligent insurance assistant answering contextual policy queries, coverage evaluations, and claims procedure guidance in real time.",
        icon: "Bot"
      },
      highlights: [
        "Family Member & Policy Hierarchy Management with interactive Family Tree",
        "Encrypted Insurance Document Vault with instant retrieval",
        "Automated Renewal Reminders & Expiry Tracking Engine",
        "Dynamic Family Protection Score & Insurance Marketplace comparison",
        "Clara AI Conversational Assistant powered by LangChain & Gemini"
      ],
      techStack: [
        { name: "React / TypeScript", category: "Frontend" },
        { name: "ASP.NET Core / C#", category: "Backend" },
        { name: "FastAPI / LangChain", category: "AI Layer" },
        { name: "Gemini API", category: "LLM" },
        { name: "PostgreSQL / pgvector", category: "Database" },
        { name: "Redis", category: "Cache" },
        { name: "Tailwind / Shadcn", category: "UI" }
      ],
      architecture: [
        "React + Vite + Shadcn/UI (Presentation)",
        "ASP.NET Core REST APIs + JWT Auth (Application)",
        "FastAPI + LangChain + Gemini LLM (RAG / AI Engine)",
        "PostgreSQL + pgvector (Embeddings & Metadata)",
        "Redis + Railway CI/CD (Caching & Deployment)"
      ],
      badgeColor: "cyan"
    },
    {
      id: "gt-companion",
      title: "GT Companion",
      tagline: "Centralized Training & Knowledge Journey Platform",
      category: "Full-Stack & AI",
      role: "AI & Platform Architect",
      status: "Live & Operational",
      liveUrl: "https://gt-companion.up.railway.app/#landing",
      description: "GT Companion brings scattered mentor training materials, roadmaps, and video presentations into one structured curriculum platform powered by Pico AI.",
      problem: "Trainees face fragmented learning resources across different mentors, lacking a clear starting roadmap or guided learning path.",
      solution: "A comprehensive training ecosystem with curated module roadmaps, topic-based quizzes, progress trackers, and an intelligent training co-pilot (Pico).",
      aiAssistant: {
        name: "Pico AI",
        description: "Embedded training companion providing instant topic explanations, quiz hints, and personalized roadmap recommendations.",
        icon: "Sparkles"
      },
      highlights: [
        "Curated Mentor & Manager Training Curriculum with Video Modules",
        "Interactive Topic Quizzes & Knowledge Verification Assessments",
        "Structured Step-by-Step Learning Journey & Roadmap Tracker",
        "Pico AI Assistant for real-time contextual code & concept coaching",
        "Unified Multi-Role Dashboard for trainees and managers"
      ],
      techStack: [
        { name: "React 19 / Vite", category: "Frontend" },
        { name: "ASP.NET Core", category: "Backend" },
        { name: "FastAPI", category: "AI Service" },
        { name: "LangChain / Gemini", category: "AI Core" },
        { name: "PostgreSQL", category: "Data" },
        { name: "Tailwind CSS", category: "Styles" }
      ],
      architecture: [
        "Modular React Frontend with Lucide & Tailwind UI",
        "ASP.NET Core Clean Architecture Microservice",
        "FastAPI RAG Service querying internal curriculum vectors",
        "PostgreSQL Relational DB with Railway Automated Deployment"
      ],
      badgeColor: "purple"
    },
    {
      id: "agri-quality",
      title: "AI Agri Quality Inspection System",
      tagline: "Deep Learning Automated Fruit Defect Detection & Grading",
      category: "Computer Vision & Deep Learning",
      role: "ML Engineer & Full-Stack Developer",
      status: "Academic Major Project",
      description: "An AI-powered computer vision web application that automates fruit quality grading, identifies surface defects, and estimates profitability for agricultural supply chains.",
      problem: "Manual visual inspection of agricultural produce is slow, labor-intensive, error-prone, and causes massive economic loss in supply chains.",
      solution: "Deep learning CNN pipeline integrated into a Flask web application that scans produce in real time, grades defect severity, and generates profit analysis.",
      highlights: [
        "Real-Time Defect Detection & Multi-Grade Quality Classification",
        "Automated Supply Chain Profit Margin Estimation Algorithm",
        "Interactive Analytics Dashboard with historical batch tracking",
        "Flask RESTful APIs for high-throughput image inference",
        "OpenCV preprocessing pipeline with spatial augmentation"
      ],
      techStack: [
        { name: "Python", category: "Core" },
        { name: "TensorFlow / Keras", category: "Deep Learning" },
        { name: "OpenCV", category: "Computer Vision" },
        { name: "Flask", category: "Web Backend" },
        { name: "SQLite", category: "Storage" },
        { name: "JavaScript / CSS", category: "UI" }
      ],
      architecture: [
        "Image Ingestion -> OpenCV Normalization & Filtering",
        "Trained CNN Classifier (Conv2D -> MaxPooling -> Dense)",
        "Flask Inference Gateway -> Profit Forecast Engine",
        "Interactive Web Dashboard with Batch Analytics"
      ],
      badgeColor: "emerald"
    },
    {
      id: "lung-cancer",
      title: "Lung Cancer Detection & Classification",
      tagline: "Histopathology Medical Image Processing & Multi-Class CNN",
      category: "Computer Vision & Deep Learning",
      role: "Deep Learning Researcher",
      status: "Academic Minor Project",
      description: "An automated deep learning screening system that classifies high-resolution lung tissue biopsy slides across Benign, Adenocarcinoma, and Squamous Cell Carcinoma categories.",
      problem: "Manual biopsy evaluation by pathologists is time-consuming and vulnerable to inter-observer variability in early cancer screening.",
      solution: "High-dimensional cellular CNN pipeline optimized with Adam optimizer, categorical cross-entropy, and comprehensive evaluation matrices.",
      highlights: [
        "Multi-Class Biopsy Classification: Benign, Adenocarcinoma & Squamous Cell Carcinoma",
        "Tailored Deep CNN Architecture with BatchNorm, Dropout & Softmax layers",
        "Rigorous OpenCV / TensorFlow Data Augmentation Pipeline",
        "Comprehensive Clinical Metrics: Precision-Recall Curves & Confusion Matrices",
        "Rapid Diagnostic Screening Assistance for medical practitioners"
      ],
      techStack: [
        { name: "Python", category: "Core" },
        { name: "TensorFlow / Keras", category: "Deep Learning" },
        { name: "OpenCV", category: "Vision" },
        { name: "NumPy / Pandas", category: "Data" },
        { name: "Scikit-Learn", category: "Evaluation" },
        { name: "Matplotlib", category: "Visualization" }
      ],
      architecture: [
        "Histopathology Slide Dataset -> Preprocessing & Augmentation",
        "Deep CNN (Conv2D + BatchNorm + ReLU -> MaxPooling -> Dropout)",
        "Optimization with Adam & EarlyStopping Callbacks",
        "Confusion Matrix & ROC-AUC Metric Generation"
      ],
      badgeColor: "amber"
    }
  ] as Project[],

  techMatrix: [
    { name: "Python", category: "AI & Machine Learning", level: "Advanced", iconName: "python", color: "#38bdf8", description: "Primary AI development, FastAPI, data pipelines & scripts" },
    { name: "LangChain", category: "AI & Machine Learning", level: "Advanced", iconName: "langchain", color: "#22c55e", description: "RAG workflows, Agentic tool execution & prompt chains" },
    { name: "Gemini API", category: "AI & Machine Learning", level: "Advanced", iconName: "google", color: "#60a5fa", description: "Multimodal LLM integrations, embeddings & reasoning" },
    { name: "TensorFlow / Keras", category: "AI & Machine Learning", level: "Advanced", iconName: "tensorflow", color: "#fb923c", description: "CNNs, classification models & medical vision pipelines" },
    { name: "OpenCV", category: "AI & Machine Learning", level: "Proficient", iconName: "opencv", color: "#ef4444", description: "Image augmentation, preprocessing & defect detection" },
    { name: "FastAPI", category: "Backend & Architecture", level: "Advanced", iconName: "fastapi", color: "#009688", description: "High-performance asynchronous AI microservices" },
    { name: "C# / .NET", category: "Backend & Architecture", level: "Advanced", iconName: "csharp", color: "#a855f7", description: "ASP.NET Core REST APIs, EF Core & enterprise systems" },
    { name: "React 19", category: "Frontend & 3D", level: "Advanced", iconName: "react", color: "#06b6d4", description: "Modern reactive web apps, hooks & concurrent UI" },
    { name: "TypeScript", category: "Frontend & 3D", level: "Advanced", iconName: "typescript", color: "#3b82f6", description: "Type-safe full-stack application development" },
    { name: "Three.js / WebGL", category: "Frontend & 3D", level: "Proficient", iconName: "threejs", color: "#e2e8f0", description: "3D interactive viewports, particle systems & shaders" },
    { name: "GSAP & Lenis", category: "Frontend & 3D", level: "Advanced", iconName: "gsap", color: "#84cc16", description: "ScrollTrigger kinetic choreography & inertial scrolling" },
    { name: "PostgreSQL & pgvector", category: "Database & Cloud", level: "Advanced", iconName: "postgres", color: "#336791", description: "Relational persistence & similarity vector search" },
    { name: "Redis", category: "Database & Cloud", level: "Proficient", iconName: "redis", color: "#dc2626", description: "In-memory caching, rate-limiting & session control" },
    { name: "Docker & CI/CD", category: "Database & Cloud", level: "Proficient", iconName: "docker", color: "#0284c7", description: "Containerized deployment pipelines & Railway hosting" }
  ] as TechItem[],

  certificates: [
    {
      id: "csharp-adv",
      title: "C# Advanced Concepts & Architecture",
      issuer: "Professional Certification",
      image: "/assets/certificates/c_sharp_advanced_certificate.png",
      category: "Software & .NET",
      skills: ["C#", "Advanced OOP", "Design Patterns", "Performance Optimization"]
    },
    {
      id: "csharp-inter",
      title: "C# Intermediate Specialization",
      issuer: "Professional Certification",
      image: "/assets/certificates/c_sharp_intermediate_certificate.png",
      category: "Software & .NET",
      skills: ["C#", "LINQ", "Async/Await", "Collections"]
    },
    {
      id: "csharp-core",
      title: "C# Programming Fundamentals",
      issuer: "Professional Certification",
      image: "/assets/certificates/c_sharp_certificate.png",
      category: "Software & .NET",
      skills: ["C#", "Data Structures", "Control Flow", "Object-Oriented Programming"]
    },
    {
      id: "net-framework",
      title: ".NET Framework Architecture",
      issuer: "Professional Certification",
      image: "/assets/certificates/net_framework_certificate.png",
      category: "Software & .NET",
      skills: [".NET", "ASP.NET Core", "Entity Framework", "Web APIs"]
    },
    {
      id: "datascience-python",
      title: "Data Science & Python Masterclass",
      issuer: "Professional Certification",
      image: "/assets/certificates/datascience_python_certificate.png",
      category: "AI & Data Science",
      skills: ["Python", "Pandas", "NumPy", "Data Analytics", "Scikit-Learn"]
    },
    {
      id: "cloud-computing",
      title: "Cloud Computing Architectures",
      issuer: "Professional Certification",
      image: "/assets/certificates/cloud_computing_certificate.png",
      category: "Cloud & Security",
      skills: ["Cloud Architecture", "Virtualization", "SaaS / PaaS", "Scalability"]
    },
    {
      id: "google-cybersecurity",
      title: "Google Cybersecurity Specialization",
      issuer: "Google Professional Certification",
      image: "/assets/certificates/googlecybersecuritylcertificate.png",
      category: "Cloud & Security",
      skills: ["Network Security", "Threat Detection", "SIEM", "Security Protocols"]
    },
    {
      id: "ai-productivity",
      title: "Maximize Productivity With AI Tools",
      issuer: "Professional Certification",
      image: "/assets/certificates/maximize_productivity_with_ai_tools_certificate.png",
      category: "AI & Data Science",
      skills: ["Generative AI", "Prompt Engineering", "AI Workflows", "Automation"]
    },
    {
      id: "internship",
      title: "Software Engineering Internship Certificate",
      issuer: "Industry Practical Experience",
      image: "/assets/certificates/internship_certificate.png",
      category: "Software & .NET",
      skills: ["Full Stack Development", "Team Collaboration", "Agile", "Production Code"]
    }
  ] as CertificateItem[]
};
