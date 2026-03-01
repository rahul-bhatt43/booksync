import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAudiobook } from "@/services/api";
import { AudiobookForm } from "./AudiobookForm";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const AudiobookPage: React.FC = () => {
    const { audiobookId } = useParams();

    const { data: audiobook, isLoading } = useQuery({
        queryKey: ["audiobooks", audiobookId],
        queryFn: () => getAudiobook(audiobookId as string),
        enabled: !!audiobookId,
    });

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in-50">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                            <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!audiobook) {
        return <div className="p-8 text-center text-muted-foreground">Audiobook not found</div>;
    }

    return <AudiobookForm isEditing={true} initialData={audiobook} />;
};

export default AudiobookPage;
