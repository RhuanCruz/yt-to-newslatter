"use client";

import { AppHeader } from "./app-header";

interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  inputPlaceholder: string;
  onInputSubmit: (value: string) => void;
}

export function AppShell({
  children,
  userName,
  userEmail,
  userImage,
  inputPlaceholder,
  onInputSubmit,
}: AppShellProps) {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        inputPlaceholder={inputPlaceholder}
        onInputSubmit={onInputSubmit}
      />
      <main className="flex-1 container mx-auto px-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
