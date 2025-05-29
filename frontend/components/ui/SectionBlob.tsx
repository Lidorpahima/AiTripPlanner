/**
 * Section Blob Component
 * 
 * A reusable component for displaying decorative background blobs in sections.
 * Features:
 * - Dynamic blob image loading from SVG directory
 * - Responsive image sizing
 * - Accessibility support
 * - Customizable styling
 * - Non-interactive by default
 */

import React from "react";
import clsx from "clsx";

/**
 * Props interface for the SectionBlob component
 * @property blobName - Name of the SVG file to use as the blob
 * @property className - Optional additional CSS classes
 * @property alt - Optional alt text for accessibility
 */
export interface SectionBlobProps {
  blobName: string; 
  className?: string;
  alt?: string;
}

/**
 * SectionBlob Component
 * 
 * Renders a decorative background blob image that can be used to enhance
 * the visual appeal of sections. The blob is positioned absolutely and
 * does not interfere with user interactions.
 */
const SectionBlob: React.FC<SectionBlobProps> = ({ blobName, className, alt }) => {
  return (
    <img
      src={`/svg/${blobName}`}
      alt={alt || "Decorative background blob"}
      aria-hidden={alt ? undefined : true}
      className={clsx(
        "absolute inset-0 w-full h-full object-cover md:object-fill pointer-events-none -z-10 select-none",
        className
      )}
      draggable={false}
    />
  );
};

export default SectionBlob;
