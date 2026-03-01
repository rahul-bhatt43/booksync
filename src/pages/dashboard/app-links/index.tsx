import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppLinks, createAppLink, updateAppLink, deleteAppLink, type AppLink } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2, Link as LinkIcon } from "lucide-react";

export const AppLinks: React.FC = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<AppLink | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form State
    const [platform, setPlatform] = useState("android");
    const [url, setUrl] = useState("");
    const [isActive, setIsActive] = useState(true);

    const { data: appLinks, isLoading } = useQuery({
        queryKey: ["app-links"],
        queryFn: getAppLinks,
    });

    const createMutation = useMutation({
        mutationFn: createAppLink,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["app-links"] });
            toast({ title: "Success", description: "App link created successfully." });
            closeDialog();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.message || "Failed to create app link",
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<AppLink> }) =>
            updateAppLink(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["app-links"] });
            toast({ title: "Success", description: "App link updated successfully." });
            closeDialog();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.message || "Failed to update app link",
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAppLink,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["app-links"] });
            toast({ title: "Success", description: "App link deleted successfully." });
            closeDeleteDialog();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error?.message || "Failed to delete app link",
                variant: "destructive",
            });
        },
    });

    const openCreateDialog = () => {
        setEditingLink(null);
        setPlatform("android");
        setUrl("");
        setIsActive(true);
        setIsDialogOpen(true);
    };

    const openEditDialog = (link: AppLink) => {
        setEditingLink(link);
        setPlatform(link.platform);
        setUrl(link.url);
        setIsActive(link.isActive);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingLink(null);
    };

    const openDeleteDialog = (id: string) => {
        setDeletingId(id);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setDeletingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!platform || !url) {
            toast({ title: "Validation Error", description: "Platform and URL are required", variant: "destructive" });
            return;
        }

        const payload = { platform, url, isActive };

        if (editingLink) {
            updateMutation.mutate({ id: editingLink._id, payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">App Links</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Manage deep links and download links for your mobile apps.</p>
                </div>
                <Button onClick={openCreateDialog} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add App Link
                </Button>
            </div>

            <div className="bg-background border rounded-md shadow-sm flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                            <TableRow>
                                <TableHead>Platform</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : appLinks?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No app links found. Create one.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                appLinks?.map((link) => (
                                    <TableRow key={link._id}>
                                        <TableCell className="font-medium capitalize">{link.platform}</TableCell>
                                        <TableCell>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                                <LinkIcon className="h-3 w-3" />
                                                <span className="truncate max-w-[150px] sm:max-w-[300px] inline-block">{link.url}</span>
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${link.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                {link.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(link)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => openDeleteDialog(link._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Create/Edit Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="w-[95vw] max-w-md rounded-xl sm:rounded-lg">
                    <DialogHeader>
                        <DialogTitle>{editingLink ? "Edit App Link" : "Create App Link"}</DialogTitle>
                        <DialogDescription>
                            {editingLink ? "Update the details for this app link." : "Add a new app link for users to download or open the app."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="platform">Platform</Label>
                            <Input
                                id="platform"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                placeholder="e.g. android, ios, web"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                type="url"
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="isActive"
                                checked={isActive}
                                onCheckedChange={setIsActive}
                            />
                            <Label htmlFor="isActive">Active</Label>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingLink ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
                <DialogContent className="w-[95vw] max-w-md rounded-xl sm:rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this app link? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeDeleteDialog} disabled={deleteMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => deletingId && deleteMutation.mutate(deletingId)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AppLinks;
