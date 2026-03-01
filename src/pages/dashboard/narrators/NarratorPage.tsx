import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNarrators, createNarrator, updateNarrator, deleteNarrator } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const NarratorPage: React.FC = () => {
    const { narratorId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = narratorId && narratorId !== "create";

    const [name, setName] = useState("");
    const [biography, setBiography] = useState("");

    const { data: narrators, isLoading: isFetching } = useQuery({
        queryKey: ["narrators"],
        queryFn: getNarrators,
        enabled: isEditing,
    });

    useEffect(() => {
        if (isEditing && narrators) {
            const nar = narrators.find((n) => n._id === narratorId);
            if (nar) {
                setName(nar.name);
                setBiography(nar.biography || "");
            }
        }
    }, [isEditing, narrators, narratorId]);

    const saveMutation = useMutation({
        mutationFn: async (payload: { name: string; biography: string }) => {
            if (isEditing) {
                return updateNarrator(narratorId as string, payload);
            }
            return createNarrator(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["narrators"] });
            navigate("/dashboard/narrators");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (isEditing) return deleteNarrator(narratorId as string);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["narrators"] });
            navigate("/dashboard/narrators");
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
                    {isEditing ? "Edit Narrator" : "Create Narrator"}
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
                        placeholder="e.g. Ray Porter"
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
                            Delete Narrator
                        </Button>
                    ) : (
                        <div></div>
                    )}

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/dashboard/narrators")}
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

export default NarratorPage;
