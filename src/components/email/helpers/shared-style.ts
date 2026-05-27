/**
 * shared-style.ts
 *
 * CRITICAL INSIGHT (explains all padding failures):
 *   <Section> → renders as <table>   — padding on a <table> is IGNORED everywhere
 *   <Row>     → renders as <tr>      — no padding target
 *   <Column>  → renders as <td>      — padding IS honoured in all clients ✓
 *
 * Rule: NEVER put padding on <Section>. Always put it on <Column>.
 * Background-color on <Section> (table) is fine — that does work.
 */

import type { CSSProperties } from "react";

// ─── Brand tokens ──────────────────────────────────────────────────────────────
export const PRIMARY        = "#2563EB";
export const PRIMARY_DARK   = "#1d4ed8";
export const PRIMARY_LIGHT  = "#eff6ff";
export const PRIMARY_BORDER = "#bfdbfe";


export const body: CSSProperties = {
  backgroundColor: "#eef0f3",
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: 0,
  padding: 0,
};

 export const hero: React.CSSProperties = {
    background: "linear-gradient(135deg, #0f1d47 0%, #162d78 55%, #1a3799 100%)",
    padding: "36px 40px 40px",
    textAlign: "center",
  };

export const outerWrapperCol: CSSProperties = {
  padding: "32px 16px",
};

export const container: CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  borderTop: "1px solid #d4d8de",
  borderRight: "1px solid #d4d8de",
  borderBottom: "1px solid #d4d8de",
  borderLeft: "1px solid #d4d8de",
};


export const heroSection: CSSProperties = {
  backgroundColor: "#162d78",
  background: "linear-gradient(135deg, #0f1d47 0%, #162d78 55%, #1a3799 100%)",
  borderRadius: "12px 12px 0 0",
};

export const heroCol: CSSProperties = {
  padding: "36px 40px 40px",
  textAlign: "center",
};

export const eyebrow: CSSProperties = {
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#a0b4d6",
  margin: "0 0 10px",
};

export const heroHeading: CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 8px",
  lineHeight: "1.3",
};

export const heroSub: CSSProperties = {
  fontSize: "13px",
  color: "#a0b4d6",
  margin: 0,
  lineHeight: "1.5",
};


export const bodyCol: CSSProperties = {
  padding: "32px 40px 28px",
};

export const intro: CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#3d4654",
  margin: "0 0 24px",
};

export const ctaButton: CSSProperties = {
  backgroundColor: PRIMARY,
  color: "#ffffff",
  padding: "13px 36px",
  fontSize: "15px",
  fontWeight: "bold",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  msoPaddingAlt: "13px 36px",
};


export const divider: CSSProperties = {
  borderTop: "1px solid #e8eaf0",
  borderRight: 0,
  borderBottom: 0,
  borderLeft: 0,
  margin: "4px 0 20px",
};


export const signOff: CSSProperties = {
  fontSize: "14px",
  color: "#5a6070",
  lineHeight: "1.6",
  margin: "0 0 4px",
};

export const sigName: CSSProperties = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#1a2236",
  margin: "2px 0",
};

export const sigRole: CSSProperties = {
  fontSize: "12px",
  color: "#9aa0aa",
  margin: 0,
};

export const footerSection: CSSProperties = {
  backgroundColor: PRIMARY_LIGHT,
  borderTop: "1px solid #bfdbfe",
  borderRadius: "0 0 12px 12px",
};

export const footerCol: CSSProperties = {
  padding: "16px 40px",
  textAlign: "center",
};

 export const footer: React.CSSProperties = {
    backgroundColor: PRIMARY_LIGHT,
    borderTop: `1px solid ${PRIMARY_BORDER}`,
    padding: "16px 40px",
    textAlign: "center",
  };

export const footerText: CSSProperties = {
  fontSize: "11px",
  color: "#9aa0aa",
  margin: "0 0 6px",
};

export const footerLink: CSSProperties = {
  color: PRIMARY,
  textDecoration: "none",
};