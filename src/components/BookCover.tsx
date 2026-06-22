import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"

interface BookCoverProps {
  src?: string
  size?: "M" | "S"
}

export function BookCover({ src, size = "M" }: BookCoverProps) {
  const [loaded, setLoaded] = useState(false)

  // Reinicia o estado quando a imagem muda
  useEffect(() => {
    setLoaded(false)
  }, [src])

  const imageSrc = src || "/book-placeholder.png"

  return (
    <div
      className={`relative ${
        size === "M" ? "w-45" : "w-10"
      } aspect-2/3 shrink-0 overflow-hidden rounded-md border`}
    >
      {!loaded && (
        <Skeleton className="absolute inset-0" />
      )}

      <img
        src={imageSrc}
        alt=""
        className={`block h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}