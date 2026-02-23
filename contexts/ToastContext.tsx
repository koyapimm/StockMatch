"use client";

import { useState, useCallback, useRef, useEffect, createContext, useContext, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 2500;
const EXIT_ANIMATION_MS = 250;

function ToastItem({
    toast,
    onRemove,
}: {
    toast: Toast;
    onRemove: (id: string) => void;
}) {
    const [isExiting, setIsExiting] = useState(false);
    const isClosingRef = useRef(false);

    const handleClose = useCallback(() => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), EXIT_ANIMATION_MS);
    }, [toast.id, onRemove]);

    useEffect(() => {
        const timer = setTimeout(handleClose, TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [handleClose]);

    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />;
            case "error":
                return <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />;
            case "info":
                return <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />;
        }
    };

    const getBgColor = () => {
        switch (toast.type) {
            case "success":
                return "bg-green-50 border-green-200";
            case "error":
                return "bg-red-50 border-red-200";
            case "info":
                return "bg-blue-50 border-blue-200";
        }
    };

    const getProgressColor = () => {
        switch (toast.type) {
            case "success":
                return "bg-green-500";
            case "error":
                return "bg-red-500";
            case "info":
                return "bg-blue-500";
        }
    };

    return (
        <div
            className={`relative overflow-hidden rounded-lg border px-4 py-3 shadow-lg ${getBgColor()}`}
            style={{
                animation: isExiting
                    ? "toast-slide-out 0.4s ease-in forwards"
                    : "toast-slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
        >
            <div className="flex items-center gap-3">
                {getIcon()}
                <span className="text-sm font-medium text-slate-800">{toast.message}</span>
                <button
                    onClick={handleClose}
                    className="ml-2 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-600"
                    aria-label="Kapat"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${getProgressColor()} opacity-50`}
                style={{
                    animation: "toast-progress-shrink 2.5s linear forwards",
                    transformOrigin: "left",
                }}
            />
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
