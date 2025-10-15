"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";

export type ToastType = "100" | "101" | "102" | "103";

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	title?: string;
	duration?: number;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
	showToast: (
		type: ToastType,
		message: string,
		title?: string,
		duration?: number,
	) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

const toastConfig = {
	100: {
		icon: CheckCircle,
		className:
			"border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
	},
	101: {
		icon: AlertCircle,
		className:
			"border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
	},
	102: {
		icon: AlertTriangle,
		className:
			"border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
	},
	103: {
		icon: Info,
		className:
			"border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
	},
};

interface ToastItemProps {
	toast: Toast;
	onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
	const config = toastConfig[toast.type];
	if(!config){
		return null;
	}
	const IconComponent = config.icon;	

	return (
		<div
			className={cn(
				"pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all transform translate-x-0 opacity-100",
				config.className,
				"animate-in slide-in-from-right-full duration-300",
			)}
		>
			<div className="p-4">
				<div className="flex items-start">
					<div className="flex-shrink-0">
						<IconComponent className="h-5 w-5" />
					</div>
					<div className="ml-3 w-0 flex-1">
						{toast.title && (
							<p className="text-sm font-medium">{toast.title}</p>
						)}
						<p className={cn("text-sm", toast.title ? "mt-1" : "")}>
							{toast.message}
						</p>
					</div>
					<div className="ml-4 flex-shrink-0 flex">
						<Button
							variant={"ghost"}
							className="cursor-pointer rounded-md inline-flex hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current p-1"
							onClick={() => onRemove(toast.id)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

interface ToastProviderProps {
	children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const addToast = useCallback(
		(toast: Omit<Toast, "id">) => {
			const id = Math.random().toString(36).substr(2, 9);
			const newToast = { ...toast, id };

			setToasts((prev) => [...prev, newToast]);

			// Auto remove toast after duration
			const duration = toast.duration ?? 5000;
			if (duration > 0) {
				setTimeout(() => {
					removeToast(id);
				}, duration);
			}
		},
		[removeToast],
	);

	const showToast = useCallback(
		(type: ToastType, message: string, title?: string, duration?: number) => {
			addToast({ type, message, title, duration });
		},
		[addToast],
	);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast, showToast }}>
			{children}

			{/* Toast Container */}
			<div
				aria-live="assertive"
				className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[99999999999]"
			>
				<div className="flex w-full flex-col items-center space-y-4 sm:items-end">
					{toasts.map((toast) => (
						<ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
					))}
				</div>
			</div>
		</ToastContext.Provider>
	);
}
