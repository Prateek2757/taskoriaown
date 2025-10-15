import { getDictionary } from "@/app/[lang]/(public)/dictionaries";
import { CheckCircle } from "lucide-react";

async function SuccessAndFailure({
	params,
}: {
	params: Promise<{ lang: "en" | "ne" }>;
}) {
	const { lang } = await params;
	const dict = await getDictionary(lang);
	return (
		<div>
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
							<h1 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in-up">
								{dict.proposal.proposal_submitted}
							</h1>
							<p className="text-gray-600 animate-fade-in-up delay-200">
								{dict.proposal.sumission_success}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SuccessAndFailure;
