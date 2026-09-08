"use client"
import { Upload, Trash, Image, X, Check, LoaderCircle, Download, FolderSearch, Fullscreen, RotateCw, } from "lucide-react"
import React from "react"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "motion/react";
import SideBar from "@/components/imgcompress/SideBar"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"

import { toast } from "@/components/ui/toast"
import PreviewImage from "@/components/imgcompress/PreviewImage"
import ErrorDialog from "@/components/imgcompress/ErrorDialog"
import { imageFileTypes } from "../pdf-organizer/page"
import { Checkbox } from "@/components/ui/checkbox"


export default function CompressPage() {
	const [isDragging, setIsDragging] = React.useState(false)
	const [isDownloading, setIsDownloading] = React.useState(false)
	const [files, setFiles] = React.useState<File[]>([])
	const [progress, setProgress] = React.useState(0);
	const [compressingFile, setCompressingFile] = React.useState<string | null>(null)
	const [compressedFiles, setCompressedFiles] = React.useState<{ id: string; fileSize: number; file: File }[]>([])
	const [previewImage, setPreviewImage] = React.useState<{ fileName: string; url: string; index: number } | null>(null)
	const [error, setError] = React.useState<{ message: string; state: boolean; onConfirm: () => void; onCancel: () => void } | null>(null)
	const [isCompressing, setIsCompressing] = React.useState(false)
	const [hasPendingChanges, setHasPendingChanges] = React.useState(false)
	// const [settings, setSettings] = React.useState({ maxSizeMB: 1, initialQuality: 0.8, maxWidthOrHeight: 1920, useWebWorker: true, format: "JPEG" })
	const [settings, setSettings] = React.useState({ initialQuality: 0.8, format: 'JPEG' })

	function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault()



		setIsDragging(true)
		if (event.dataTransfer.files.length < 0) return
		const selectedFiles = Array.from(event.dataTransfer.items)

		if (selectedFiles.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {

			event.dataTransfer.dropEffect = "none"
			return
		}




	}

	function handleDragLeave() {
		setIsDragging(false)
	}






	function handleDrop(event: React.DragEvent<HTMLDivElement>) {

		event.preventDefault()
		setIsDragging(false)


		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			const droppedFiles = Array.from(event.dataTransfer.files)

			handleDataValidation(event, droppedFiles)
		}
	}


	function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const selectedFiles = Array.from(event.target.files ?? [])
		handleDataValidation(event, selectedFiles)
	}

	const handleDataValidation = (event: React.ChangeEvent<HTMLInputElement>, selectedFiles: File[]) => {
		const currentMb = selectedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)

		if (selectedFiles.length === 0) return

		if (selectedFiles.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {

			toast.add({
				type: "error",
				description: "Some files were not valid image types and were ignored.",
				priority: "high",
			})
			return
		}

		if (currentMb > 25) {

			toast.add({
				type: "error",
				description: "Total file size exceeds 25MB. Please select smaller files.",
				priority: "high",
			})
			return
		}

		if (selectedFiles)

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
			setHasPendingChanges(false)
		}



	}

	const handleRemoveFile = (index: number) => {
		setFiles(files.filter((_, i) => i !== index));
	}

	const getCompressedFile = (fileName: string) =>
		compressedFiles.find((compressedFile) => compressedFile.id === fileName)?.file

	const handlePreview = (fileName: string, index: number) => {
		const compressedFile = getCompressedFile(fileName)
		if (!compressedFile) return

		const url = URL.createObjectURL(compressedFile)
		setPreviewImage({ fileName, url, index })
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

	const handlePreviewNavigation = (direction: "next" | "prev") => {
		if (!previewImage) return

		const currentIndex = compressedFiles.findIndex((file) => file.id === previewImage.fileName)

		if (currentIndex === -1) return

		const nextindex = direction === 'next' ? currentIndex + 1 : currentIndex - 1

		handlePreview(compressedFiles[nextindex]?.id, nextindex)
	}

	const handleSelectAll = () => {

	}


	return (
		<div className="relative flex min-h-screen h-full flex-col gap-6 overflow-x-hidden p-8 lg:flex-row">

			<motion.main
				className={`flex w-full flex-col  justify-center items-center ${files.length > 0 ? "lg:w-3/4" : "lg:w-full"}`}>
				<div className="w-full max-w-200">
					<div className="text-sm flex items-center justify-between mt-4">
						<p ><span className="text-muted-foreground"> Maximum files: </span> 5</p>
						<p ><span className="text-muted-foreground"> Maximum file size: </span> 25MB</p>
					</div>
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
							accept="image/jpeg,image/png,image/webp"
							onChange={handleFileSelect}
						/>
						<label htmlFor="file-input" className="flex-center gap-2 border  px-2 py-1 rounded mt-8 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
							<FolderSearch size={15} />
							<p className="text-sm">Browse files</p>
						</label>
					</div>

					<div className="flex items-center justify-between text-sm mt-4 px-2">
						<span className="flex-center gap-1"><Checkbox /> Selected: 01</span>
						<div className="flex-center ">
							<Button variant="ghost" className="p-1">
								<Trash size={14} className="" />
							</Button>
							{/* <Button variant="ghost" className="p-1">
								<RotateCw size={14} className="" />

							</Button> */}
						</div>
					</div>
				</div>


				{files.length > 0 && (
					<div className="flex w-full max-w-200 flex-col">

						<motion.div variants={itemsContainer} initial="hidden" animate="show" className="w-full">
							<ul className="mt-2 text-left space-y-2 text-sm">
								{files.map((file, idx) => (
									<motion.li
										key={idx}
										variants={itemsVariant}
										initial="hidden"
										animate="visible"

										className="w-full h-full space-y-3 rounded border bg-accent px-3 py-3 sm:px-6 border-primary group "
									>
										<div className="flex justify-between items-center">
											<div className=" flex-center gap-4">
												<Checkbox className="group-hover:opacity-100 group-hover:w-4 w-0 opacity-0 transition-all ease-in duration-75" />
												<div>
													<Image strokeWidth={1} size={24} />
												</div>
												<div className="min-w-0 text-xs">
													{file.name}
													<div className="flex gap-2">
														<p className="text-muted-foreground text-xs">File type: {file.type.split("/")[1]}   </p>


													</div>

												</div>
											</div>
											<div className="flex items-center gap-8">
												<div className="flex-center gap-2 text-xs text-muted-foreground">

													{compressedFiles.some((compressedFile) => compressedFile.id === file.name) ? (
														<>	<s >	{Math.round(file.size / 1024)} KB</s>
															<p > {Math.round((compressedFiles.find((compressedFile) => compressedFile.id === file.name)?.fileSize ?? 0) / 1024)} KB</p>
														</>
													) : <span >	{Math.round(file.size / 1024)} KB</span>}
												</div>
												{compressingFile === file.name ? (
													<LoaderCircle className="animate-spin" size={14} />
												) : compressedFiles.some((compressedFile) => compressedFile.id === file.name) ? (
													<div className="flex-center ">
														<Tooltip>
															<TooltipTrigger render={<Button variant="ghost" onClick={(event) => {
																event.stopPropagation()
																handlePreview(file.name, idx)
															}}><Fullscreen /></Button>} />

															<TooltipContent>
																<p>Preview</p>
															</TooltipContent>
														</Tooltip>
														<Tooltip>
															<TooltipTrigger render={<Button size={'sm'} variant="ghost" onClick={(event) => {
																event.stopPropagation()
																handleDownload(file.name)
															}}><Download /></Button>} />

															<TooltipContent>
																<p>Download</p>
															</TooltipContent>
														</Tooltip>

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
										</div>
										{compressingFile === file.name && (
											<Progress value={progress} className="w-full" />
										)}
									</motion.li>
								))}
							</ul>

						</motion.div>

						{compressedFiles.length > 0 && !isCompressing && (
							<div className="flex items-center justify-between mt-2 px-2">
								<span className="text-sm text-muted-foreground">Items: 0{files.length}</span>
								<Button onClick={handleDownloadAll} className="mt-4 gap-1 flex-center"><Download /> Download All</Button>
							</div>
						)}

					</div>
				)



				}
			</motion.main>

			<SideBar files={files} compressImage={compressImage} settings={settings} setSettings={setSettings} isCompressing={isCompressing} hasPendingChanges={hasPendingChanges} setHasPendingChanges={setHasPendingChanges} />

			<ErrorDialog error={error} setError={setError} />

			{previewImage && (
				<PreviewImage previewImage={previewImage} handlePreviewNavigation={handlePreviewNavigation} handleDownload={handleDownload} setPreviewImage={setPreviewImage} isDownloading={isDownloading} compressedFiles={compressedFiles} />
			)}
		</div>
	)
}
