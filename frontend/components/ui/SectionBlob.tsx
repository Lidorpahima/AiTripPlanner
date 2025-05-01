import React from "react";
import clsx from "clsx";

export interface SectionBlobProps {
  blobName: string; 
  className?: string;
  alt?: string;
}

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
