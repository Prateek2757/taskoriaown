"use client";

import React from "react";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-2 py-3 shadow-sm">
      {children}
    </div>
  );
}

function IconPill({
  children,
  round = false,
}: {
  children: React.ReactNode;
  round?: boolean;
}) {
  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center bg-blue-50 ${
        round ? "rounded-full" : "rounded-lg"
      }`}
    >
      {children}
    </div>
  );
}

function AverageRatingCard() {
  return (
    <Card>
      <span className="text-[28px] text-blue-500">★</span>

      <div>
        <div className="text-xl font-semibold text-gray-900">4.8</div>
        <div className="text-xs text-gray-500">Average Rating</div>
      </div>
    </Card>
  );
}

function VerifiedBadgeCard() {
  return (
    <Card>
      <IconPill>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1D9E75"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </IconPill>

      <div>
        <div className="text-sm font-semibold text-gray-900">Verified</div>
        <div className="text-xs text-gray-500">Professionals</div>
      </div>
    </Card>
  );
}

function FreeQuotesCard() {
  return (
    <Card>
      <IconPill>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#378ADD"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </IconPill>

      <div>
        <div className="text-sm font-semibold text-gray-900">
          Free Quotes
        </div>
        <div className="text-xs text-gray-500">Fast & Easy</div>
      </div>
    </Card>
  );
}

export default function LocalProsFeature() {
  return (
    <section
      aria-label="Local professional service highlights"
      className=" px-2 py-8"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-stretch">
        {/* <AverageRatingCard /> */}
        <VerifiedBadgeCard />
        <FreeQuotesCard />
      </div>
    </section>
  );
}