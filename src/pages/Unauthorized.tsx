import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-8 relative z-10"
      >
        <div className="relative mx-auto w-24 h-24 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center ring-8 ring-background"
          >
            <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-500" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold tracking-tight text-foreground"
          >
            Access Denied
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg leading-relaxed px-4"
          >
            You don't have the necessary permissions to view this page. Please contact your administrator if you believe this is a mistake.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto gap-2 min-w-[140px] border-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto gap-2 min-w-[140px] shadow-lg hover:shadow-xl transition-all"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
