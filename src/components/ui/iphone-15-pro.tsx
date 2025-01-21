// src/components/ui/iphone-15-pro.tsx
import { SVGProps, useEffect, useState } from "react";
import Image from "next/image";

export interface Iphone15ProProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  src?: string;
  videoSrc?: string;
}

export default function Iphone15Pro({
  width = 260,
  height = 530,
  src,
  videoSrc,
  ...props
}: Iphone15ProProps) {
  // Use window size to make the component responsive
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate dimensions based on device
  const aspectRatio = 433 / 882;
  const scaledWidth = isMobile ? Math.min(window.innerWidth * 0.8, width) : width;
  const scaledHeight = scaledWidth / aspectRatio;

  // Generate unique IDs for clipPath
  const clipPathId = `roundedCorners-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative w-full flex justify-center">
      <svg
        width={scaledWidth}
        height={scaledHeight}
        viewBox="0 0 433 882"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full h-auto"
        {...props}
      >
        {/* iPhone frame paths */}
        <path
          d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z"
          className="fill-[#E5E5E5] dark:fill-[#404040]"
        />
        {/* ... other frame paths ... */}
        
        {/* Screen content */}
        {src && (
          <>
            <defs>
              <clipPath id={clipPathId}>
                <rect
                  x="21.25"
                  y="19.25"
                  width="389.5"
                  height="843.5"
                  rx="55.75"
                  ry="55.75"
                />
              </clipPath>
            </defs>
            <image
              href={src}
              x="21.25"
              y="19.25"
              width="389.5"
              height="843.5"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipPathId})`}
            />
            {/* Fallback for image loading issues */}
            <foreignObject 
              x="21.25" 
              y="19.25" 
              width="389.5" 
              height="843.5" 
              clipPath={`url(#${clipPathId})`}
              style={{ display: 'none' }}
            >
              <div className="w-full h-full">
                <Image
                  src={src}
                  alt="iPhone screen content"
                  fill
                  className="rounded-[55.75px] object-cover"
                />
              </div>
            </foreignObject>
          </>
        )}
        
        {/* Video content */}
        {videoSrc && (
          <foreignObject 
            x="21.25" 
            y="19.25" 
            width="389.5" 
            height="843.5"
            clipPath={`url(#${clipPathId})`}
          >
            <video
              className="w-full h-full overflow-hidden rounded-[55.75px] object-cover"
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
            />
          </foreignObject>
        )}
      </svg>
    </div>
  );
}