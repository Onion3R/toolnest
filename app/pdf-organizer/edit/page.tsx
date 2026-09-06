"use client";

import React from "react";
import dynamic from "next/dynamic";
import { getFiles } from "@/lib/fileStorage";

const PDFPreview = dynamic(() => import("@/components/pdforganizer/PDFPreview"), {
  ssr: false,
});

function Page() {

  const [files, setFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    async function loadFiles() {
      const storedFiles = await getFiles();

      setFiles(storedFiles);

      console.log(storedFiles);
    }

    loadFiles();
  }, []);


  return (
    <div>
      {files && <PDFPreview files={files} />}
    </div>
  );
}

export default Page;