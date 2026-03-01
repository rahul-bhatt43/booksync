import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookHeadphones, LayoutDashboard, User, LogOut, BookOpen, Mic2, Tag, Menu, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DashboardLayout: React.FC = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Audiobooks", href: "/dashboard/audiobooks", icon: BookHeadphones },
        { name: "Categories", href: "/dashboard/categories", icon: Tag },
        { name: "Authors", href: "/dashboard/authors", icon: BookOpen },
        { name: "Narrators", href: "/dashboard/narrators", icon: Mic2 },
    ];

    const generateInitials = (name: string) => {
        return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";
    };

    const NavLinks = ({ onClick }: { onClick?: () => void }) => (
        <div className="flex-1 py-6 space-y-2">
            {navItems.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClick}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-background flex-col md:flex">
                <div className="h-16 flex items-center px-6 border-b shrink-0">
                    <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <BookHeadphones className="w-6 h-6 text-primary" />
                        <span>BookSync Admin</span>
                    </Link>
                </div>
                <div className="flex-1 px-4 overflow-y-auto">
                    <NavLinks />
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex flex-col flex-1 w-full md:pl-64">
                {/* Common Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm shrink-0">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col w-72 p-0">
                            <div className="h-16 flex items-center px-6 border-b shrink-0">
                                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-bold text-xl">
                                    <BookHeadphones className="w-6 h-6 text-primary" />
                                    <span>BookSync Admin</span>
                                </Link>
                            </div>
                            <div className="flex-1 px-4 overflow-y-auto">
                                <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="w-full flex-1">
                        {/* Empty space or future search bar */}
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="" alt={user?.name || "User"} />
                                        <AvatarFallback className="bg-primary/10 text-primary">{generateInitials(user?.name || "")}</AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/user" className="cursor-pointer w-full flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>My Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-2 md:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-7xl animate-in fade-in-50 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
