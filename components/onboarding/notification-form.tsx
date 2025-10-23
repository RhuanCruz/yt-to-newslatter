"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Code, Rocket, Brain, Lightbulb, TrendingUp, Wrench } from "lucide-react";

interface NotificationFormProps {
  onSubmit: (type: "email" | "whatsapp", value: string, contentTypes: string[]) => void;
  isLoading?: boolean;
}

// Content categories available
const CONTENT_CATEGORIES = [
  { id: "tech", label: "Technology", icon: Code },
  { id: "business", label: "Business", icon: TrendingUp },
  { id: "education", label: "Education", icon: Brain },
  { id: "productivity", label: "Productivity", icon: Rocket },
  { id: "science", label: "Science", icon: Lightbulb },
  { id: "diy", label: "DIY & Tutorials", icon: Wrench },
];

export function NotificationForm({ onSubmit, isLoading }: NotificationFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<"email" | "whatsapp">("email");
  const [value, setValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const validateInput = (input: string, type: "email" | "whatsapp"): boolean => {
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input);
    } else {
      // WhatsApp: at least 10 digits (can have +, spaces, hyphens, parentheses)
      const cleanNumber = input.replace(/[\s\-\(\)]/g, "");
      const whatsappRegex = /^\+?\d{10,}$/;
      return whatsappRegex.test(cleanNumber);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!value.trim()) {
      setError(`Please enter your ${selectedType === "email" ? "email" : "WhatsApp number"}`);
      return;
    }

    if (!validateInput(value.trim(), selectedType)) {
      setError(`Please enter a valid ${selectedType === "email" ? "email address" : "WhatsApp number"}`);
      return;
    }

    // Trigger fade out
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackStep = () => {
    setError("");
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      setError("Please select at least one content type");
      return;
    }

    onSubmit(selectedType, value.trim(), selectedCategories);
  };

  if (step === 2) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-3xl space-y-8 transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 translate-x-8"
            : "opacity-100 translate-x-0"
        }`}
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">Step 2 of 2</Badge>
        </div>

        {/* Interactive Sentence for Content Types */}
        <div className="text-center space-y-2">
          <p className="text-lg md:text-xl text-muted-foreground">
            What type of content interests you?
          </p>
          <p className="text-sm text-muted-foreground">
            Select one or more topics
          </p>
        </div>

        {/* Content Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CONTENT_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategories.includes(category.id);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`
                  flex flex-col items-center gap-3 p-4 rounded-xl transition-all shadow-[0px_2px_0px_0px_#FFFFFF40_inset]
                  ${isSelected
                    ? 'border-primary bg-primary shadow-[0px_2px_0px_0px_#FFFFFF40_inset]'
                    : 'border-border hover:border-primary/50 hover:bg-accent shadow-[0px_2px_0px_0px_#FFFFFF40_inset]'
                  }
                `}
                disabled={isLoading}
              >
                <Icon className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleBackStep}
            className="flex-1"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading || selectedCategories.length === 0}
            size="lg"
          >
            {isLoading ? "Saving..." : "Complete"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleNextStep}
      className={`w-full max-w-2xl space-y-8 transition-all duration-300 ${
        isTransitioning
          ? "opacity-0 -translate-x-8"
          : "opacity-100 translate-x-0"
      }`}
    >
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">Step 1 of 2</Badge>
      </div>

      {/* Interactive Sentence */}
      <div className="text-center">
        <p className="text-lg md:text-xl text-muted-foreground inline-flex flex-wrap items-center justify-center gap-2">
          <span>Choose</span>
          <Button
            type="button"
            variant={selectedType === "email" ? "default" : "outline"}
            size={selectedType === "email" ? "lg" : "sm"}
            onClick={() => {
              setSelectedType("email");
              setValue("");
              setError("");
            }}
            className="gap-1.5 font-medium shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
            disabled={isLoading}
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <span>or</span>
          <Button
            type="button"
            variant={selectedType === "whatsapp" ? "default" : "outline"}
            size={selectedType === "whatsapp" ? "lg" : "sm"}
            onClick={() => {
              setSelectedType("whatsapp");
              setValue("");
              setError("");
            }}
            className="gap-1.5 font-medium shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
            disabled={isLoading}
          >
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </Button>
          <span>to receive summaries.</span>
        </p>
      </div>

      {/* Input Field */}
      <div className="space-y-2">
        <div className="relative">
          {selectedType === "email" ? (
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          ) : (
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          )}
          <Input
            id="notification"
            type={selectedType === "email" ? "email" : "tel"}
            placeholder={
              selectedType === "email"
                ? "your@email.com"
                : "+55 11 99999-9999"
            }
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            className="pl-10 h-12 text-base"
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>

     <div className="flex justify-end items-center">
       <Button
        type="submit"
        className="w-fit gap-2 cursor-pointer"
        disabled={isLoading}
        size="lg"
      >
        Next
      </Button>
     </div>
    </form>
  );
}
