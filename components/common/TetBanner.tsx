import React, { useState, useEffect, useRef } from "react";

// Tết 2026 Theme Configuration
const TET_CONFIG = {
    startDate: new Date("2026-01-02"),
    endDate: new Date("2026-02-15T23:59:59"),
    year: 2026,
    zodiac: "Bính Tỵ", // Year of the Snake
};

// Check if Tết theme should be active
const isTetSeason = (): boolean => {
    const now = new Date();
    return now >= TET_CONFIG.startDate && now <= TET_CONFIG.endDate;
};

// CSS Keyframes injected into head
const injectTetStyles = () => {
    const styleId = "tet-2026-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
    @keyframes tetPetalFall {
      0% {
        transform: translateY(-100%) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }

    @keyframes tetFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes tetSway {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
    }

    @keyframes tetShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes tetGlow {
      0%, 100% { filter: drop-shadow(0 0 8px #FDE047); }
      50% { filter: drop-shadow(0 0 16px #FBBF24); }
    }

    @keyframes tetLanternGlow {
      0%, 100% { filter: drop-shadow(0 0 5px #F87171); }
      50% { filter: drop-shadow(0 0 15px #DC2626); }
    }

    .tet-petal {
      position: absolute;
      pointer-events: none;
      animation: tetPetalFall linear infinite;
    }

    .tet-float {
      animation: tetFloat 2s ease-in-out infinite;
    }

    .tet-sway {
      animation: tetSway 3s ease-in-out infinite;
      transform-origin: top center;
    }

    .tet-shimmer {
      background: linear-gradient(90deg, transparent, rgba(255,215,0,0.4), transparent);
      background-size: 200% 100%;
      animation: tetShimmer 2s linear infinite;
    }

    .tet-glow {
      animation: tetGlow 2s ease-in-out infinite;
    }

    .tet-lantern-glow {
      animation: tetLanternGlow 2s ease-in-out infinite;
    }
  `;
    document.head.appendChild(style);
};

// Mai flower petal SVG
const MaiPetal: React.FC<{ delay: number; left: number; size: number; duration: number }> = ({
    delay,
    left,
    size,
    duration,
}) => (
    <div
        className="tet-petal"
        style={{
            left: `${left}%`,
            top: "-30px",
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
        }}
    >
        <svg
            width={size}
            height={size}
            viewBox="0 0 30 30"
            fill="none"
            className="tet-glow"
        >
            {/* 5-petal mai flower */}
            <g transform="translate(15,15)">
                {[0, 72, 144, 216, 288].map((angle, i) => (
                    <ellipse
                        key={i}
                        cx="0"
                        cy="-8"
                        rx="4"
                        ry="8"
                        fill="#FACC15"
                        transform={`rotate(${angle})`}
                        opacity="0.95"
                    />
                ))}
                <circle cx="0" cy="0" r="3" fill="#F59E0B" />
                <circle cx="0" cy="0" r="1.5" fill="#DC2626" />
            </g>
        </svg>
    </div>
);

// Lantern component with glow
const Lantern: React.FC<{ side: "left" | "right" }> = ({ side }) => (
    <div
        className={`absolute top-0 ${side === "left" ? "left-4" : "right-12"} tet-sway tet-lantern-glow`}
        style={{ zIndex: 5 }}
    >
        <svg width="36" height="56" viewBox="0 0 36 56" fill="none">
            {/* String */}
            <line x1="18" y1="0" x2="18" y2="10" stroke="#B91C1C" strokeWidth="2" />
            {/* Top cap */}
            <rect x="11" y="10" width="14" height="5" fill="#DC2626" rx="2" />
            {/* Body */}
            <ellipse cx="18" cy="30" rx="14" ry="16" fill="url(#lanternGradient)" />
            {/* Ribs */}
            <path d="M 8 25 Q 18 20 28 25" stroke="#B91C1C" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M 6 30 Q 18 25 30 30" stroke="#B91C1C" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M 8 35 Q 18 30 28 35" stroke="#B91C1C" strokeWidth="1" fill="none" opacity="0.5" />
            {/* Bottom cap */}
            <rect x="11" y="44" width="14" height="5" fill="#DC2626" rx="2" />
            {/* Tassel */}
            <line x1="18" y1="49" x2="18" y2="56" stroke="#F59E0B" strokeWidth="2" />
            <line x1="14" y1="52" x2="14" y2="56" stroke="#F59E0B" strokeWidth="1" />
            <line x1="22" y1="52" x2="22" y2="56" stroke="#F59E0B" strokeWidth="1" />
            {/* Inner glow */}
            <ellipse cx="18" cy="30" rx="8" ry="10" fill="#FDE047" opacity="0.4" />
            <defs>
                <radialGradient id="lanternGradient" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#F87171" />
                    <stop offset="100%" stopColor="#DC2626" />
                </radialGradient>
            </defs>
        </svg>
    </div>
);

// Audio hook for Vietnamese Tết music
// To use your own music: place an MP3 file at public/tet-music.mp3
const useTetMusic = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        // Try local file first, then fallback
        // Place your Tết music file at: public/tet-music.mp3
        // Recommended songs: "Xuân Này Con Không Về", "Mùa Xuân Ơi", "Gong Xi Fa Cai"
        audioRef.current.src = "/tet-music.mp3";

        // Handle error - file might not exist
        audioRef.current.onerror = () => {
            console.log("Tết music file not found at /tet-music.mp3. Add your own!");
        };

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;

        if (isMuted) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsMuted(false);
            }).catch((err) => {
                console.log("Could not play music:", err.message);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
            setIsMuted(true);
        }
    };

    return { isPlaying, isMuted, toggleMusic };
};

// Main Tết Banner Component
export const TetBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isDismissed, setIsDismissed] = useState(false);
    const { isMuted, toggleMusic } = useTetMusic();

    // Inject CSS on mount
    useEffect(() => {
        injectTetStyles();
    }, []);

    // Check localStorage for dismissal
    useEffect(() => {
        const dismissed = localStorage.getItem("tet2026_banner_dismissed");
        if (dismissed === "true") {
            setIsDismissed(true);
        }
    }, []);

    // Don't render if not Tết season or dismissed
    if (!isTetSeason() || isDismissed) {
        return null;
    }

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsDismissed(true);
            localStorage.setItem("tet2026_banner_dismissed", "true");
        }, 300);
    };

    // Generate random petals
    const petals = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        delay: i * 0.6,
        left: 3 + (i * 6.5) % 90,
        size: 20 + Math.random() * 12,
        duration: 6 + Math.random() * 4,
    }));

    return (
        <div
            className={`relative overflow-hidden transition-all duration-300 ${isVisible ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
        >
            {/* Background gradient with shimmer */}
            <div
                className="relative py-4 px-4"
                style={{
                    background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 30%, #991B1B 50%, #B91C1C 70%, #DC2626 100%)",
                }}
            >
                {/* Shimmer overlay */}
                <div
                    className="absolute inset-0 tet-shimmer pointer-events-none"
                    style={{ opacity: 0.3 }}
                />

                {/* Falling Mai Petals */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 10 }}>
                    {petals.map((petal) => (
                        <MaiPetal
                            key={petal.id}
                            delay={petal.delay}
                            left={petal.left}
                            size={petal.size}
                            duration={petal.duration}
                        />
                    ))}
                </div>

                {/* Lanterns */}
                <Lantern side="left" />
                <Lantern side="right" />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center gap-4">
                    {/* Snake emoji for Year of Snake */}
                    <span className="text-3xl tet-float" style={{ animationDelay: "0s" }}>🐍</span>

                    {/* Main text with glow */}
                    <div className="text-center">
                        <h2
                            className="text-xl md:text-2xl font-bold text-white"
                            style={{
                                textShadow: "0 0 10px #FDE047, 0 0 20px #F59E0B, 2px 2px 4px rgba(0,0,0,0.5)",
                            }}
                        >
                            🌼 Chúc Mừng Năm Mới 2026 🌼
                        </h2>
                        <p
                            className="text-sm md:text-base mt-1"
                            style={{
                                color: "#FEF08A",
                                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                            }}
                        >
                            Năm {TET_CONFIG.zodiac} • Vạn Sự Như Ý • Tài Lộc Đầy Nhà
                        </p>
                    </div>

                    {/* Mai flower emoji */}
                    <span className="text-3xl tet-float" style={{ animationDelay: "0.5s" }}>🌸</span>
                </div>

                {/* Action buttons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
                    {/* Music toggle */}
                    <button
                        onClick={toggleMusic}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all hover:scale-110"
                        title={isMuted ? "Bật nhạc Tết" : "Tắt nhạc"}
                    >
                        {isMuted ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        )}
                    </button>

                    {/* Dismiss button */}
                    <button
                        onClick={handleDismiss}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all hover:scale-110"
                        title="Đóng banner"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Floating Mai Petals Decoration (for page corners)
export const TetDecorations: React.FC = () => {
    useEffect(() => {
        injectTetStyles();
    }, []);

    if (!isTetSeason()) {
        return null;
    }

    return (
        <>
            {/* Bottom left mai flower */}
            <div
                className="fixed bottom-6 left-6 pointer-events-none z-40 tet-float"
                style={{ animationDelay: "0.3s" }}
            >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="tet-glow">
                    <g transform="translate(25,25)">
                        {[0, 72, 144, 216, 288].map((angle, i) => (
                            <ellipse
                                key={i}
                                cx="0"
                                cy="-12"
                                rx="6"
                                ry="12"
                                fill="#FACC15"
                                transform={`rotate(${angle})`}
                                opacity="0.85"
                            />
                        ))}
                        <circle cx="0" cy="0" r="5" fill="#F59E0B" />
                        <circle cx="0" cy="0" r="2" fill="#DC2626" />
                    </g>
                </svg>
            </div>

            {/* Bottom right mai flower */}
            <div
                className="fixed bottom-6 right-6 pointer-events-none z-40 tet-float"
                style={{ animationDelay: "0.7s" }}
            >
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="tet-glow">
                    <g transform="translate(25,25)">
                        {[0, 72, 144, 216, 288].map((angle, i) => (
                            <ellipse
                                key={i}
                                cx="0"
                                cy="-12"
                                rx="6"
                                ry="12"
                                fill="#FACC15"
                                transform={`rotate(${angle})`}
                                opacity="0.85"
                            />
                        ))}
                        <circle cx="0" cy="0" r="5" fill="#F59E0B" />
                        <circle cx="0" cy="0" r="2" fill="#DC2626" />
                    </g>
                </svg>
            </div>

            {/* Floating petals across screen */}
            <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="tet-petal"
                        style={{
                            left: `${15 + i * 18}%`,
                            top: "-20px",
                            animationDuration: `${10 + i * 2}s`,
                            animationDelay: `${i * 2}s`,
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g transform="translate(12,12)">
                                {[0, 72, 144, 216, 288].map((angle, j) => (
                                    <ellipse
                                        key={j}
                                        cx="0"
                                        cy="-6"
                                        rx="3"
                                        ry="6"
                                        fill="#FACC15"
                                        transform={`rotate(${angle})`}
                                        opacity="0.7"
                                    />
                                ))}
                                <circle cx="0" cy="0" r="2" fill="#F59E0B" />
                            </g>
                        </svg>
                    </div>
                ))}
            </div>
        </>
    );
};

// Export utility function
export { isTetSeason };

export default TetBanner;
