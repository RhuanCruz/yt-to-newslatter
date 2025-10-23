"use client";

import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface Channel {
  id: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

interface ChannelHorizontalCardProps {
  channel: Channel;
  onSeeSummaries: () => void;
}

export function ChannelHorizontalCard({
  channel,
  onSeeSummaries,
}: ChannelHorizontalCardProps) {
  return (
    <Card className="max-w-full py-0 sm:flex-row sm:gap-0 hover:shadow-lg transition-shadow duration-300 bg-background hover:bg-muted/50 ">
      <CardContent className="grow-0 px-0 sm:w-48">
        {channel.thumbnailUrl ? (
          <div className="relative w-full h-full min-h-[200px] sm:min-h-full">
            <Image
              src={channel.thumbnailUrl}
              alt={channel.channelName}
              fill
              className="object-cover rounded-l-xl"
            />
          </div>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-l-xl ">
            <PlayCircle className="h-16 w-16 text-white/80" />
          </div>
        )}
      </CardContent>
      <div className="sm:min-w-64 flex-1">
        <CardHeader className="pt-6">
          <CardTitle className="text-2xl">{channel.channelName}</CardTitle>
          <CardDescription className="text-base">
            {channel.description ||
              "Transform this YouTube channel into personalized newsletter summaries delivered to your inbox."}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-3 py-6">
          <Button
            onClick={onSeeSummaries}
            variant={'default'}
          >
            See Summaries
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
