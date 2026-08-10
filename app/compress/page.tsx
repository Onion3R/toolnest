"use client"
import { Upload } from "lucide-react"
import React from "react"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react";
export default function paeg() {
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


	async function compressImage(file: File) {
		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};

		try {
			const compressedFile = await imageCompression(file, options);

			// Automatically download when compression finishes
			const url = URL.createObjectURL(compressedFile);

			const link = document.createElement("a");
			link.href = url;
			link.download = `compressed-${file.name}`;

			link.click();

			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Compression failed:", error);

		}


	}

	const itemsContainer = {
		hidden: {},
		show: {
			transition: {
				staggerChildren: 0.7,
			},
		},
	};

	const itemsVariant = {
		hidden: { opacity: 0, x: -20 },
		visible: { opacity: 1, x: 0, },
	}

	return (
		<div className="flex min-h-screen h-screen items-center justify-center">
			<main className="text-center w-full h-full flex items-center justify-center flex-col">



				{files.length > 0 ? (
					<div className="flex-center flex-col w-full h-full">
						<h1 className="text-2xl font-semibold">Ready for Compression</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Double check your files.
						</p>

						<motion.div variants={itemsContainer} initial="hidden" animate="show">
							<ul className="mt-4 text-left space-y-2 text-sm">
								{files.map((file, idx) => (
									<motion.li
										key={idx}
										variants={itemsVariant}
										initial="hidden"
										animate="visible"
										className=" px-4 py-1 border border"
									>
										{file.name} <p className="text-muted-foreground">({Math.round(file.size / 1024)} KB)</p>
									</motion.li>
								))}
							</ul>
							<Button size="lg" className="mt-4" onClick={() => compressImage(files[0])}>Compress Image</Button>
						</motion.div>
					</div>
				) :
					(
						<div className="flex-center flex-col w-full h-full">
							<h1 className="text-2xl font-semibold">Upload Documents</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								Drag files here or click to upload.
							</p>


							<div
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								className={`border-2 border-dashed rounded mt-4 w-2/3 h-1/2 flex flex-col items-center justify-center cursor-pointer bg-accent  ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
									}`}
							>
								<input
									type="file"
									id="file-input"
									className="hidden"
									multiple
									onChange={handleFileSelect}
								/>
								<label htmlFor="file-input" className="flex flex-col items-center bg-blue-50 h-full w-full flex-center">
									<div className="p-2 bg-white rounded-full w-15 h-15 flex items-center justify-center mb-2">
										<Upload className="text-muted-foreground" />
									</div>
									<p>Click or drop files</p>
									<p>Max number of files is 5</p>
								</label>
							</div>
						</div>
					)

				}
			</main>
		</div>
	)
}
