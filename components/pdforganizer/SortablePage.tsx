
import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { Page , pdfjs} from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function SortablePage({
  id,
  pageNumber,
}: {
  id: string;
  pageNumber: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
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
      className="cursor-grab mt-4"
    >
      <Page
        pageNumber={pageNumber}
        width={400}
      />
    </div>
  );
}

export default SortablePage;