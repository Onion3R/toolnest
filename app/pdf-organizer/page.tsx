"use client"

import { FolderSearch, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { saveFiles } from "@/lib/fileStorage";

 export const imageFileTypes = ["image/jpeg", "image/png", "image/webp"];



function page() {

  const router = useRouter()
  const [isDragging, setIsDragging] = React.useState(false)
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      await saveFiles(droppedFiles);


      router.push("/pdf-organizer/edit");
    }
  }

  

  return (
    <div className="flex items-center justify-center h-full min-h-screen ">
      <div className="w-full max-w-200">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-4 flex h-72 w-full 	 flex-col items-center justify-center rounded border-2 border-dashed px-4 text-center md:h-100 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
            }`}
        >


          <div className="p-2 bg-white rounded-full w-15 h-15 flex items-center justify-center mb-2">
            <Upload className="text-muted-foreground" />
          </div>
          {/* <h1 className="text-xl font-semibold md:text-2xl">Upload Documents</h1> */}
          <p className="text-md">
            Choose a file or drag & drop it here.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Format Supported JPEG, PNG, WEBP
          </p>
          <input
            type="file"
            id="file-input"
            className="hidden"
            multiple
            accept="image/jpeg,image/png,image/webp,application/pdf"
          />
          <label htmlFor="file-input" className="flex-center gap-2 border  px-2 py-1 rounded mt-8 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
            <FolderSearch size={15} />
            <p className="text-sm">Browse files</p>
          </label>
        </div>
        <div className="text-sm flex items-center justify-between mt-4">
          <p ><span className="text-muted-foreground"> Maximum files: </span> 5</p>
          <p ><span className="text-muted-foreground"> Maximum file size: </span> 25MB</p>
        </div>
      </div>
    </div>
  )
}

export default page