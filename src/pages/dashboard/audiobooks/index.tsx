import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAudiobooks, getCategories } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, BookHeadphones } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Audiobooks: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const { data: audiobooks, isLoading } = useQuery({
        queryKey: ["audiobooks", selectedCategory],
        queryFn: () => getAudiobooks(selectedCategory !== "all" ? { categoryId: selectedCategory } : {}),
    });

    return (
        <div className="p-4 md:p-8 space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Audiobooks</h1>
                    <p className="text-muted-foreground text-sm md:text-base">Manage your audiobook catalog.</p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                    <Link to="/dashboard/audiobooks/create">
                        <Plus className="mr-2 h-4 w-4" /> Add Audiobook
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="w-full sm:w-[200px]">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.map((cat) => (
                                <SelectItem key={cat._id} value={cat._id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i} className="relative overflow-hidden flex flex-col">
                            <Skeleton className="aspect-[2/3] w-full rounded-none" />
                            <CardHeader className="p-4 pb-2">
                                <Skeleton className="h-5 w-3/4 mb-1" />
                                <Skeleton className="h-3 w-1/2" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {audiobooks?.map((audiobook) => (
                        <Card key={audiobook._id} className="relative group overflow-hidden flex flex-col transition-all hover:shadow-md">
                            <div className="aspect-[2/3] relative bg-muted flex items-center justify-center overflow-hidden">
                                {audiobook.coverImageUrl ? (
                                    <img src={audiobook.coverImageUrl} alt={audiobook.title} className="object-cover w-full h-full" />
                                ) : (
                                    <BookHeadphones className="w-12 h-12 text-muted-foreground/50" />
                                )}
                            </div>
                            <CardHeader className="p-3 sm:p-4 pb-2">
                                <CardTitle className="text-sm sm:text-lg line-clamp-1">{audiobook.title}</CardTitle>
                                <div className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">
                                    By {typeof audiobook.authorId === 'object' ? audiobook.authorId?.name : "Unknown"}
                                </div>
                            </CardHeader>
                            <CardContent className="flex gap-2 visible sm:invisible group-hover:visible absolute top-2 right-2 sm:top-4 sm:right-4 bg-background p-1 rounded-md shadow-sm sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link to={`/dashboard/audiobooks/${audiobook._id}`}>
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {(!audiobooks || audiobooks.length === 0) && (
                        <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                            No audiobooks found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Audiobooks;
