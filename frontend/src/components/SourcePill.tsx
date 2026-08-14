interface SourcePillProps {
  sources: string[]
}

export function SourcePill({ sources }: SourcePillProps) {
  if (sources.length === 0) return null

  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {sources.map((source) => (
        <span
          key={source}
          className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.7rem] text-accent"
        >
          {source}
        </span>
      ))}
    </div>
  )
}
