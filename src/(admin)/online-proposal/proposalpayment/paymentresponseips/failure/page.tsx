"use client";
import { XCircle } from "lucide-react";

export default function Page() {
	return (
		<div className="flex items-center justify-center mt-8">
			<div className="relative z-10 max-w-md w-full">
				<div className="p-8 text-center">
					<div className="relative mb-6">
						<div className="w-24 h-24 mx-auto relative">
							<svg
								className="w-24 h-24 absolute inset-0 animate-spin-slow"
								viewBox="0 0 100 100"
							>
								<title>Failure Animation Circle</title>
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke="url(#failureGradient)"
									strokeWidth="2"
									strokeDasharray="280"
									strokeDashoffset="280"
									className="animate-draw-circle-error"
								/>
								<defs>
									<linearGradient
										id="failureGradient"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="100%"
									>
										<stop offset="0%" stopColor="#ef4444" />
										<stop offset="100%" stopColor="#dc2626" />
									</linearGradient>
								</defs>
							</svg>

							<div className="absolute inset-0 flex items-center justify-center">
								<XCircle className="w-16 h-16 text-red-500 animate-shake" />
							</div>
						</div>

						<div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-pulse" />
						<div className="absolute -bottom-2 -left-2 w-3 h-3 bg-rose-400 rounded-full animate-pulse delay-500" />
						<div className="absolute top-1/2 -left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-1000" />
					</div>

					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in-up">
							Payment Failed
						</h1>
						<p className="text-gray-600 animate-fade-in-up delay-200">
							We couldn't process your payment. Don't worry, no charges were
							made to your account.
						</p>
					</div>
				</div>
			</div>

			<style jsx>{`
             @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes draw-circle-error {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
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
        .animate-draw-circle-error {
          animation: draw-circle-error 2s ease-in-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.8s ease-in-out 0.5s both;
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
        
        .delay-600 {
          animation-delay: 0.6s;
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
