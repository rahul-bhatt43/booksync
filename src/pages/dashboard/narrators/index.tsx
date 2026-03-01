import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNarrators } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Plus, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Narrators: React.FC = () => {
    const { data: narrators, isLoading } = useQuery({
        queryKey: ["narrators"],
        queryFn: getNarrators,
    });

    return (
        <div className="p-8 px-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Narrators</h1>
                    <p className="text-muted-foreground">Manage your audiobook voice talents.</p>
                </div>
                <Button asChild>
                    <Link to="/dashboard/narrators/create">
                        <Plus className="mr-2 h-4 w-4" /> Add Narrator
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3 mt-1" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {narrators?.map((narrator) => (
                        <Card key={narrator._id} className="relative group">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{narrator.name}</CardTitle>
                                </div>
                                {narrator.biography && (
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {narrator.biography}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="flex gap-2 invisible group-hover:visible absolute top-4 right-4 bg-background p-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link to={`/dashboard/narrators/${narrator._id}`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Narrators;
