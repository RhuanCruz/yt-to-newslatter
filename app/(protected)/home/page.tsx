"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ChannelHorizontalCard } from "@/components/channels/channel-horizontal-card";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface Channel {
  id: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

// Mock data for demonstration
const MOCK_CHANNELS: Channel[] = [
  {
    id: "1",
    channelId: "LinusTechTips",
    channelName: "Linus Tech Tips",
    channelUrl: "https://youtube.com/@LinusTechTips",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
    description: "We make entertaining videos about technology, including tech reviews, showcases and other content.",
  },
  {
    id: "2",
    channelId: "ElectroBOOM",
    channelName: "ElectroBOOM",
    channelUrl: "https://youtube.com/@ElectroBOOM",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    description: "Electricity and electronics tutorials, experiments, and comedy.",
  },
  {
    id: "3",
    channelId: "Fireship",
    channelName: "Fireship",
    channelUrl: "https://youtube.com/@Fireship",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop",
    description: "High-intensity code tutorials and tech news to help you ship your app faster.",
  },
  {
    id: "4",
    channelId: "Veritasium",
    channelName: "Veritasium",
    channelUrl: "https://youtube.com/@Veritasium",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
    description: "An element of truth - videos about science, education, and anything else.",
  },
  {
    id: "5",
    channelId: "MKBHD",
    channelName: "Marques Brownlee",
    channelUrl: "https://youtube.com/@MKBHD",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    description: "Quality tech videos, reviews, and commentary from MKBHD.",
  },
  {
    id: "6",
    channelId: "MKBHD",
    channelName: "Marques Brownlee",
    channelUrl: "https://youtube.com/@MKBHD",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    description: "Quality tech videos, reviews, and commentary from MKBHD.",
  },
  {
    id: "57",
    channelId: "MKBHD",
    channelName: "Marques Brownlee",
    channelUrl: "https://youtube.com/@MKBHD",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    description: "Quality tech videos, reviews, and commentary from MKBHD.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadChannels();
    }
  }, [session?.user?.id]);

  const loadChannels = async () => {
    if (!session?.user?.id) return;

    try {
      // TODO: Create API route to fetch user channels
      // const response = await fetch('/api/channels')
      // const data = await response.json()

      // Mock: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use mock data for now
      setChannels(MOCK_CHANNELS);
    } catch (error) {
      console.error("Error loading channels:", error);
      toast.error("Failed to load channels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChannel = async (channelUrl: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in");
      return;
    }

    try {
      // Mock: Extract channel ID from URL
      const channelId = extractChannelIdFromUrl(channelUrl);

      if (!channelId) {
        toast.error("Invalid YouTube channel URL");
        return;
      }

      // TODO: Create API route to add channel subscription
      // await fetch('/api/channels', { method: 'POST', body: JSON.stringify({ channelUrl }) })

      // Mock: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Add new channel to list
      const newChannel: Channel = {
        id: String(channels.length + 1),
        channelId,
        channelName: "New Sample Channel",
        channelUrl,
        thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop",
        description: "This is a newly added channel",
      };

      setChannels([...channels, newChannel]);
      toast.success("Channel added successfully!");
    } catch (error) {
      console.error("Error adding channel:", error);
      toast.error("Failed to add channel");
    }
  };

  const handleSeeSummaries = (channelId: string) => {
    router.push(`/channel/${channelId}`);
  };

  // Simple URL parser (mock - replace with proper YouTube API)
  const extractChannelIdFromUrl = (url: string): string | null => {
    try {
      const patterns = [
        /youtube\.com\/channel\/([\w-]+)/,
        /youtube\.com\/@([\w-]+)/,
        /youtube\.com\/c\/([\w-]+)/,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }

      return null;
    } catch {
      return null;
    }
  };


  if (!session?.user) {
    return null;
  }

  return (
    <AppShell
      userName={session.user.name || undefined}
      userEmail={session.user.email || undefined}
      userImage={session.user.image || undefined}
      inputPlaceholder="https://youtube.com/@channel-name"
      onInputSubmit={handleAddChannel}
    >
      <div className="h-full overflow-hidden flex flex-col">
        <div className="text-start space-y-2 shrink-0 py-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            Hello {session.user.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-xl text-muted-foreground">Your Subscribed Channels</p>
        </div>

        {isLoading ? (
          <div className="text-center py-24 text-muted-foreground flex-1 flex items-center justify-center">
            Loading channels...
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-24 space-y-3 flex-1 flex items-center justify-center">
            <p className="text-lg text-muted-foreground">
              No channels yet. Paste a YouTube channel URL above to get started!
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto scroll-smooth px-4">
            <div className="max-w-4xl mx-auto space-y-4 py-4">
              {channels.map((channel, index) => (
                <div
                  key={channel.id}
                  className="animate-fade-in opacity-0"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <ChannelHorizontalCard
                    channel={channel}
                    onSeeSummaries={() => handleSeeSummaries(channel.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
