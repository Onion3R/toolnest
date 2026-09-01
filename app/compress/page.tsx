"use client"
import { Upload, Image, X, Check, LoaderCircle, Download } from "lucide-react"
import React from "react"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "motion/react";
import SideBar from "@/components/imgcompress/SideBar"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const values = [{ id: 'low', label: 'Low', value: 0.2 }, { id: 'medium', label: 'Medium', value: 0.5 }, { id: 'high', label: 'High', value: 0.8 }]

export default function CompressPage() {
	const [isDragging, setIsDragging] = React.useState(false)
	const [isDownloading, setIsDownloading] = React.useState(false)
	const [files, setFiles] = React.useState<File[]>([])
	const [progress, setProgress] = React.useState(0);
	const [compressingFile, setCompressingFile] = React.useState<string | null>(null)
	const [compressedFiles, setCompressedFiles] = React.useState<{ id: string; fileSize: number; file: File }[]>([])
	const [previewImage, setPreviewImage] = React.useState<{ fileName: string; url: string } | null>(null)
	const [error, setError] = React.useState<{ message: string; state: boolean; onConfirm: () => void; onCancel: () => void } | null>(null)
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
		const selectedFiles = Array.from(event.target.files ?? [])
		if (selectedFiles.length === 0) return

		if (compressedFiles.length > 0) {
			setError({
				message: "All compressed Files will be removed if you upload new files. Do you want to continue?", state: true, onConfirm: () => {
					setCompressedFiles([])
					setError(null)
					uploadFile(selectedFiles, true)
				}, onCancel: () => {
					setError(null)
				}
			})

			return
		}

		uploadFile(selectedFiles)
		event.target.value = ""
	}

	const uploadFile = (selectedFiles: File[], replace = false) => {
		setFiles((prev) => {
			const nextFiles = replace ? selectedFiles : [...prev, ...selectedFiles]
			if (nextFiles.length > 5) {
				alert("You can only upload a maximum of 5 files.")
				return prev
			}
			return nextFiles
		})
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

				setCompressedFiles((current) => [...current, { id: file.name, fileSize: compressedFile.size, file: compressedFile }])


			}


			// Automatically download when compression finishes

		} catch (error) {
			console.error("Compression failed:", error);

		} finally {
			setCompressingFile(null);
			setProgress(0);
			setIsCompressing(false)
			console.log(compressedFiles, 'compressedFiles')
		}



	}

	const handleRemoveFile = (index: number) => {
		setFiles(files.filter((_, i) => i !== index));
	}

	const getCompressedFile = (fileName: string) =>
		compressedFiles.find((compressedFile) => compressedFile.id === fileName)?.file

	const handlePreview = (fileName: string) => {
		const compressedFile = getCompressedFile(fileName)
		if (!compressedFile) return

		const url = URL.createObjectURL(compressedFile)
		setPreviewImage({ fileName, url })
	}

	const handleDownload = (fileName: string) => {
		setIsDownloading(true)
		const compressedFile = getCompressedFile(fileName)
		if (!compressedFile) return

		const url = URL.createObjectURL(compressedFile)
		const link = document.createElement("a")
		const originalName = fileName.replace(/\.[^/.]+$/, "")
		const extension = settings.format.toLowerCase() === "jpeg" ? "jpg" : settings.format.toLowerCase()
		link.href = url
		link.download = `compressed-${originalName}.${extension}`
		link.click()
		URL.revokeObjectURL(url)

		setIsDownloading(false)
	}

	const handleDownloadAll = () => {
		for (const compressedFile of compressedFiles) {
			handleDownload(compressedFile.id)
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
		<div className="relative flex min-h-screen h-full flex-col gap-6 p-4 lg:flex-row">

			<motion.main
				className={`flex w-full flex-col  justify-center items-center ${files.length > 0 ? "lg:w-3/4" : "lg:w-full"}`}>
				<div className="w-full max-w-200">
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`mt-4 flex h-72 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed px-4 text-center md:h-100 ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
							}`}
					>
						<input
							type="file"
							id="file-input"
							className="hidden"
							multiple
							onChange={handleFileSelect}
						/>
						<label htmlFor="file-input" className="flex h-full w-full flex-col items-center justify-center">
							<div className="p-2 bg-white rounded-full w-15 h-15 flex items-center justify-center mb-2">
								<Upload className="text-muted-foreground" />
							</div>
							<h1 className="text-xl font-semibold md:text-2xl">Upload Documents</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								Maximum files 5 • Format Supported JPEG, PNG, WEBP
							</p>
						</label>
					</div>
				</div>


				{files.length > 0 && (
					<div className="flex w-full max-w-200 flex-col">

						<motion.div variants={itemsContainer} initial="hidden" animate="show" className="w-full">
							<ul className="mt-4 text-left space-y-2 text-sm">
								{files.map((file, idx) => (
									<motion.li
										key={idx}
										variants={itemsVariant}
										initial="hidden"
										animate="visible"
										onClick={() => alert('click')}
										className="w-full space-y-3 rounded border px-3 py-3 sm:px-6"
									>
										<div className="flex justify-between items-center">
											<div className="flex-center gap-4">
												<div className="bg-accent flex-center  rounded-2xl w-10 h-10">
													<Image strokeWidth={1} />
												</div>
												<div className="min-w-0">
													{file.name}
													<div className="flex gap-2">
														<p className="text-muted-foreground">JPG  • {Math.round(file.size / 1024)} KB</p>
														{compressedFiles.some((compressedFile) => compressedFile.id === file.name) && (
															<p className="text-muted-foreground"> {Math.round((compressedFiles.find((compressedFile) => compressedFile.id === file.name)?.fileSize ?? 0) / 1024)} KB</p>
														)}
													</div>
												</div>
											</div>

											{compressingFile === file.name ? (
												<LoaderCircle className="animate-spin" size={14} />
											) : compressedFiles.some((compressedFile) => compressedFile.id === file.name) ? (
												<div className="flex gap-2">
													<Button onClick={(event) => {
														event.stopPropagation()
														handlePreview(file.name)
													}}>Preview</Button>
													<Button onClick={(event) => {
														event.stopPropagation()
														handleDownload(file.name)
													}}>Download</Button>
												</div>
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
						<Button onClick={handleDownloadAll} className="mt-4">Download All</Button>
					</div>
				)



				}
			</motion.main>
			<SideBar files={files} compressImage={compressImage} settings={settings} setSettings={setSettings} isCompressing={isCompressing} compressedFiles={compressedFiles} />

			<AlertDialog onOpenChange={() => setError(null)} open={error?.state || false}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							{error?.message}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={error?.onCancel}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={error?.onConfirm}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{previewImage && (
				<div id='popup' className="absolute inset-0 z-2 h-full w-full flex-center bg-black/60 backdrop-blur-sm ">
					<div className="flex gap-2 relative">
						<div id="preview-container" className="p-2 bg-background rounded max-w-100">
							<img src={previewImage?.url || ''} alt="Preview" />
						</div>
						<div className="absolute -right-10 flex flex-col "><Button onClick={() => setPreviewImage(null)}><X /></Button>
							<Button onClick={() => handleDownload(previewImage?.fileName)} disabled={isDownloading}>
								{isDownloading ? <LoaderCircle className="animate-spin" /> : <Download />}
							</Button></div>
					</div>
				</div>
			)}
		</div>
	)
}
