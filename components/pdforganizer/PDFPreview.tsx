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
import type { DragEndEvent } from "@dnd-kit/core";


type PDFPreviewProps = {
  files: any;
};

import { imageFileTypes } from "@/app/pdf-organizer/page";
import ImagePreview from "./ImagePreview";
import SortablePage from "./SortablePage";


export default function PDFPreview({ files }: PDFPreviewProps) {
  const [numPages, setNumPages] = React.useState(0)
  const [pageOrder, setPageOrder] = React.useState<string[]>([]);

  if (!files || files.length === 0) {
    return <div>No file selected</div>;
  }



  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    console.log("Dragged:", active.id);
    console.log("Dropped over:", over.id);
  }
  console.log(files, 'files')

  return (
    <div className="flex-center flex-col bg-accent gap-4">

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={Array.from(
          { length: numPages },
          (_, i) => `${0}-${i}`
        )}>
          {files.map((file: any, index: any) => (

            imageFileTypes.includes(file.type) ? (
              <ImagePreview key={index} file={file} />
            ) : (
              <Document
                key={index}
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