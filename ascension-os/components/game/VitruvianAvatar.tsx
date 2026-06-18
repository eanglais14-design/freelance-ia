export function VitruvianAvatar({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 120 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,0.4))" }}
      >
        {/* Outer circle */}
        <circle cx="60" cy="75" r="55" stroke="rgba(139,92,246,0.25)" strokeWidth="0.5" />
        {/* Square */}
        <rect x="10" y="22" width="100" height="108" stroke="rgba(99,102,241,0.2)" strokeWidth="0.5" />

        {/* Head */}
        <circle cx="60" cy="22" r="10" stroke="#8b5cf6" strokeWidth="0.8" />
        {/* Neck */}
        <line x1="60" y1="32" x2="60" y2="40" stroke="#8b5cf6" strokeWidth="0.8" />

        {/* Torso */}
        <line x1="60" y1="40" x2="60" y2="90" stroke="#8b5cf6" strokeWidth="1" />
        {/* Shoulders */}
        <line x1="35" y1="48" x2="85" y2="48" stroke="#a78bfa" strokeWidth="0.8" />
        {/* Chest cross */}
        <line x1="48" y1="40" x2="48" y2="70" stroke="rgba(139,92,246,0.5)" strokeWidth="0.5" />
        <line x1="72" y1="40" x2="72" y2="70" stroke="rgba(139,92,246,0.5)" strokeWidth="0.5" />

        {/* Left arm */}
        <line x1="35" y1="48" x2="12" y2="72" stroke="#6366f1" strokeWidth="0.8" />
        <line x1="12" y1="72" x2="5" y2="92" stroke="#818cf8" strokeWidth="0.7" />
        {/* Right arm */}
        <line x1="85" y1="48" x2="108" y2="72" stroke="#6366f1" strokeWidth="0.8" />
        <line x1="108" y1="72" x2="115" y2="92" stroke="#818cf8" strokeWidth="0.7" />

        {/* Extended arms (Vitruvian) */}
        <line x1="5" y1="92" x2="115" y2="92" stroke="rgba(99,102,241,0.2)" strokeWidth="0.4" strokeDasharray="2 3" />

        {/* Hips */}
        <line x1="45" y1="90" x2="75" y2="90" stroke="#a78bfa" strokeWidth="0.8" />

        {/* Left leg */}
        <line x1="50" y1="90" x2="38" y2="125" stroke="#7c3aed" strokeWidth="0.8" />
        <line x1="38" y1="125" x2="32" y2="155" stroke="#8b5cf6" strokeWidth="0.7" />
        {/* Right leg */}
        <line x1="70" y1="90" x2="82" y2="125" stroke="#7c3aed" strokeWidth="0.8" />
        <line x1="82" y1="125" x2="88" y2="155" stroke="#8b5cf6" strokeWidth="0.7" />

        {/* V-spread legs */}
        <line x1="32" y1="155" x2="88" y2="155" stroke="rgba(139,92,246,0.2)" strokeWidth="0.4" strokeDasharray="2 3" />

        {/* Body outline nodes */}
        <circle cx="60" cy="40" r="1.5" fill="#8b5cf6" opacity="0.8" />
        <circle cx="35" cy="48" r="1.5" fill="#6366f1" opacity="0.8" />
        <circle cx="85" cy="48" r="1.5" fill="#6366f1" opacity="0.8" />
        <circle cx="60" cy="90" r="1.5" fill="#a78bfa" opacity="0.8" />
        <circle cx="12" cy="72" r="1" fill="#818cf8" opacity="0.6" />
        <circle cx="108" cy="72" r="1" fill="#818cf8" opacity="0.6" />
        <circle cx="38" cy="125" r="1" fill="#7c3aed" opacity="0.6" />
        <circle cx="82" cy="125" r="1" fill="#7c3aed" opacity="0.6" />

        {/* Data annotation lines */}
        <line x1="115" y1="22" x2="115" y2="155" stroke="rgba(139,92,246,0.15)" strokeWidth="0.4" />
        <line x1="113" y1="22" x2="117" y2="22" stroke="rgba(139,92,246,0.3)" strokeWidth="0.4" />
        <line x1="113" y1="155" x2="117" y2="155" stroke="rgba(139,92,246,0.3)" strokeWidth="0.4" />

        {/* Scanning line animation */}
        <line x1="5" y1="0" x2="115" y2="0" stroke="rgba(139,92,246,0.4)" strokeWidth="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 0"
            to="0 160"
            dur="4s"
            repeatCount="indefinite"
          />
        </line>

        {/* Grid cross center */}
        <line x1="56" y1="75" x2="64" y2="75" stroke="rgba(139,92,246,0.3)" strokeWidth="0.4" />
        <line x1="60" y1="71" x2="60" y2="79" stroke="rgba(139,92,246,0.3)" strokeWidth="0.4" />
      </svg>
    </div>
  );
}
