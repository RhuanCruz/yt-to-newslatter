"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartIcon, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface Channel {
  id: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

interface ChannelCarouselCardProps {
  channel: Channel;
  onSeeSummaries: () => void;
}

export function ChannelCarouselCard({
  channel,
  onSeeSummaries,
}: ChannelCarouselCardProps) {
  const [liked, setLiked] = useState<boolean>(false);

  return (
    <div className="relative max-w-md w-full rounded-xl bg-gradient-to-br from-neutral-600 via-violet-400 to-violet-300 pt-0 shadow-xl p-4">
      <div className="flex h-60 items-center justify-center p-4">
        {channel.thumbnailUrl ? (
          <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl">
            <Image
              src={channel.thumbnailUrl}
              alt={channel.channelName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-48 w-48 items-center justify-center rounded-full bg-muted">
            <PlayCircle className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
      </div>
      <Button
        size="icon"
        onClick={() => setLiked(!liked)}
        className="bg-primary/10 hover:bg-primary/20 absolute top-4 right-4 rounded-full backdrop-blur-sm"
      >
        <HeartIcon
          className={cn(
            "size-4",
            liked ? "fill-destructive stroke-destructive" : "stroke-white"
          )}
        />
        <span className="sr-only">Like</span>
      </Button>
      <Card className="border-none rounded-t-none">
        <CardHeader>
          <CardTitle className="text-2xl">{channel.channelName}</CardTitle>
          <CardDescription className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">YouTube</Badge>
            <Badge variant="outline">Subscribed</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-muted-foreground">
            {channel.description ||
              "Transform this YouTube channel into personalized newsletter summaries."}
          </p>
        </CardContent>
        <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase text-muted-foreground">
              Channel
            </span>
            <span className="text-lg font-semibold">@{channel.channelId}</span>
          </div>
          <Button size="lg" onClick={onSeeSummaries}>
            See Summaries
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
