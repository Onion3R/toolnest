"use client"
import { Upload, Image, X, Check, LoaderCircle } from "lucide-react"
import React from "react"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "motion/react";
import SideBar from "@/components/imgcompress/SideBar"

const values = [{ id: 'low', label: 'Low', value: 0.2 }, { id: 'medium', label: 'Medium', value: 0.5 }, { id: 'high', label: 'High', value: 0.8 }]

export default function page() {
	const [isDragging, setIsDragging] = React.useState(false)
	const [files, setFiles] = React.useState<File[]>([])
	const [progress, setProgress] = React.useState(0);
	const [compressingFile, setCompressingFile] = React.useState<string | null>(null)
	const [compressedFiles, setCompressedFiles] = React.useState<{ id: string; fileSize: number }[]>([])
	const [isCompressing, setIsCompressing] = React.useState(false)
	// const [settings, setSettings] = React.useState({ maxSizeMB: 1, initialQuality: 0.8, maxWidthOrHeight: 1920, useWebWorker: true, format: "JPEG" })
	const [settings, setSettings] = React.useState({ initialQuality: 0.8, format: 'JPEG' })
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
		}
	}



	async function compressImage(files: File[]) {


		setIsCompressing(true)
		const options = {
			initialQuality: settings.initialQuality,
			useWebWorker: true,
			fileType: `image/${settings.format.toLowerCase() === 'webp' ? 'webp' : settings.format.toLowerCase() === 'jpeg' ? 'jpeg' : 'png'}`,

			onProgress: (progress: number) => {
				setProgress(progress);
			},
		};

		console.log(settings, 'settings')

		try {


			for (const file of files) {


				setCompressingFile(file.name);
				setProgress(0);

				const compressedFile = await imageCompression(file, options);

				const url = URL.createObjectURL(compressedFile);

				const link = document.createElement("a");
				link.href = url;
				const originalName = file.name.replace(/\.[^/.]+$/, "");
				const extension = settings.format.toLowerCase() === "jpeg" ? "jpg" : settings.format.toLowerCase();
				link.download = `compressed-${originalName}.${extension}`;

				link.click();

				URL.revokeObjectURL(url);
						setCompressedFiles((current) => [...current, { id: file.name, fileSize: file.size }])
			}


			// Automatically download when compression finishes

		} catch (error) {
			console.error("Compression failed:", error);

		} finally {
			setCompressingFile(null);
			setProgress(0);
			setIsCompressing(false)
		}


	}

	const handleRemoveFile = (index: number) => {
		setFiles(files.filter((_, i) => i !== index));
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
		<div className="flex min-h-screen h-full   p-4">
			<motion.main
				animate={files.length > 0 ? { width: "75%" } : { width: "100%" }}
				className="  flex-center  flex-col">
				<div >
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
							</div>``
							<h1 className="text-2xl font-semibold">Upload Documents</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								Maximum files 5 • Format Supported JPEG, PNG, WEBP
							</p>
						</label>
					</div>
				</div>


				{files.length > 0 && (
					<div className="flex-center flex-col w-200">

						<motion.div variants={itemsContainer} initial="hidden" animate="show" className="w-full">
							<ul className="mt-4 text-left space-y-2 text-sm">
								{files.map((file, idx) => (
									<motion.li
										key={idx}
										variants={itemsVariant}
										initial="hidden"
										animate="visible"
										onClick={()=>alert('click')}
										className=" px-6 py-3 border w-full   rounded space-y-3"
									>
										<div className="flex justify-between items-center">
											<div className="flex-center gap-4">
												<div className="bg-accent flex-center  rounded-2xl w-10 h-10">
													<Image strokeWidth={1} />
												</div>
												<div>
													{file.name}
													<p className="text-muted-foreground">JPG  • {Math.round(file.size / 1024)} KB</p>

												</div>
											</div>

											{compressingFile === file.name ? (
												<LoaderCircle className="animate-spin" size={14} />
											) : compressedFiles.some((compressedFile) => compressedFile.id === file.name) ? (
												<Check size={14} />
											) : (
												<Button
													variant="ghost"
													onClick={(event) => {
														event.stopPropagation()
														handleRemoveFile(idx)
													}}
												>
													<X />
												</Button>
											)}
										</div>
										{compressingFile === file.name && (
											<Progress value={progress} className="w-full" />
										)}
									</motion.li>
								))}
							</ul>

						</motion.div>
					</div>
				)

				}
			</motion.main>
			<SideBar files={files} compressImage={compressImage} settings={settings} setSettings={setSettings}  isCompressing={isCompressing} compressedFiles={compressedFiles} />
		</div>
	)
}
