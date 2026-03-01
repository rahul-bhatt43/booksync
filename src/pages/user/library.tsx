import React from "react";
import { BookHeadphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const UserLibrary: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in-50 duration-500 pb-16 md:pb-0 h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">My Library</h1>
                <p className="text-muted-foreground">Your saved and purchased audiobooks.</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-2 border border-primary/20">
                    <BookHeadphones className="h-12 w-12 text-primary/60" />
                </div>
                <h2 className="text-xl font-bold">Your library is empty</h2>
                <p className="text-muted-foreground max-w-sm">
                    You haven't added any audiobooks to your library yet. Explore our catalog to find your next favorite story.
                </p>
                <div className="pt-4">
                    <Button asChild className="rounded-full px-8">
                        <Link to="/user">Explore Audiobooks</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserLibrary;
