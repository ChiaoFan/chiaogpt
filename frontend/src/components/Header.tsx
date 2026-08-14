import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { InfoPanel } from "@/components/InfoPanel"

export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <Avatar className="size-[29px]">
          <AvatarImage src="/profile.jpeg" alt="ChiaoGPT" />
          <AvatarFallback className="bg-primary/10 font-display text-primary">
            C
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-base font-medium tracking-tight text-foreground sm:text-lg">
            ChiaoGPT
          </h1>
          <p className="text-xs text-muted-foreground">
            Lead Solutions Engineer
          </p>
        </div>
      </div>
      <InfoPanel />
    </header>
  )
}
