"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { SummaryCard } from "@/components/channels/summary-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface Summary {
  id: string;
  videoTitle: string;
  publishedAt: Date;
  isRead: boolean;
  summaryContent: string;
  thumbnailUrl?: string;
}

interface ChannelInfo {
  id: string;
  channelName: string;
  thumbnailUrl?: string;
}

// Mock channel data
const MOCK_CHANNEL_DATA: Record<string, ChannelInfo> = {
  "1": {
    id: "1",
    channelName: "Linus Tech Tips",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
  },
  "2": {
    id: "2",
    channelName: "ElectroBOOM",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
  },
};

// Mock summaries
const MOCK_SUMMARIES: Summary[] = [
  {
    id: "1",
    videoTitle: "Nesse video falamos sobre...",
    publishedAt: new Date("2025-10-22"),
    isRead: true,
    summaryContent: "Este é um resumo de exemplo de um vídeo do YouTube.\n\nPontos principais:\n\n1. Introdução ao tema principal\n2. Explicação detalhada dos conceitos\n3. Demonstração prática\n4. Conclusão e próximos passos\n\nO vídeo oferece uma visão abrangente sobre o assunto, tornando fácil para os espectadores entenderem os conceitos apresentados.",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop",
  },
  {
    id: "2",
    videoTitle: "Tutorial: How to Build Amazing Projects",
    publishedAt: new Date("2025-10-20"),
    isRead: false,
    summaryContent: "Neste tutorial, aprendemos como construir projetos incríveis do zero.\n\nTópicos abordados:\n\n1. Configuração do ambiente de desenvolvimento\n2. Estrutura básica do projeto\n3. Implementação das funcionalidades principais\n4. Testes e deployment\n\nUm guia completo para iniciantes e desenvolvedores experientes.",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop",
  },
  {
    id: "3",
    videoTitle: "Top 10 Tips for Better Coding",
    publishedAt: new Date("2025-10-18"),
    isRead: false,
    summaryContent: "As 10 melhores dicas para melhorar suas habilidades de programação.\n\n1. Escreva código limpo e legível\n2. Use controle de versão\n3. Teste seu código regularmente\n4. Refatore quando necessário\n5. Aprenda novos padrões de design\n6. Pratique code review\n7. Mantenha-se atualizado\n8. Escreva documentação clara\n9. Use ferramentas de linting\n10. Nunca pare de aprender\n\nDicas práticas que todo desenvolvedor deveria seguir.",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
  },
];

export default function ChannelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const channelId = params.id as string;
  const { data: session } = useSession();

  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id && channelId) {
      loadChannelData();
      loadSummaries();
    }
  }, [session?.user?.id, channelId]);

  const loadChannelData = async () => {
    try {
      // TODO: Create API route to fetch channel data
      // const response = await fetch(`/api/channels/${channelId}`)
      // const data = await response.json()

      // Mock: Use predefined channel data
      await new Promise((resolve) => setTimeout(resolve, 500));

      const channelData = MOCK_CHANNEL_DATA[channelId];
      if (channelData) {
        setChannel(channelData);
      } else {
        // Default fallback
        setChannel({
          id: channelId,
          channelName: "Sample Channel",
          thumbnailUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop",
        });
      }
    } catch (error) {
      console.error("Error loading channel:", error);
      toast.error("Failed to load channel");
    }
  };

  const loadSummaries = async () => {
    if (!session?.user?.id) return;

    try {
      // TODO: Create API route to fetch summaries
      // const response = await fetch(`/api/channels/${channelId}/summaries`)
      // const data = await response.json()

      // Mock: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use mock data for now
      setSummaries(MOCK_SUMMARIES);
    } catch (error) {
      console.error("Error loading summaries:", error);
      toast.error("Failed to load summaries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVideo = async (videoUrl: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in");
      return;
    }

    try {
      // Mock: Extract video ID from URL
      const videoId = extractVideoIdFromUrl(videoUrl);

      if (!videoId) {
        toast.error("Invalid YouTube video URL");
        return;
      }

      // TODO: Create API route to add video summary
      // await fetch('/api/summaries', { method: 'POST', body: JSON.stringify({ videoUrl, channelId }) })

      // Mock: Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: Add new summary to list
      const newSummary: Summary = {
        id: String(summaries.length + 1),
        videoTitle: "New Video Added - Sample Title",
        publishedAt: new Date(),
        isRead: false,
        summaryContent: "This is a newly added video summary. In production, this would be generated by AI based on the video transcript.",
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };

      setSummaries([newSummary, ...summaries]);
      toast.success("Video summary added successfully!");
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error("Failed to add video summary");
    }
  };

  const extractVideoIdFromUrl = (url: string): string | null => {
    try {
      const patterns = [
        /youtube\.com\/watch\?v=([\w-]+)/,
        /youtu\.be\/([\w-]+)/,
        /youtube\.com\/embed\/([\w-]+)/,
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
      inputPlaceholder="https://youtube.com/watch?v=..."
      onInputSubmit={handleAddVideo}
    >
      <div className="space-y-6 p-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/home")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {channel && (
          <div className="flex items-center gap-4">
            {channel.thumbnailUrl && (
              <img
                src={channel.thumbnailUrl}
                alt={channel.channelName}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {channel.channelName}
              </h1>
              <p className="text-muted-foreground">lista de resumos desse canal</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading summaries...
          </div>
        ) : summaries.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-muted-foreground">
              No summaries yet. Paste a YouTube video URL above to add one!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {summaries.map((summary) => (
              <SummaryCard
                key={summary.id}
                summary={summary}
                userId={session.user.id}
                onReadStatusChange={loadSummaries}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
