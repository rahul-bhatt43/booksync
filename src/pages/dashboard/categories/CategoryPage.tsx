import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const CategoryPage: React.FC = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = categoryId && categoryId !== "create";

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { data: categories, isLoading: isFetching } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        enabled: isEditing,
    });

    useEffect(() => {
        if (isEditing && categories) {
            const cat = categories.find((c) => c._id === categoryId);
            if (cat) {
                setName(cat.name);
                setDescription(cat.description);
            }
        }
    }, [isEditing, categories, categoryId]);

    const saveMutation = useMutation({
        mutationFn: async (payload: { name: string; description: string }) => {
            if (isEditing) {
                return updateCategory(categoryId as string, payload);
            }
            return createCategory(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            navigate("/dashboard/categories");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (isEditing) return deleteCategory(categoryId as string);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            navigate("/dashboard/categories");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate({ name, description });
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
                    {isEditing ? "Edit Category" : "Create Category"}
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
                        placeholder="e.g. Science Fiction"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Brief description about the category"
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
                            Delete Category
                        </Button>
                    ) : (
                        <div></div> // spacer
                    )}

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/dashboard/categories")}
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

export default CategoryPage;
