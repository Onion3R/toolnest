"use client";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import React from "react";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
type PDFPreviewProps = {
  files: any;
};

import { imageFileTypes } from "@/app/pdf-organizer/page";
import ImagePreview from "./ImagePreview";
export default function PDFPreview({ files }: PDFPreviewProps) {
  const [numPages, setNumPages] = React.useState(0)
  if (!files || files.length === 0) {
    return <div>No file selected</div>;
  }



  console.log(files, 'files')

  return (
    <div>

      {files.map((file: any, index: number) => (
        <div key={index}>
          {imageFileTypes.includes(file.type) ? (
            <ImagePreview file={file} />
          ) : (
            <Document key={index} file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              {Array.from({ length: numPages }, (_, i) => (
                <Page key={i} pageNumber={i + 1} />
              ))}
            </Document>
          )}
        </div>
      ))}
    </div>
  );
}