import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { getActiveAppLinks, getCatalogAudiobooks, type CatalogAudiobook } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
    BookHeadphones,
    Headphones,
    Smartphone,
    Zap,
    ArrowRight,
    Download,
    Star,
    BookOpen,
    Brain,
    Heart,
    ChevronLeft,
    ChevronRight,
    Twitter,
    Instagram,
    Linkedin,
    Menu,
    X,
    Mail,
    CheckCircle,
    Play,
    Clock,
    TrendingUp,
    DollarSign,
    House,
    Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Static Data ───────────────────────────────────────────────────────────────

// Gradient pool cycled for cover fallbacks
const COVER_GRADIENTS = [
    "from-orange-500 to-rose-500",
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-blue-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-indigo-500 to-violet-600",
    "from-pink-500 to-rose-600",
    "from-sky-500 to-cyan-600",
];

const formatDuration = (seconds?: number): string => {
    if (!seconds) return "";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};

const CATEGORIES = [
    { icon: Brain, label: "Self-Help", count: "12+" },
    { icon: Globe, label: "Personal Development", count: "3+" },
    { icon: TrendingUp, label: "Stoicism", count: "2+" },
    { icon: Heart, label: "Relationships and Dating", count: "2+" },
    { icon: Brain, label: "Neuroscience", count: "1+" },
    { icon: House, label: "Parenting & Family", count: "1+" },
    { icon: Clock, label: "Time Management", count: "2+" },
    { icon: BookOpen, label: "Psychology", count: "4+" },
    { icon: Star, label: "Spirituality", count: "2+" },
    { icon: DollarSign, label: "Finance & Investing", count: "3+" },
];

const FEATURES = [
    {
        icon: Headphones,
        title: "Immersive Audio",
        description:
            "High-fidelity lossless playback that puts you right in the middle of the story. Professional narrations that bring every word to life.",
        accent: "from-orange-400 to-rose-500",
    },
    {
        icon: Smartphone,
        title: "Listen Anywhere",
        description:
            "Seamlessly sync your progress across all your devices. Start on your phone, continue on your desktop — never lose your place.",
        accent: "from-violet-400 to-purple-600",
    },
    {
        icon: Zap,
        title: "Smart Discovery",
        description:
            "AI-powered recommendations learn your taste and surface hidden gems. Discover your next favorite book before you even knew to look for it.",
        accent: "from-cyan-400 to-blue-500",
    },
];

const TESTIMONIALS = [
    {
        name: "Sarah M.",
        role: "Book Club Leader",
        initial: "S",
        rating: 5,
        review:
            '"BookSync completely transformed my commute. I\'ve finished more books in the last three months than in the previous year. The app quality is second to none."',
        accentColor: "bg-gradient-to-br from-orange-500 to-rose-500",
    },
    {
        name: "David K.",
        role: "Software Engineer",
        initial: "D",
        rating: 5,
        review:
            '"The audio quality is stunning and the catalogue is enormous. I love that it syncs perfectly between my phone and laptop. Absolutely worth every penny."',
        accentColor: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
        name: "Priya R.",
        role: "Marketing Director",
        initial: "P",
        rating: 5,
        review:
            '"The smart recommendations are genuinely impressive — it found authors I now adore that I\'d never have discovered on my own. The UI is clean and beautiful too."',
        accentColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
];

const STATS = [
    { value: "40+", label: "Audiobooks" },
    { value: "30+", label: "Top Authors" },
    { value: "4.9", label: "Average Rating" },
    { value: "38+", label: "Happy Listeners" },
];

// ─── Main Component ─────────────────────────────────────────────────────────────

export const Home: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const dashboardLink = user?.role === "admin" ? "/dashboard" : "/user";
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const { data: activeAppLinks, isLoading: isLinksLoading } = useQuery({
        queryKey: ["active-app-links"],
        queryFn: getActiveAppLinks,
    });

    const {
        data: catalogData,
        isLoading: isCatalogLoading,
        error: catalogError,
    } = useQuery({
        queryKey: ["audiobooks-catalog"],
        queryFn: getCatalogAudiobooks,
    });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
        }
    };

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const hasAppLinks = !isLinksLoading && activeAppLinks && activeAppLinks.length > 0;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-body antialiased overflow-x-hidden">

            {/* ── NAVBAR ── */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto max-w-7xl flex h-18 items-center justify-between px-4 md:px-8 py-4">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo">
                        <img src="/logo.png" alt="BookSync Logo" className="h-9 w-auto group-hover:scale-105 transition-transform" />
                        <span className="text-xl font-bold tracking-tight">BookSync</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
                        <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Browse
                        </a>
                        <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Reviews
                        </a>
                        <a href="#download" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Download
                        </a>
                    </nav>

                    {/* CTA */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Button asChild className="rounded-full shadow-md shadow-primary/20">
                                <Link to={dashboardLink}>Go to Dashboard <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="hidden sm:inline-flex rounded-full text-sm">
                                    <Link to="/login">Log in</Link>
                                </Button>
                                <Button asChild className="rounded-full shadow-md shadow-primary/20 text-sm">
                                    <Link to="/register">Get Started Free</Link>
                                </Button>
                            </>
                        )}
                        {/* Mobile menu button */}
                        <button
                            className="md:hidden ml-1 p-2 rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                            id="mobile-menu-btn"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border px-6 py-4 space-y-3">
                        {["features", "browse", "testimonials", "download"].map((item) => (
                            <a
                                key={item}
                                href={`#${item}`}
                                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground capitalize"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item === "testimonials" ? "Reviews" : item.charAt(0).toUpperCase() + item.slice(1)}
                            </a>
                        ))}
                        {!isAuthenticated && (
                            <Link to="/login" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Log in
                            </Link>
                        )}
                    </div>
                )}
            </header>

            <main className="flex-1">

                {/* ── HERO ── */}
                <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden" id="hero">
                    {/* Animated background orbs */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute -top-[300px] -left-[200px] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-primary/25 via-orange-500/15 to-transparent blur-[120px] animate-float" />
                        <div className="absolute -bottom-[200px] -right-[200px] h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-violet-500/20 via-primary/10 to-transparent blur-[120px] animate-float-delayed" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-orange-400/10 to-rose-500/10 blur-[80px]" />
                    </div>

                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.6)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.6)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_50%,transparent_100%)] z-0 opacity-40" />

                    <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                            {/* Left: Text */}
                            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary mb-7 backdrop-blur-sm animate-fadeInUp">
                                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    New collection available now
                                </div>

                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-fadeInUp animation-delay-100">
                                    Immerse Yourself in{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-rose-500">
                                        Infinite Stories
                                    </span>
                                </h1>

                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 animate-fadeInUp animation-delay-200">
                                    Your premium platform for discovering, organizing, and enjoying the
                                    world's best audiobooks — crafted with extraordinary narrators and
                                    crystal-clear audio.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10 animate-fadeInUp animation-delay-300">
                                    {isAuthenticated ? (
                                        <Button size="lg" className=" px-8 text-base rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-all" asChild>
                                            <Link to={dashboardLink}>
                                                Open My Library <ArrowRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button size="lg" className=" px-8 text-base rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-all" asChild>
                                                <Link to="/register">
                                                    Start Listening Free <ArrowRight className="ml-2 h-5 w-5" />
                                                </Link>
                                            </Button>
                                            <Button size="lg" variant="outline" className=" px-8 text-base rounded-full hover:bg-muted/60 transition-all" asChild>
                                                <a href="#browse">
                                                    <Play className="mr-2 h-4 w-4 fill-current" /> Browse Catalog
                                                </a>
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Trust indicators */}
                                <div className="flex flex-wrap items-center gap-5 justify-center lg:justify-start text-sm text-muted-foreground animate-fadeInUp animation-delay-400">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span>Completely free to use</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span>40+ audiobooks</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span>Available on mobile</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Visual */}
                            <div className="flex-1 relative hidden lg:flex items-center justify-center animate-fadeInUp animation-delay-200">
                                <div className="relative w-[400px] h-[500px]">
                                    {/* Main card */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-orange-500/10 border border-primary/20 backdrop-blur-sm shadow-2xl overflow-hidden animate-float">
                                        <div className="p-6 h-full flex flex-col">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg">
                                                    <BookHeadphones className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Now Playing</p>
                                                    <p className="text-sm font-semibold">Atomic Habits</p>
                                                </div>
                                                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>5h 35m</span>
                                                </div>
                                            </div>
                                            {/* Fake cover */}
                                            <div className="rounded-2xl h-52 w-full bg-gradient-to-br from-orange-500 to-rose-500 mb-5 flex items-center justify-center shadow-lg">
                                                <BookOpen className="h-20 w-20 text-white/40" />
                                            </div>
                                            {/* Waveform bars */}
                                            <div className="flex items-end justify-center gap-1 h-10 mb-5">
                                                {Array.from({ length: 32 }, (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 rounded-full bg-primary/60"
                                                        style={{ height: `${20 + Math.sin(i * 0.6) * 14 + Math.random() * 10}%` }}
                                                    />
                                                ))}
                                            </div>
                                            {/* Progress */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>1:42:10</span>
                                                    <span>5:35:00</span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full" style={{ width: "31%" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating secondary cards */}
                                    <div className="absolute -top-6 -right-8 bg-background/90 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-lg text-left w-52 animate-float-delayed">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                                <Star className="h-4 w-4 text-white fill-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Avg. Rating</p>
                                                <p className="text-sm font-bold">4.9 / 5.0</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-6 -left-8 bg-background/90 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-lg text-left w-52 animate-float">
                                        <p className="text-xs text-muted-foreground mb-1">New this week</p>
                                        <p className="text-sm font-bold">12 new titles added</p>
                                        <div className="flex -space-x-2 mt-2">
                                            {["from-orange-400 to-rose-500", "from-violet-400 to-purple-600", "from-cyan-400 to-blue-500", "from-emerald-400 to-teal-500"].map((g, i) => (
                                                <div key={i} className={`h-6 w-6 rounded-full bg-gradient-to-br ${g} border-2 border-background`} />
                                            ))}
                                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-bold">+10</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── STATS STRIP ── */}
                <section className="py-12 border-y border-border/60 bg-muted/30">
                    <div className="container mx-auto max-w-7xl px-4 md:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {STATS.map((stat) => (
                                <div key={stat.label} className="flex flex-col items-center justify-center text-center gap-1">
                                    <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FEATURED BESTSELLERS ── */}
                <section className="py-24 md:py-32" id="browse">
                    <div className="container mx-auto max-w-7xl px-4 md:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                            <div>
                                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Trending Now</p>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Audiobooks</h2>
                            </div>
                            <a
                                href="#download"
                                className="self-start sm:self-auto inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group rounded-full"
                            >
                                Get the app to listen <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>

                        {/* Scrollable card row with navigation buttons */}
                        <div className="relative group/slider">
                            {/* Navigation Buttons */}
                            {!isCatalogLoading && !catalogError && (
                                <>
                                    <button
                                        onClick={() => scroll("left")}
                                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center text-foreground opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-background hover:scale-110 hidden md:flex"
                                        aria-label="Scroll left"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={() => scroll("right")}
                                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center text-foreground opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-background hover:scale-110 hidden md:flex"
                                        aria-label="Scroll right"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            <div
                                ref={scrollContainerRef}
                                className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                            >
                                {isCatalogLoading ? (
                                    // ── Skeleton cards
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex-shrink-0 w-60 snap-start">
                                            <div className="h-80 rounded-2xl bg-muted animate-pulse mb-4" />
                                            <div className="space-y-3">
                                                <div className="h-4 w-20 rounded-full bg-muted animate-pulse" />
                                                <div className="h-5 w-48 rounded-full bg-muted animate-pulse" />
                                                <div className="h-4 w-32 rounded-full bg-muted animate-pulse" />
                                            </div>
                                        </div>
                                    ))
                                ) : catalogError ? (
                                    // ── Error state
                                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-4 bg-muted/20 rounded-3xl border border-dashed border-border">
                                        <BookOpen className="h-12 w-12 text-muted-foreground/40" />
                                        <div className="space-y-1">
                                            <p className="font-semibold text-foreground">Failed to load audiobooks</p>
                                            <p className="text-muted-foreground text-sm">Please check your connection or try again later.</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                                            Try Again
                                        </Button>
                                    </div>
                                ) : (
                                    // ── Real cards
                                    (catalogData ?? []).map((book: CatalogAudiobook, idx: number) => {
                                        const gradient = COVER_GRADIENTS[idx % COVER_GRADIENTS.length];
                                        const duration = formatDuration(book.durationInSeconds);
                                        const rating = book.averageRating && book.averageRating > 0 ? book.averageRating.toFixed(1) : null;
                                        return (
                                            <div
                                                key={book._id}
                                                className="group/card flex-shrink-0 w-60 snap-start"
                                                id={`book-card-${book._id}`}
                                            >
                                                {/* Cover */}
                                                <div className="relative h-80 rounded-2xl mb-4 overflow-hidden shadow-md group-hover/card:shadow-2xl group-hover/card:-translate-y-2 transition-all duration-500 ease-out">
                                                    {book.coverImageUrl ? (
                                                        <img
                                                            src={book.coverImageUrl}
                                                            alt={book.title}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform duration-700 group-hover/card:scale-110`}>
                                                            <BookOpen className="h-20 w-20 text-white/30" />
                                                        </div>
                                                    )}

                                                    {/* Glass Overlay for details */}
                                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">
                                                            {book.categoryId?.name || "Featured"}
                                                        </p>
                                                    </div>

                                                    {/* Play → scroll to download */}
                                                    <button
                                                        onClick={() => document.getElementById("download")?.scrollIntoView({ behavior: "smooth" })}
                                                        className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]"
                                                        aria-label={`Listen to ${book.title}`}
                                                    >
                                                        <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-xl scale-90 group-hover/card:scale-100 transition-transform duration-300 hover:scale-110 active:scale-95">
                                                            <Play className="h-6 w-6 text-white ml-1 fill-white" />
                                                        </div>
                                                    </button>

                                                    {/* Duration Badge */}
                                                    {duration && (
                                                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-white/20">
                                                            <Clock className="h-3 w-3" />
                                                            {duration}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                                            <span className="text-[11px] font-bold text-amber-600 tracking-tighter">
                                                                {rating ?? "NEW"}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                            Free
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-bold leading-tight group-hover/card:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">{book.title}</h3>
                                                    <p className="text-xs font-medium text-muted-foreground line-clamp-1">{book.authorId?.name}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CATEGORIES ── */}
                <section className="py-20 bg-muted/30 border-y border-border/60">
                    <div className="container mx-auto max-w-7xl px-4 md:px-8">
                        <div className="text-center mb-12">
                            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Explore by Genre</p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Find Your Next Story</h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {CATEGORIES.map(({ icon: Icon, label, count }) => (
                                <button
                                    key={label}
                                    id={`category-${label.toLowerCase()}`}
                                    className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="relative">
                                        <p className="font-semibold text-sm">{label}</p>
                                        <p className="text-xs text-muted-foreground">{count} titles</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── WHY CHOOSE US ── */}
                <section className="py-24 md:py-32" id="features">
                    <div className="container mx-auto max-w-7xl px-4 md:px-8">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Why BookSync?</p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                The Premium Audiobook Experience
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Every detail is designed to keep you absorbed in the story, not fighting with the app.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {FEATURES.map(({ icon: Icon, title, description, accent }) => (
                                <div
                                    key={title}
                                    className="group relative p-8 rounded-3xl border border-border bg-background hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Gradient corner decoration */}
                                    <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-10 group-hover:opacity-15 transition-opacity blur-2xl`} />

                                    <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center mb-6 shadow-lg`}>
                                        <Icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 relative">{title}</h3>
                                    <p className="text-muted-foreground leading-relaxed relative">{description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── TESTIMONIALS ── */}
                <section className="py-24 md:py-32 bg-muted/30 border-y border-border/60" id="testimonials">
                    <div className="container mx-auto max-w-7xl px-4 md:px-8">
                        <div className="text-center mb-16">
                            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Loved by Listeners</p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Community Says</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {TESTIMONIALS.map((t) => (
                                <div
                                    key={t.name}
                                    className="group p-8 rounded-3xl bg-background border border-border hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                                    id={`testimonial-${t.name.split(".")[0].toLowerCase()}`}
                                >
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-5">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed mb-6 italic">{t.review}</p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full ${t.accentColor} flex items-center justify-center text-white font-bold text-sm`}>
                                            {t.initial}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{t.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── APP DOWNLOAD ── */}
                <section className="py-24 md:py-32 relative overflow-hidden" id="download">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-orange-600/85 to-rose-600/80" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,white/5_1px,transparent_1px),linear-gradient(to_bottom,white/5_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />

                    <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-4 py-1.5 text-sm font-medium text-white mb-6 backdrop-blur-sm">
                            <Smartphone className="h-4 w-4" />
                            Available on all platforms
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                            Take Your Stories<br />Anywhere
                        </h2>
                        <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            Download the BookSync app and carry your entire library in your pocket.
                            Offline listening, sleep timer, variable speed — all in one beautiful app.
                        </p>

                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            {hasAppLinks ? (
                                activeAppLinks!.map((appLink) => {
                                    const platform = appLink.platform.toLowerCase();
                                    const isIos = platform === "ios";
                                    const isAndroid = platform === "android";
                                    return (
                                        <a
                                            key={appLink._id}
                                            href={appLink.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            id={`download-${platform}`}
                                            className="group flex items-center gap-3 bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 transition-all hover:scale-105 shadow-lg"
                                        >
                                            {isAndroid ? (
                                                <Download className="h-7 w-7 flex-shrink-0" />
                                            ) : (
                                                <Smartphone className="h-7 w-7 flex-shrink-0" />
                                            )}
                                            <div className="text-left">
                                                <p className="text-xs opacity-70">
                                                    {isIos ? "Download on the" : isAndroid ? "Get it on" : "Download for"}
                                                </p>
                                                <p className="font-bold text-base leading-tight">
                                                    {isIos ? "App Store" : isAndroid ? "Google Play" : appLink.platform.charAt(0).toUpperCase() + appLink.platform.slice(1)}
                                                </p>
                                            </div>
                                        </a>
                                    );
                                })
                            ) : (
                                <p className="text-white/70 text-sm">App links coming soon — stay tuned!</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── NEWSLETTER ── */}
                <section className="py-20 border-b border-border/60" id="newsletter">
                    <div className="container mx-auto max-w-3xl px-4 md:px-8 text-center">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                            Stay in the Story
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Get curated audiobook picks, exclusive deals, and author spotlights delivered to your inbox every week.
                        </p>

                        {subscribed ? (
                            <div className="flex items-center justify-center gap-3 text-primary font-semibold text-lg animate-fadeInUp">
                                <CheckCircle className="h-6 w-6" />
                                You're subscribed! Check your inbox soon.
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" id="newsletter-form">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    id="newsletter-email"
                                    className="flex-1 px-5 rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                                />
                                <Button type="submit" className=" px-7 rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-all flex-shrink-0" id="newsletter-submit">
                                    Subscribe
                                </Button>
                            </form>
                        )}
                        <p className="text-xs text-muted-foreground mt-4">No spam, ever. Unsubscribe at any time.</p>
                    </div>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer className="bg-muted/20 pt-16 pb-8">
                <div className="container mx-auto max-w-7xl px-4 md:px-8">

                    {/* Top grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2.5 mb-4">
                                <img src="/logo.png" alt="BookSync Logo" className="h-9 w-auto" />
                                <span className="text-xl font-bold">BookSync</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                                Premium audiobooks for curious minds. Discover, listen, and grow - wherever life takes you.
                            </p>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Platform</h4>
                            <ul className="space-y-2.5">
                                {["Features", "Browse Catalog", "New Releases", "Authors"].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Support</h4>
                            <ul className="space-y-2.5">
                                {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Follow Us</h4>
                            <div className="flex gap-3">
                                {[
                                    { icon: Twitter, label: "Twitter" },
                                    { icon: Instagram, label: "Instagram" },
                                    { icon: Linkedin, label: "LinkedIn" },
                                ].map(({ icon: Icon, label }) => (
                                    <a
                                        key={label}
                                        href="#"
                                        aria-label={label}
                                        className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Divider + Bottom row */}
                    <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} BookSync Inc. All rights reserved.
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
