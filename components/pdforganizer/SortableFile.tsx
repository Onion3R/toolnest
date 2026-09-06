
import { imageFileTypes } from "@/app/pdf-organizer/page";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";


import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
import { CSS } from "@dnd-kit/utilities";
import ImagePreview from "./ImagePreview";
import React from "react";
function SortableFile({ file, index }: { file: File; index: number }) {

  const [numPages, setNumPages] = React.useState(0)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: index,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab"
    >
      {imageFileTypes.includes(file.type) ? (
        <ImagePreview file={file} />
      ) : (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i}
              pageNumber={i + 1}
              width={400}
            />
          ))}
        </Document>
      )}
    </div>
  );
}

export default SortableFile;