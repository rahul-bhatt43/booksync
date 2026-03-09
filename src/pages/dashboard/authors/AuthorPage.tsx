import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const AuthorPage: React.FC = () => {
    const { authorId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = authorId && authorId !== "create";
 
    const [name, setName] = useState("");
    const [biography, setBiography] = useState("");

    const { data: authors, isLoading: isFetching } = useQuery({
        queryKey: ["authors"],
        queryFn: getAuthors,
        enabled: isEditing,
    });

    useEffect(() => {
        if (isEditing && authors) {
            const auth = authors.find((a) => a._id === authorId);
            if (auth) {
                setName(auth.name);
                setBiography(auth.biography || "");
            }
        }
    }, [isEditing, authors, authorId]);

    const saveMutation = useMutation({
        mutationFn: async (payload: { name: string; biography: string }) => {
            if (isEditing) {
                return updateAuthor(authorId as string, payload);
            }
            return createAuthor(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
            navigate("/dashboard/authors");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (isEditing) return deleteAuthor(authorId as string);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
            navigate("/dashboard/authors");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate({ name, biography });
    };

    if (isFetching) {
        return (
            <div className="max-w-2xl mx-auto p-8 space-y-8 animate-in fade-in-50">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? "Edit Author" : "Create Author"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Isaac Asimov"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="biography">Bio</Label>
                    <Textarea
                        id="biography"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        placeholder="Brief biography"
                        className="h-32"
                    />
                </div>

                <div className="flex items-center justify-between pt-4">
                    {isEditing ? (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Author
                        </Button>
                    ) : (
                        <div></div>
                    )}

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/dashboard/authors")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saveMutation.isPending}>
                            {saveMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEditing ? "Save Changes" : "Create"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AuthorPage;
