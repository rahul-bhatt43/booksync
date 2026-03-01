import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAuthors, createAuthor,
    getCategories, createCategory,
    getNarrators, createNarrator,
    createAudiobook, updateAudiobook, type Audiobook
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, UploadCloud, Image as ImageIcon, Plus } from "lucide-react";

interface AudiobookFormProps {
    initialData?: Audiobook;
    isEditing?: boolean;
}

export const AudiobookForm: React.FC<AudiobookFormProps> = ({ initialData, isEditing }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [categoryId, setCategoryId] = useState<string>(
        typeof initialData?.categoryId === 'object' ? initialData.categoryId._id : (initialData?.categoryId || "")
    );
    const [authorId, setAuthorId] = useState<string>(
        typeof initialData?.authorId === 'object' ? initialData.authorId._id : (initialData?.authorId || "")
    );
    const [narratorId, setNarratorId] = useState<string>(
        typeof initialData?.narratorId === 'object' ? initialData.narratorId._id : (initialData?.narratorId || "")
    );

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    // Queries
    const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
    const { data: authors } = useQuery({ queryKey: ["authors"], queryFn: getAuthors });
    const { data: narrators } = useQuery({ queryKey: ["narrators"], queryFn: getNarrators });

    // Creation Modals state
    const [modalOpen, setModalOpen] = useState<'category' | 'author' | 'narrator' | null>(null);
    const [modalInputValue, setModalInputValue] = useState("");
    const [modalDescValue, setModalDescValue] = useState("");

    const handleSelectChange = (val: string, type: 'category' | 'author' | 'narrator') => {
        if (val === "create_new") {
            setModalOpen(type);
            setModalInputValue("");
            setModalDescValue("");
            return;
        }
        if (type === 'category') setCategoryId(val);
        if (type === 'author') setAuthorId(val);
        if (type === 'narrator') setNarratorId(val);
    };

    const createEntityMutation = useMutation({
        mutationFn: async ({ type, name, description }: any) => {
            if (type === 'category') return createCategory({ name, description });
            if (type === 'author') return createAuthor({ name, biography: description });
            if (type === 'narrator') return createNarrator({ name, biography: description });
        },
        onSuccess: (data: any, variables: any) => {
            queryClient.invalidateQueries({ queryKey: [variables.type === 'category' ? 'categories' : variables.type + 's'] });

            // Auto-select the newly created entity
            if (variables.type === 'category') setCategoryId(data._id);
            if (variables.type === 'author') setAuthorId(data._id);
            if (variables.type === 'narrator') setNarratorId(data._id);

            setModalOpen(null);
        }
    });

    const saveMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("categoryId", categoryId);
            formData.append("authorId", authorId);
            formData.append("narratorId", narratorId);

            if (coverImage) formData.append("coverImage", coverImage);
            if (audioFile) formData.append("audioFile", audioFile);

            if (isEditing && initialData?._id) {
                return updateAudiobook(initialData._id, formData);
            }
            return createAudiobook(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["audiobooks"] });
            navigate("/dashboard/audiobooks");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId || !authorId || !narratorId) {
            alert("Please select category, author, and narrator");
            return;
        }
        if (!isEditing && (!audioFile || !coverImage)) {
            alert("Please upload both cover image and audio file");
            return;
        }
        saveMutation.mutate();
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in-50 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? "Edit Audiobook" : "Create New Audiobook"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 rounded-xl border shadow-sm">

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Details</h3>
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Audiobook Title" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Summary of the audiobook..." className="h-24" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Relations</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={categoryId} onValueChange={(val) => handleSelectChange(val, 'category')}>
                                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {categories?.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectItem value="create_new" className="text-primary font-medium cursor-pointer">
                                        <Plus className="h-4 w-4 inline mr-2" />Create New Category
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Author</Label>
                            <Select value={authorId} onValueChange={(val) => handleSelectChange(val, 'author')}>
                                <SelectTrigger><SelectValue placeholder="Select Author" /></SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {authors?.map(a => <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>)}
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectItem value="create_new" className="text-primary font-medium cursor-pointer">
                                        <Plus className="h-4 w-4 inline mr-2" />Create New Author
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Narrator</Label>
                            <Select value={narratorId} onValueChange={(val) => handleSelectChange(val, 'narrator')}>
                                <SelectTrigger><SelectValue placeholder="Select Narrator" /></SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {narrators?.map(n => <SelectItem key={n._id} value={n._id}>{n.name}</SelectItem>)}
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectItem value="create_new" className="text-primary font-medium cursor-pointer">
                                        <Plus className="h-4 w-4 inline mr-2" />Create New Narrator
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Media Files</h3>
                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Cover Image Upload */}
                        <div className="space-y-2">
                            <Label>Cover Image</Label>
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-primary/50 transition-colors bg-muted/50">
                                <div className="space-y-1 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <div className="flex text-sm text-muted-foreground justify-center">
                                        <label htmlFor="cover-upload" className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary/80 px-2 py-1 focus-within:outline-none ring-offset-background">
                                            <span>Upload a file</span>
                                            <input id="cover-upload" name="cover-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {coverImage ? coverImage.name : (initialData?.coverImageUrl ? "Change existing image" : "PNG, JPG up to 10MB")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Audio File Upload */}
                        <div className="space-y-2">
                            <Label>Audio File</Label>
                            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-primary/50 transition-colors bg-muted/50">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <div className="flex text-sm text-muted-foreground justify-center">
                                        <label htmlFor="audio-upload" className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary/80 px-2 py-1 focus-within:outline-none ring-offset-background">
                                            <span>Upload audio file</span>
                                            <input id="audio-upload" name="audio-upload" type="file" className="sr-only" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {audioFile ? audioFile.name : (initialData?.audioUrl ? "Change existing audio" : "MP3, WAV up to 100MB")}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex justify-end pt-6 gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" disabled={saveMutation.isPending}>
                        {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? "Save Changes" : "Create Audiobook"}
                    </Button>
                </div>
            </form>

            {/* Inline Creation Modal */}
            <Dialog open={!!modalOpen} onOpenChange={(open) => !open && setModalOpen(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New {modalOpen?.charAt(0).toUpperCase()}{modalOpen?.slice(1)}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={modalInputValue} onChange={(e) => setModalInputValue(e.target.value)} placeholder="Name..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Description / Bio</Label>
                            <Textarea value={modalDescValue} onChange={(e) => setModalDescValue(e.target.value)} placeholder="Details..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOpen(null)}>Cancel</Button>
                        <Button
                            disabled={!modalInputValue || createEntityMutation.isPending}
                            onClick={() => createEntityMutation.mutate({ type: modalOpen, name: modalInputValue, description: modalDescValue })}
                        >
                            {createEntityMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
