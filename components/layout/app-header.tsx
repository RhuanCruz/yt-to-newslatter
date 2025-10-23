"use client";

import { Youtube, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppHeaderProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  inputPlaceholder: string;
  onInputSubmit: (value: string) => void;
}

export function AppHeader({
  userName,
  userEmail,
  userImage,
  inputPlaceholder,
  onInputSubmit,
}: AppHeaderProps) {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onInputSubmit(inputValue.trim());
      setInputValue("");
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/auth");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  // Get initials from name or email
  const getInitials = () => {
    if (userName) {
      return userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (userEmail) {
      return userEmail.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="bg-background/95 backdrop-blur ">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 h-10 w-fit items-center justify-center rounded-xl ">
           Yt to <span className="text-primary"> newsletter</span>
          </div>
          <span className="hidden font-semibold md:inline-block"></span>
        </div>

        {/* Central Input */}
        <form
          onSubmit={handleSubmit}
          className="flex  mx-auto"
        >
          <Input
            type="text"
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-64 md:w-96 lg:w-[500px]"
          />
          <Button type="submit" className="ml-2" variant='default'>
            Add Channel
          </Button>
        </form>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {userEmail || "user@example.com"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                <Avatar>
                  <AvatarImage src={userImage} alt={userName || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className=" text-amber-50  ">
                <LogOut className="mr-2 h-4 w-4 text-primary" />
                <span className="text-primary">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
