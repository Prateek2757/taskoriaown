// "use client";

// import { useState } from "react";

// export default function CheckoutButton() {
//   const [loading, setLoading] = useState(false);

//   const handlePay = async () => {
//     setLoading(true);

//     const res = await fetch("/api/stripecheckout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         amount: 20,         // $20
//         productName: "Premium Plan",
//       }),
//     });

//     const data = await res.json();
//     window.location.href = data.url; // Redirect to Stripe
//   };

//   return (
//     <button
//       onClick={handlePay}
//       disabled={loading}
//       className="px-4 py-2 bg-black text-white rounded-lg"
//     >
//       {loading ? "Processing..." : "Pay $20"}
//     </button>
//   );
// }