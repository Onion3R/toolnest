"use client"
import { CloudUpload } from "lucide-react"
import React from "react"

export default function page() {
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(event.dataTransfer.files)
      setFiles(droppedFiles)
      console.log("Dropped files:", droppedFiles)
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files)
      setFiles(selectedFiles)
      console.log("Selected files:", selectedFiles)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="text-center">
        <h1 className="text-2xl font-semibold">Upload Documents</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Drag files here or click to upload.
        </p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded mt-4 w-80 h-40 flex flex-col items-center justify-center cursor-pointer ${
            isDragging ? "border-blue-500 bg-red-50" : "border-gray-400"
          }`}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <label htmlFor="file-input" className="flex flex-col items-center">
            <CloudUpload className="mb-2" />
            <p>Click or drop files</p>
          </label>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 text-left">
            {files.map((file, idx) => (
              <li key={idx}>
                {file.name} ({Math.round(file.size / 1024)} KB)
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
