import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import { RotateCw, Maximize2 } from 'lucide-react';

// TypeScript declaration for the custom <model-viewer> element to prevent compilation errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          'auto-rotate'?: boolean | string;
          'camera-controls'?: boolean | string;
          'touch-action'?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

interface ModelEmbedProps {
  modelEmbedUrl?: string; // Sketchfab or Spline URL
  modelPath?: string; // Direct path to .glb file
  fallbackImage?: string; // Cover image displayed before loading
  title?: string;
}

export const ModelEmbed: React.FC<ModelEmbedProps> = ({
  modelEmbedUrl,
  modelPath,
  fallbackImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
  title = 'Interactive 3D Model',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  // Load Google model-viewer script dynamically only when .glb direct model is active
  useEffect(() => {
    if (isActive && modelPath && !modelViewerLoaded) {
      const scriptId = 'google-model-viewer-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
        script.onload = () => setModelViewerLoaded(true);
        script.onerror = () => console.error('Failed to load Google model-viewer library.');
        document.head.appendChild(script);
      } else {
        setModelViewerLoaded(true);
      }
    }
  }, [isActive, modelPath, modelViewerLoaded]);

  if (!modelEmbedUrl && !modelPath) {
    return null;
  }

  const isSketchfab = modelEmbedUrl?.includes('sketchfab.com');
  const isSpline = modelEmbedUrl?.includes('spline.design');

  const handleActivate = () => {
    setIsActive(true);
  };

  return (
    <div className="relative w-full aspect-video rounded-card overflow-hidden border border-border bg-surface-muted shadow-sm flex flex-col items-center justify-center group">
      {!isActive ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
          {fallbackImage && (
            <img
              src={fallbackImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-[1.01] transition-transform duration-500 ease-out"
            />
          )}
          <div className="relative z-10 space-y-3.5 max-w-sm">
            <span className="text-[9px] font-black uppercase tracking-widest text-secondary bg-secondary/15 py-1 px-3 rounded-full border border-secondary/20 backdrop-blur-sm">
              3D Accent Block
            </span>
            <h4 className="text-xs font-black text-white leading-snug drop-shadow-md">
              {title}
            </h4>
            <p className="text-[10px] text-zinc-300 leading-relaxed font-semibold drop-shadow-sm">
              Load an interactive 3D viewport of this project. Click below to initialize WebGL frame.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleActivate}
              icon={<RotateCw className="h-3.5 w-3.5" />}
            >
              Load Interactive 3D
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative bg-zinc-950">
          {/* 3D Render Portals */}
          {isSketchfab && modelEmbedUrl && (
            <iframe
              title={title}
              src={modelEmbedUrl}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              className="w-full h-full"
            />
          )}

          {isSpline && modelEmbedUrl && (
            <iframe
              title={title}
              src={modelEmbedUrl}
              frameBorder="0"
              className="w-full h-full"
            />
          )}

          {/* Direct glb files using <model-viewer> */}
          {modelPath && (
            <div className="w-full h-full flex items-center justify-center">
              {!modelViewerLoaded ? (
                <div className="text-center text-xs text-text-muted space-y-2">
                  <div className="h-6 w-6 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-semibold text-[10px] uppercase tracking-wide">Initializing model renderer...</p>
                </div>
              ) : (
                <model-viewer
                  src={modelPath}
                  alt={title}
                  auto-rotate=""
                  camera-controls=""
                  touch-action="pan-y"
                  style={{ width: '100%', height: '100%', outline: 'none' }}
                />
              )}
            </div>
          )}

          {/* Catch-all fallback iframe for generic external URLs */}
          {!isSketchfab && !isSpline && modelEmbedUrl && (
            <iframe
              title={title}
              src={modelEmbedUrl}
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            />
          )}

          {/* Reset Frame Button */}
          <button
            onClick={() => setIsActive(false)}
            className="absolute bottom-3 right-3 z-20 bg-black/80 hover:bg-black text-white border border-white/20 text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-ctrl shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 className="h-3 w-3" /> Close 3D Viewer
          </button>
        </div>
      )}
    </div>
  );
};

export default ModelEmbed;
