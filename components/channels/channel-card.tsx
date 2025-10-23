"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ChannelCardProps {
  channel: {
    id: string;
    channelName: string;
    thumbnailUrl?: string;
    description?: string;
  };
  onViewAll?: () => void;
  onSeeSummaries: () => void;
}

export function ChannelCard({
  channel,
  onViewAll,
  onSeeSummaries,
}: ChannelCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative bg-muted">
        {channel.thumbnailUrl ? (
          <Image
            src={channel.thumbnailUrl}
            alt={channel.channelName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No thumbnail
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-1">{channel.channelName}</h3>
          {channel.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {channel.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {onViewAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewAll}
              className="flex-1"
            >
              Ver Tudo
            </Button>
          )}
          <Button
            size="sm"
            onClick={onSeeSummaries}
            className="flex-1"
          >
            See Summaries
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
