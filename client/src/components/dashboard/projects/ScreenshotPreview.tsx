import { useState, useEffect } from "react";
import { Globe, Loader2 } from "lucide-react";

interface ScreenshotPreviewProps {
  url: string;
}

export function generateScreenshotUrl(url: string): string {
  if (!url) return "";
  return `https://image.thum.io/get/width/1200/crop/630/noanimate/${url}`;
}

export function ScreenshotPreview({ url }: ScreenshotPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const screenshotUrl = generateScreenshotUrl(url);

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [url]);

  if (!url) {
    return (
      <div className="aspect-video bg-muted/20 rounded-lg border border-dashed border-white/10 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Enter a project URL to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-muted/20 rounded-lg border border-white/10 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Could not load preview</p>
          </div>
        </div>
      ) : (
        <img
          src={screenshotUrl}
          alt="Website preview"
          className="w-full h-full object-cover"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </div>
  );
}
