import { Link, Outlet, useNavigate } from "react-router-dom";
import { BookHeadphones, LogOut, User as UserIcon, Settings, Home, Library } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground flex-col">
            {/* Top Header */}
            <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 font-bold text-primary">
                        <BookHeadphones className="h-6 w-6" />
                        <span className="hidden sm:inline-block">BookSync</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link to="/user" className="transition-colors hover:text-foreground/80 text-foreground">
                            Discover
                        </Link>
                        <Link to="/user/library" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            My Library
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="" alt="User avatar" />
                                    <AvatarFallback className="bg-primary/10 text-primary uppercase">
                                        {user?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/user/settings" className="w-full cursor-pointer flex items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col items-center">
                <div className="container max-w-7xl px-4 py-8 md:px-8 flex-1 w-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Navigation Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background px-6 py-3 flex justify-around items-center pb-safe">
                <Link to="/user" className="flex flex-col items-center gap-1 text-primary">
                    <Home className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Discover</span>
                </Link>
                <Link to="/user/library" className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Library className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Library</span>
                </Link>
            </div>
        </div>
    );
}
