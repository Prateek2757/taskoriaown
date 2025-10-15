import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertMessage {
	type: AlertType | null;
	message: string;
}

interface GenericAlertProps {
	alertMessage: AlertMessage;
}

const alertConfig = {
	success: {
		icon: CheckCircle,
		className:
			"border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
	},
	error: {
		icon: AlertCircle,
		className:
			"border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
	},
	warning: {
		icon: AlertTriangle,
		className:
			"border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
	},
	info: {
		icon: Info,
		className:
			"border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
	},
};

function CustomAlert({ alertMessage }: GenericAlertProps) {
	if (!alertMessage.type || !alertMessage.message) {
		return null;
	}

	const config = alertConfig[alertMessage.type];
	const IconComponent = config.icon;

	return (
		<Alert className={cn(config.className)}>
			<IconComponent className="h-4 w-4" />
			<AlertDescription>{alertMessage.message}</AlertDescription>
		</Alert>
	);
}

export default CustomAlert;
