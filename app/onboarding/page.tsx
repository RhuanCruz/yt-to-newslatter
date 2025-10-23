"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationForm } from "@/components/onboarding/notification-form";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (
    type: "email" | "whatsapp",
    value: string,
    contentTypes: string[]
  ) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to continue");
      router.push("/auth");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Create API route to save notification preference and content types
      // await fetch('/api/notifications', {
      //   method: 'POST',
      //   body: JSON.stringify({ type, value, contentTypes })
      // })

      // Mock: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Preferences saved:", { type, value, contentTypes });
      toast.success("Preferences saved successfully!");

      // Redirect to home after successful save
      router.push("/home");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2 mb-8">
          <p className="text-muted-foreground">Let's personalize your experience</p>
        </div>
        <NotificationForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
