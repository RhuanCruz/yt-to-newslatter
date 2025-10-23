"use client";

import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/45.jpg",
    name: "Laura Mendes",
    handle: "@lauramkt",
    text: "Perfeito pra quem quer acompanhar vários canais sem perder tempo vendo todos os vídeos. Agora recebo um resumo completo direto no e-mail!",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/21.jpg",
    name: "Rafael Souza",
    handle: "@rafaeldev",
    text: "Uso pra transformar canais de tecnologia em uma newsletter semanal. A transcrição é precisa e os resumos são super bem escritos.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Camila Duarte",
    handle: "@camilaedu",
    text: "Como professora, adoro poder acompanhar canais de educação sem precisar assistir tudo. O app já virou parte da minha rotina.",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/56.jpg",
    name: "Lucas Farias",
    handle: "@lucas.newsletter",
    text: "Transformei meus canais favoritos de notícias e podcasts em uma newsletter pessoal. Economia de tempo absurda!",
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/34.jpg",
    name: "Beatriz Lima",
    handle: "@beatrizwrites",
    text: "A ideia é genial — recebo insights dos vídeos que amo, direto no e-mail. Parece uma curadoria feita por mim, só que automática.",
  },
];

export default function Home() {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign In submitted:", data);
    alert(`Sign In Submitted! Check the browser console for form data.`);
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/home",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Erro ao entrar com Google");
    }
  };

  const handleResetPassword = () => {
    alert("Reset Password clicked");
  };

  const handleCreateAccount = () => {
    alert("Create Account clicked");
  };

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
}
