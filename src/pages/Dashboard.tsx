import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookHeadphones, Users, Mic2, Tag, BookOpen, Loader2, ListMusic, PlayCircle, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
        </CardContent>
    </Card>
);

export const Dashboard: React.FC = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
    });

    if (isLoading) {
        return (
            <div className="space-y-8 p-8 animate-in fade-in-50 duration-500">
                <div className="flex justify-between flex-wrap gap-4 items-center">
                    <div>
                        <Skeleton className="h-9 w-64 mb-2" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-1" />
                                <Skeleton className="h-3 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-destructive">
                <p>Failed to load dashboard statistics. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8 animate-in fade-in-50 duration-500">
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <p className="text-muted-foreground">
                        Welcome back. Here is the summary of your platform's performance.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/dashboard/audiobooks/create">
                            <Plus className="w-4 h-4 mr-1" /> New Audiobook
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/dashboard/categories/create">
                            <Plus className="w-4 h-4 mr-1" /> New Category
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/dashboard/authors/create">
                            <Plus className="w-4 h-4 mr-1" /> New Author
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <StatCard
                    title="Audiobooks"
                    value={stats?.totals.audiobooks || 0}
                    icon={BookHeadphones}
                    description="Available in catalog"
                />
                <StatCard
                    title="Total Users"
                    value={stats?.totals.users || 0}
                    icon={Users}
                    description={`+${stats?.newUsersLastWeek || 0} this week`}
                />
                <StatCard
                    title="Categories"
                    value={stats?.totals.categories || 0}
                    icon={Tag}
                    description="Content genres"
                />
                <StatCard
                    title="Reviews"
                    value={stats?.totals.reviews || 0}
                    icon={BookOpen}
                    description="Total user reviews"
                />
                <StatCard
                    title="Playlists"
                    value={stats?.totals.playlists || 0}
                    icon={ListMusic}
                    description="Created by users"
                />
                <StatCard
                    title="Total Listens"
                    value={stats?.totals.listens || 0}
                    icon={PlayCircle}
                    description="Across all content"
                />
            </div>

            {stats?.popularAudiobooks && stats.popularAudiobooks.length > 0 && (
                <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-semibold tracking-tight">Popular Audiobooks</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {stats.popularAudiobooks.map((book: any) => (
                            <Card key={book._id} className="overflow-hidden flex gap-4 transition-all hover:shadow-md h-32">
                                <div className="w-24 shrink-0 aspect-[2/3] bg-muted flex items-center justify-center overflow-hidden h-full">
                                    {book.coverImageUrl ? (
                                        <img src={book.coverImageUrl} alt={book.title} className="object-cover w-full h-full" />
                                    ) : (
                                        <BookHeadphones className="w-8 h-8 text-muted-foreground/50" />
                                    )}
                                </div>
                                <div className="flex flex-col justify-center flex-1 py-3 pr-4 min-w-0">
                                    <div className="mb-2">
                                        <CardTitle className="text-base line-clamp-1">{book.title}</CardTitle>
                                        <CardDescription className="line-clamp-1 text-xs">
                                            By {book.authorId?.name || "Unknown Author"}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-3 text-xs text-muted-foreground mt-auto">
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-foreground">{book.averageRating?.toFixed(1) || "0.0"}</span> Rating
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-foreground">{book.reviewsCount || 0}</span> Reviews
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
