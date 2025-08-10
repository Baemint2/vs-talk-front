// components/common/LazyYouTube.tsx
import { useState } from "react";

interface LazyYouTubeProps {
    videoId: string;
    width?: string;
    height?: string;
}

export default function LazyYouTube({ videoId, width = "100%", height = "360px" }: LazyYouTubeProps) {
    const [loaded, setLoaded] = useState(false);
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return (
        <div
            className="relative cursor-pointer overflow-hidden rounded-lg"
            style={{ width, height }}
            onClick={() => setLoaded(true)}
        >
            {loaded ? (
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <img src={thumbnail} className="w-full h-full object-cover" alt="YouTube thumbnail" />
            )}
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <button className="text-white text-3xl bg-red-600 px-4 py-2 rounded-full">▶</button>
                </div>
            )}
        </div>
    );
}
