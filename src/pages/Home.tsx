import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { getActiveAppLinks } from "@/services/api";
import { Button } from "@/components/ui/button";
import { BookHeadphones, Headphones, Smartphone, Zap, ArrowRight, Download } from "lucide-react";

export const Home: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    // Admins go to /dashboard, regular users go to /user
    const dashboardLink = user?.role === "admin" ? "/dashboard" : "/user";

    // Fetch active app links
    const { data: activeAppLinks, isLoading: isLinksLoading } = useQuery({
        queryKey: ["active-app-links"],
        queryFn: getActiveAppLinks,
    });

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-8">
                    <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
                        <BookHeadphones className="h-6 w-6" />
                        <span>BookSync</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Button asChild>
                                <Link to={dashboardLink}>Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="hidden sm:inline-flex rounded-full">
                                    <Link to="/login">Log in</Link>
                                </Button>
                                <Button asChild className="rounded-full">
                                    <Link to="/register">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24">
                    {/* Background decorations */}
                    <div className="absolute inset-0 z-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_top,transparent_20%,black)]" />
                    <div className="absolute -top-[400px] left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 opacity-30 bg-gradient-to-tr from-primary via-orange-500 to-secondary rounded-full blur-[100px] animate-in fade-in duration-1000" />

                    <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-8 flex flex-col items-center text-center">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium mb-8 text-primary backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            Discover our new collection
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-balance">
                            Immerse Yourself in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Infinite Stories</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 text-balance leading-relaxed">
                            Your premium platform for discovering, organizing, and enjoying the world's best audiobooks. Listen anywhere, anytime.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            {isAuthenticated ? (
                                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105" asChild>
                                    <Link to={dashboardLink}>
                                        Open My Library <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105" asChild>
                                        <Link to="/register">
                                            Start Listening Free <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur" asChild>
                                        <Link to="/login">
                                            Explore Catalog
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                        {/* App Download Links Section */}
                        {(!isLinksLoading && activeAppLinks && activeAppLinks.length > 0) && (
                            <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col items-center">
                                <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Also Available On</p>
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    {activeAppLinks.map((appLink) => (
                                        <Button
                                            key={appLink._id}
                                            variant="secondary"
                                            className="rounded-full shadow-sm hover:shadow-md h-12 px-6"
                                            asChild
                                        >
                                            <a href={appLink.url} target="_blank" rel="noopener noreferrer">
                                                {appLink.platform.toLowerCase() === 'android' ? (
                                                    <Smartphone className="mr-2 h-5 w-5" />
                                                ) : appLink.platform.toLowerCase() === 'ios' ? (
                                                    <Smartphone className="mr-2 h-5 w-5" /> // Fallback for iOS just in case icons are missing
                                                ) : (
                                                    <Download className="mr-2 h-5 w-5" />
                                                )}
                                                Download for {appLink.platform.charAt(0).toUpperCase() + appLink.platform.slice(1)}
                                            </a>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 md:py-32 bg-muted/40 relative">
                    <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why Choose BookSync?</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Experience audiobooks like never before with our premium features designed for the ultimate listener.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-background rounded-3xl p-8 border shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                    <Headphones className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Immersive Audio</h3>
                                <p className="text-muted-foreground leading-relaxed">High-fidelity lossless playback that puts you right in the middle of the story, with expertly narrated performances.</p>
                            </div>

                            <div className="bg-background rounded-3xl p-8 border shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                    <Smartphone className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Listen Anywhere</h3>
                                <p className="text-muted-foreground leading-relaxed">Seamlessly sync your progress across all your devices. Start on your phone, finish on your web dashboard.</p>
                            </div>

                            <div className="bg-background rounded-3xl p-8 border shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                    <Zap className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Smart Organization</h3>
                                <p className="text-muted-foreground leading-relaxed">Categorize your library, follow your favorite authors, and discover new titles with our predictive recommendations.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats / Social Proof snippet */}
                <section className="py-20 border-t bg-background">
                    <div className="container mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-center">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 sm:gap-x-16 text-center lg:divide-x divide-border w-full max-w-5xl">
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <span className="text-4xl md:text-5xl font-extrabold text-primary">10k+</span>
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Audiobooks</span>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2 lg:pl-8">
                                <span className="text-4xl md:text-5xl font-extrabold text-primary">500+</span>
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Top Authors</span>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2 lg:pl-8">
                                <span className="text-4xl md:text-5xl font-extrabold text-primary">4.9/5</span>
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Average Rating</span>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2 lg:pl-8">
                                <span className="text-4xl md:text-5xl font-extrabold text-primary">50k+</span>
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Happy Listeners</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/20 pb-8 pt-12">
                <div className="container mx-auto max-w-7xl px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col items-center md:items-start gap-2">
                            <div className="flex items-center gap-2 text-xl font-bold text-primary">
                                <BookHeadphones className="h-6 w-6" />
                                <span>BookSync</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                &copy; {new Date().getFullYear()} BookSync Inc. All rights reserved.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
