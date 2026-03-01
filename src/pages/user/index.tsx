import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { BookHeadphones, Search, PlayCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const UserDiscover: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8 pb-16 md:pb-0 animate-in fade-in-50 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Listener'}</h1>
                <p className="text-muted-foreground">Find your next great listen today.</p>
            </div>

            <div className="relative max-w-xl">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search for audiobooks, authors, or genres..." className="pl-10 h-12 rounded-full bg-muted/50 border-transparent focus:bg-background" />
            </div>

            <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Trending Now</h2>
                    <Button variant="ghost" size="sm">See All</Button>
                </div>

                {/* Fallback empty state for now */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="overflow-hidden bg-transparent border-0 shadow-none group cursor-pointer">
                            <div className="aspect-[2/3] relative bg-muted rounded-xl flex items-center justify-center overflow-hidden mb-3 group-hover:shadow-md transition-all">
                                <BookHeadphones className="w-12 h-12 text-muted-foreground/30" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <PlayCircle className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">Trending Title {i}</h3>
                            <p className="text-xs text-muted-foreground mt-1">Famous Author</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-4 pt-4">
                <h2 className="text-xl font-semibold tracking-tight">Explore Genres</h2>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {["Fiction", "Business", "Self Development", "Sci-Fi", "Mystery", "History"].map((genre) => (
                        <div key={genre} className="flex-shrink-0">
                            <Button variant="outline" className="rounded-full bg-muted/40 whitespace-nowrap px-6 h-12 border-primary/10 hover:border-primary/30">
                                {genre}
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default UserDiscover;
