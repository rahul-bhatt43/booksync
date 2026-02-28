import React from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    description,
}) => {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Left Side - Hero/Branding */}
            <div className="hidden lg:flex flex-col justify-between p-10 bg-zinc-900 text-white relative overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-primary rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-600 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 flex items-center gap-2 font-medium text-lg">
                    <img src="/logo.png" alt="OrgIT Logo" className="h-8 w-auto" />
                    <span className="font-bold tracking-tight">OrgIT</span>
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <p className="text-2xl font-medium leading-relaxed">
                            &ldquo;OrgIT has completely transformed how we manage our organization structure and tasks. It's intuitive, powerful, and simply beautiful.&rdquo;
                        </p>
                        <footer className="text-sm text-zinc-400">
                            Sofia Davis, CEO at TechFlow
                        </footer>
                    </motion.blockquote>
                </div>

                <div className="relative z-10 text-sm text-zinc-400">
                    © {new Date().getFullYear()} OrgIT Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-4 md:p-8 bg-background">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]"
                >
                    <div className="flex flex-col space-y-2 text-center">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-4">
                            <img src="/logo.png" alt="OrgIT Logo" className="h-10 w-auto" />
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}

                </motion.div>
            </div>
        </div>
    );
};
