"use client"
import React from "react";
import Image from "next/image";
function ImagePreview({ file }: { file: File }) {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl); // cleanup on unmount
  }, [file]);

  return url ? <Image src={url} alt="Preview" height={400} width={400} /> : null;
}


export default ImagePreview;