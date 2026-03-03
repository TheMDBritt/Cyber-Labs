import type { ReactNode } from "react";

export const metadata = {
  title: "LLM Dojo Chatbox",
  description: "Safe sandbox for AI attack/defense practice"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, Arial, sans-serif", background: "#0b1020", color: "#e5e7eb" }}>
        {children}
      </body>
    </html>
  );
}
