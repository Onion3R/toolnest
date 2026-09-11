"use client";

import { Document } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import React from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";


type PDFPreviewProps = {
  files: File[];
};

import { imageFileTypes } from "@/app/pdf-organizer/page";
import ImagePreview from "./ImagePreview";
import SortablePage from "./SortablePage";


export default function PDFPreview({ files }: PDFPreviewProps) {
  const [pageOrder, setPageOrder] = React.useState<string[]>([]);

  if (!files || files.length === 0) {
    return <div>No file selected</div>;
  }



  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId.split("-")[0] !== overId.split("-")[0]) {
      return;
    }

    setPageOrder((items) => {
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) {
        return items;
      }

      return arrayMove(items, oldIndex, newIndex);
    });
  }

  return (
    <div className="flex-center flex-col bg-accent gap-4">

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={pageOrder} strategy={verticalListSortingStrategy}>
          {files.map((file, index) => (

            imageFileTypes.includes(file.type) ? (
              <ImagePreview key={index} file={file} />
            ) : (
              <Document
                key={index}
                file={file}
                onLoadSuccess={({ numPages }) => {
                  setPageOrder((currentOrder) => {
                    const loadedPageIds = Array.from(
                      { length: numPages },
                      (_, pageIndex) => `${index}-${pageIndex}`
                    );
                    const missingPageIds = loadedPageIds.filter(
                      (pageId) => !currentOrder.includes(pageId)
                    );

                    return [...currentOrder, ...missingPageIds];
                  });
                }}
              >
                {pageOrder.filter((id) => id.startsWith(`${index}-`)).map((id) => {
                  const pageNumber = Number(id.slice(id.indexOf("-") + 1)) + 1;

                  return (
                    <SortablePage
                      key={id}
                      id={id}
                      pageNumber={pageNumber}
                    />
                  );
                })}
              </Document>
            )
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}