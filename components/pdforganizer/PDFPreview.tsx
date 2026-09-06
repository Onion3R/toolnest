"use client";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import React from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";



type PDFPreviewProps = {
  files: any;
};

import SortableFile from "./SortableFile";
import { imageFileTypes } from "@/app/pdf-organizer/page";
import ImagePreview from "./ImagePreview";
import SortablePage from "./SortablePage";


export default function PDFPreview({ files }: PDFPreviewProps) {
  const [numPages, setNumPages] = React.useState(0)
  if (!files || files.length === 0) {
    return <div>No file selected</div>;
  }



  console.log(files, 'files')

  return (
    <div className="flex-center flex-col bg-accent gap-4">

      <DndContext>
        <SortableContext items={Array.from(
          { length: numPages },
          (_, i) => `${0}-${i}`
        )}>
          {files.map((file: any, index: any) => (

            imageFileTypes.includes(file.type) ? (
              <ImagePreview file={file} />
            ) : (
              <Document
                file={file}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <SortablePage key={i} id={`${index}-${i}`} file={file} pageNumber={i + 1}
                  />
                ))}
              </Document>
            )
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}