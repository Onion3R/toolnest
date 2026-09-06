"use client"
import React from "react";
function ImagePreview({ file }: { file: File }) {
  const [url, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl); // cleanup on unmount
  }, [file]);

  return url ? <img src={url} alt="Preview" /> : null;
}


export default ImagePreview;