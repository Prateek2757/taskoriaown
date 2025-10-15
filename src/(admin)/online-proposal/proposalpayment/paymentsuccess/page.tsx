"use client";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PaymentSuccessProps = {
	decodedData: {
		transaction_code: string;
		status: string;
		total_amount: string;
		transaction_uuid: string;
		product_code: string;
	};
};

export default function Page({ decodedData }: PaymentSuccessProps) {
	if (!decodedData) {
		return (
			<div className="flex items-center justify-center mt-8">
				<div className="relative z-10 max-w-md w-full">
					<div className="bg-white text-center p-8">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4" />
						<p className="text-gray-600">Loading payment details...</p>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="flex items-center justify-center mt-8">
			<div className="relative z-10 max-w-md w-full">
				<div className="bg-white text-center">
					<div className="relative mb-6">
						<div className="w-24 h-24 mx-auto relative">
							<svg
								className="w-24 h-24 absolute inset-0 animate-spin-slow"
								viewBox="0 0 100 100"
							>
								<title>Success Animation Circle</title>
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke="url(#successGradient)"
									strokeWidth="2"
									strokeDasharray="280"
									strokeDashoffset="280"
									className="animate-draw-circle"
								/>
								<defs>
									<linearGradient
										id="successGradient"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="100%"
									>
										<stop offset="0%" stopColor="#10b981" />
										<stop offset="100%" stopColor="#059669" />
									</linearGradient>
								</defs>
							</svg>

							<div className="absolute inset-0 flex items-center justify-center">
								<CheckCircle className="w-16 h-16 text-green-500 animate-bounce-in" />
							</div>
						</div>

						<div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
						<div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-ping delay-500" />
						<div className="absolute top-1/2 -right-4 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-1000" />
					</div>

					<div className="mb-8">
						<h1 className="text-3xl font30000000000004-bold text-gray-800 mb-2 animate-fade-in-up">
							Payment Successful!
						</h1>
						<p className="text-gray-600 animate-fade-in-up delay-200">
							Thank you for your payment. Your transaction has been completed
							successfully.
						</p>
					</div>
					<div className="bg-gray-50 rounded-2xl p-4 mb-6 animate-fade-in-up delay-300">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm text-gray-600">Transaction ID</span>
							<span className="text-sm font-mono text-gray-800">
								{decodedData.transaction_code}
							</span>
						</div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm text-gray-600">Amount</span>
							<span className="text-lg font-bold text-green-600">
								{decodedData.total_amount}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600">Product Code</span>
							<span className="text-sm text-gray-800">
								{decodedData.product_code}
							</span>
						</div>
					</div>
					<div className="space-y-3 animate-fade-in-up delay-400">
						<Button className="cursor-pointer w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
							<Download className="w-5 h-5 group-hover:animate-bounce" />
							Download Receipt
						</Button>
					</div>
				</div>
			</div>

			<style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-draw-circle {
          animation: draw-circle 2s ease-in-out forwards;
        }
        
        .animate-bounce-in {
          animation: bounce-in 1s ease-out 0.5s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
		</div>
	);
}
