"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { format } from "date-fns";

interface SummaryCardProps {
  summary: {
    id: string;
    videoTitle: string;
    publishedAt: Date;
    isRead: boolean;
    summaryContent: string;
    thumbnailUrl?: string;
  };
  userId: string;
  onReadStatusChange?: () => void;
}

export function SummaryCard({
  summary,
  userId,
  onReadStatusChange,
}: SummaryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRead, setIsRead] = useState(summary.isRead);

  const handleOpenSheet = async () => {
    setIsOpen(true);

    // Mark as read when opening
    if (!isRead) {
      try {
        // TODO: Create API route to mark summary as read
        // await fetch(`/api/summaries/${summary.id}/read`, { method: 'PATCH' })

        // Mock: Just update local state
        setIsRead(true);
        onReadStatusChange?.();
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  return (
    <>
      <Card
        className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
        onClick={handleOpenSheet}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-2 mb-2">
                {summary.videoTitle}
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <time dateTime={summary.publishedAt.toISOString()}>
                  {format(new Date(summary.publishedAt), "dd/MM/yyyy")}
                </time>
                {isRead && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Read
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-6">
          <SheetHeader className="space-y-4">
            <SheetTitle className="text-2xl">{summary.videoTitle}</SheetTitle>
            <SheetDescription>
              Published on {format(new Date(summary.publishedAt), "MMMM dd, yyyy")}
            </SheetDescription>
          </SheetHeader>

          {summary.thumbnailUrl && (
            <div className="my-6 rounded-lg overflow-hidden bg-muted">
              <img
                src={summary.thumbnailUrl}
                alt={summary.videoTitle}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          <div className="mt-6 prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground">
              {summary.summaryContent}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
