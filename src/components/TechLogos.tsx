import React from 'react';

interface TechLogoProps {
  name: string;
  size?: number;
  className?: string;
}

export const TechLogo: React.FC<TechLogoProps> = ({ name, size = 28, className = '' }) => {
  const key = name.toLowerCase();

  /* ── 1. Python ── */
  if (key.includes('python')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path
          d="M63.4 3C32.1 3 33.9 16.6 33.9 16.6L34 30.7H64v4.2H21.5S3 32.7 3 64.2c0 31.5 16.1 30.4 16.1 30.4h9.6v-13.5s-.5-16.1 15.8-16.1h30.1s15.2-.2 15.2-14.9V17.8S92.4 3 63.4 3zm-16.3 9.4a4.8 4.8 0 110 9.6 4.8 4.8 0 010-9.6z"
          fill="url(#py-blue)"
        />
        <path
          d="M64.6 125c31.3 0 29.5-13.6 29.5-13.6l-.1-14.1H64v-4.2h42.5s18.5 2.2 18.5-29.3c0-31.5-16.1-30.4-16.1-30.4h-9.6v13.5s.5 16.1-15.8 16.1H43.4s-15.2.2-15.2 14.9v32.1S35.6 125 64.6 125zm16.3-9.4a4.8 4.8 0 110-9.6 4.8 4.8 0 010-9.6z"
          fill="url(#py-yellow)"
        />
        <defs>
          <linearGradient id="py-blue" x1="16.5" y1="9.5" x2="77.5" y2="72.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#387EB8" />
            <stop offset="1" stopColor="#366994" />
          </linearGradient>
          <linearGradient id="py-yellow" x1="111.5" y1="118.5" x2="50.5" y2="55.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE873" />
            <stop offset="1" stopColor="#FFD43B" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  /* ── 2. LangChain ── */
  if (key.includes('langchain')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <rect width="128" height="128" rx="28" fill="#1C3C3C" />
        {/* Parrot beak & plumage */}
        <path d="M40 32C40 32 52 24 68 28C84 32 92 48 92 64C92 80 84 96 68 100C52 104 40 96 40 96L48 64L40 32Z" fill="#10B981" />
        <path d="M68 28C68 28 88 36 96 52C104 68 96 84 96 84L80 64L68 28Z" fill="#34D399" />
        <path d="M32 56C32 56 44 48 56 52C68 56 72 68 72 80C72 92 64 104 48 104C32 104 24 92 24 80C24 68 32 56 32 56Z" fill="#059669" />
        <circle cx="56" cy="48" r="5" fill="#FFFFFF" />
        <circle cx="58" cy="48" r="2.5" fill="#0F172A" />
      </svg>
    );
  }

  /* ── 3. Gemini API / Google ── */
  if (key.includes('gemini') || key.includes('google')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path
          d="M64 4C64 37.137 37.137 64 4 64C37.137 64 64 90.863 64 124C64 90.863 90.863 64 124 64C90.863 64 64 37.137 64 4Z"
          fill="url(#gemini-grad)"
        />
        <defs>
          <linearGradient id="gemini-grad" x1="4" y1="4" x2="124" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1BA1E3" />
            <stop offset="0.38" stopColor="#536DFE" />
            <stop offset="0.72" stopColor="#A855F7" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  /* ── 4. TensorFlow / Keras ── */
  if (key.includes('tensorflow') || key.includes('keras')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <path d="M64 8L16 36V92L64 120L112 92V36L64 8Z" fill="url(#tf-bg)" />
        <path d="M64 8L16 36L64 64L112 36L64 8Z" fill="#FF9100" />
        <path d="M64 64L16 36V92L64 120V64Z" fill="#FF6D00" />
        <path d="M64 64L112 36V92L64 120V64Z" fill="#E65100" />
        {/* 'T' Cutout overlay */}
        <path d="M44 42H84V54H70V94H58V54H44V42Z" fill="#FFFFFF" fillOpacity="0.95" />
        <defs>
          <linearGradient id="tf-bg" x1="16" y1="8" x2="112" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9100" />
            <stop offset="1" stopColor="#DD2C00" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  /* ── 5. OpenCV ── */
  if (key.includes('opencv')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        {/* Red Ring (Top) */}
        <circle cx="64" cy="38" r="26" stroke="#EA4335" strokeWidth="12" fill="none" strokeDasharray="130" strokeDashoffset="35" strokeLinecap="round" />
        {/* Green Ring (Bottom-Left) */}
        <circle cx="38" cy="86" r="26" stroke="#34A853" strokeWidth="12" fill="none" strokeDasharray="130" strokeDashoffset="145" strokeLinecap="round" />
        {/* Blue Ring (Bottom-Right) */}
        <circle cx="90" cy="86" r="26" stroke="#4285F4" strokeWidth="12" fill="none" strokeDasharray="130" strokeDashoffset="-75" strokeLinecap="round" />
      </svg>
    );
  }

  /* ── 6. FastAPI ── */
  if (key.includes('fastapi')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <circle cx="64" cy="64" r="60" fill="#009688" />
        <path d="M68 18L32 72H62L56 110L96 56H66L72 18H68Z" fill="#FFFFFF" />
      </svg>
    );
  }

  /* ── 7. C# / .NET ── */
  if (key.includes('c#') || key.includes('csharp') || key.includes('.net')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        {/* Hexagon */}
        <path d="M64 4L116 34V94L64 124L12 94V34L64 4Z" fill="url(#csharp-hex)" />
        {/* 'C' shape */}
        <path d="M72 44C60 44 48 52 48 64C48 76 60 84 72 84C80 84 86 80 90 76L96 84C90 90 82 96 70 96C50 96 34 82 34 64C34 46 50 32 70 32C82 32 90 38 96 44L90 52C86 48 80 44 72 44Z" fill="#FFFFFF" />
        {/* '#' symbol */}
        <path d="M96 50H100V58H106V62H100V70H106V74H100V82H96V74H88V82H84V74H78V70H84V62H78V58H84V50H88V58H96V50ZM96 62H88V70H96V62Z" fill="#FFFFFF" />
        <defs>
          <linearGradient id="csharp-hex" x1="12" y1="4" x2="116" y2="124" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B4F96" />
            <stop offset="1" stopColor="#512BD4" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  /* ── 8. React 19 ── */
  if (key.includes('react')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <ellipse cx="64" cy="64" rx="48" ry="18" stroke="#61DAFB" strokeWidth="5.5" fill="none" transform="rotate(0 64 64)" />
        <ellipse cx="64" cy="64" rx="48" ry="18" stroke="#61DAFB" strokeWidth="5.5" fill="none" transform="rotate(60 64 64)" />
        <ellipse cx="64" cy="64" rx="48" ry="18" stroke="#61DAFB" strokeWidth="5.5" fill="none" transform="rotate(120 64 64)" />
        <circle cx="64" cy="64" r="10" fill="#61DAFB" />
      </svg>
    );
  }

  /* ── 9. TypeScript ── */
  if (key.includes('typescript') || key.includes('ts')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <rect width="128" height="128" rx="20" fill="#3178C6" />
        {/* 'T' */}
        <path d="M24 44H62V54H48V96H38V54H24V44Z" fill="#FFFFFF" />
        {/* 'S' */}
        <path d="M68 82C72 88 80 96 94 96C106 96 112 88 112 80C112 66 94 64 88 58C84 54 84 50 86 48C88 44 94 42 100 42C108 42 114 46 118 52L126 44C120 36 110 32 98 32C86 32 76 38 76 50C76 64 94 66 100 70C104 74 104 78 102 80C98 84 92 86 86 86C78 86 72 80 68 74L68 82Z" fill="#FFFFFF" />
      </svg>
    );
  }

  /* ── 10. Three.js / WebGL ── */
  if (key.includes('three') || key.includes('webgl')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <rect width="128" height="128" rx="24" fill="#090D16" stroke="rgba(255,255,255,0.15)" />
        <path d="M64 18L106 94H22L64 18Z" stroke="#000" strokeWidth="8" fill="none" />
        {/* 3D Polyhedron Triangle segments */}
        <path d="M64 22L102 90H64L64 22Z" fill="#FFFFFF" />
        <path d="M64 22L26 90H64L64 22Z" fill="#CBD5E1" />
        <path d="M64 56L102 90H26L64 56Z" fill="#94A3B8" />
      </svg>
    );
  }

  /* ── 11. GSAP & Lenis ── */
  if (key.includes('gsap') || key.includes('lenis')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <rect width="128" height="128" rx="28" fill="#111827" />
        {/* GSAP Green Guy Mascot / G */}
        <circle cx="64" cy="64" r="46" fill="#88CE02" />
        <path d="M64 30C45.2 30 30 45.2 30 64C30 82.8 45.2 98 64 98C78.4 98 90.8 89 95.8 76.4L81.2 72.8C78.2 80 71.6 84.8 64 84.8C52.5 84.8 43.2 75.5 43.2 64C43.2 52.5 52.5 43.2 64 43.2C71.2 43.2 77.4 47.4 80.6 53.6L95.4 49.4C90.2 38 78 30 64 30Z" fill="#0A0F1D" />
        <path d="M72 64H98V76H72V64Z" fill="#0A0F1D" />
      </svg>
    );
  }

  /* ── 12. PostgreSQL & pgvector ── */
  if (key.includes('postgres') || key.includes('sql')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        {/* PostgreSQL Elephant (Slonik) stylized */}
        <circle cx="64" cy="64" r="56" fill="#336791" />
        <path d="M64 24C46 24 36 36 36 52C36 68 44 80 50 94C52 98 56 104 64 104C72 104 76 98 78 94C84 80 92 68 92 52C92 36 82 24 64 24Z" fill="#FFFFFF" fillOpacity="0.95" />
        <path d="M46 54C46 44 54 36 64 36C74 36 82 44 82 54C82 66 74 76 64 86C54 76 46 66 46 54Z" fill="#336791" />
        <circle cx="56" cy="50" r="3.5" fill="#FFFFFF" />
        <circle cx="72" cy="50" r="3.5" fill="#FFFFFF" />
      </svg>
    );
  }

  /* ── 13. Redis ── */
  if (key.includes('redis')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        {/* Redis Isometric Stacked Slabs */}
        <path d="M64 12L112 36L64 60L16 36L64 12Z" fill="#D82C20" />
        <path d="M16 36L64 60V80L16 56V36Z" fill="#A3241B" />
        <path d="M112 36L64 60V80L112 56V36Z" fill="#881B13" />
        {/* Layer 2 */}
        <path d="M64 56L112 80L64 104L16 80L64 56Z" fill="#DC382D" />
        <path d="M16 80L64 104V116L16 92V80Z" fill="#A3241B" />
        <path d="M112 80L64 104V116L112 92V80Z" fill="#881B13" />
      </svg>
    );
  }

  /* ── 14. Docker & CI/CD ── */
  if (key.includes('docker') || key.includes('ci/cd') || key.includes('cloud')) {
    return (
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none" className={className}>
        <rect width="128" height="128" rx="28" fill="#2496ED" />
        {/* Containers on back */}
        <rect x="36" y="44" width="14" height="12" rx="2" fill="#FFFFFF" />
        <rect x="54" y="44" width="14" height="12" rx="2" fill="#FFFFFF" />
        <rect x="72" y="44" width="14" height="12" rx="2" fill="#FFFFFF" />
        <rect x="54" y="28" width="14" height="12" rx="2" fill="#FFFFFF" />
        <rect x="72" y="28" width="14" height="12" rx="2" fill="#FFFFFF" />
        <rect x="90" y="44" width="14" height="12" rx="2" fill="#FFFFFF" />
        {/* Whale body */}
        <path d="M116 66C112 64 102 64 96 70C92 64 82 64 74 66H20C18 78 26 94 48 98C76 102 104 94 112 78C116 78 120 74 120 70C120 68 118 66 116 66Z" fill="#FFFFFF" />
        <circle cx="34" cy="80" r="3" fill="#2496ED" />
      </svg>
    );
  }

  /* Fallback icon */
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        fontWeight: 700,
        color: '#fff',
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};

export default TechLogo;
