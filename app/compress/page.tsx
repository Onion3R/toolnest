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
			if (files.length + selectedFiles.length > 5) {
				alert("You can only upload a maximum of 5 files.")
				return
			}
			setFiles([...files, ...selectedFiles])
			console.log("Selected files:", selectedFiles)
		}
	}



	async function compressImage(files: File[]) {

		const options = {
			maxSizeMB: 1,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};

		console.log('clicking')
		console.log('files', files)

		try {


			files.forEach(async (file) => {
				const compressedFile = await imageCompression(file, options);


				const url = URL.createObjectURL(compressedFile);

				const link = document.createElement("a");
				link.href = url;
				link.download = `compressed-${file.name}`;

				link.click();

				URL.revokeObjectURL(url);
			})



			// Automatically download when compression finishes

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
			<main className="text-center  flex items-center justify-center flex-col">
				<div className="flex-center flex-col ">



					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`border-2 border-dashed rounded mt-4 h-100  w-200! flex flex-col items-center justify-center cursor-pointer   ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
							}`}
					>
						<input
							type="file"
							id="file-input"
							className="hidden"
							multiple
							onChange={handleFileSelect}
						/>
						<label htmlFor="file-input" className="flex flex-col items-center  h-full w-full flex-center">
							<div className="p-2 bg-white rounded-full w-15 h-15 flex items-center justify-center mb-2">
								<Upload className="text-muted-foreground" />
							</div>
							<h1 className="text-2xl font-semibold">Upload Documents</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								Maximum files 5 - Format Supported JPEG, PNG, WEPT
							</p>
						</label>
					</div>
				</div>


				{files.length > 0 && (
					<div className="flex-center flex-col w-full">

						<motion.div variants={itemsContainer} initial="hidden" animate="show">
							<ul className="mt-4 text-left space-y-2 text-sm">
								{files.map((file, idx) => (
									<motion.li
										key={idx}
										variants={itemsVariant}
										initial="hidden"
										animate="visible"
										className=" px-4 py-1 border w-full"
									>
										{file.name} <p className="text-muted-foreground">({Math.round(file.size / 1024)} KB)</p>
									</motion.li>
								))}
							</ul>
							<Button size="lg" className="mt-4" onClick={() => compressImage(files)}>Compress Image</Button>
						</motion.div>
					</div>
				)

				}
			</main>
		</div>
	)
}
