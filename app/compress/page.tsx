"use client"
import { Upload, Image, X } from "lucide-react"
import React from "react"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { motion } from "motion/react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field"

const items = [
	{ label: "WebP", value: "WebP" },
	{ label: "JPEG", value: "JPEG" },
	{ label: "PNG", value: "PNG" },
]
export default function page() {
	const [isDragging, setIsDragging] = React.useState(false)
	const [files, setFiles] = React.useState<File[]>([])
	const [progress, setProgress] = React.useState(0);
	const [compressingFile, setCompressingFile] = React.useState<string | null>(null)

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

			onProgress: (progress: number) => {
				setProgress(progress);
			},
		};

		console.log('clicking')
		console.log('files', files)

		try {


			for (const file of files) {
				setCompressingFile(file.name);
				setProgress(0);

				const compressedFile = await imageCompression(file, options);

				const url = URL.createObjectURL(compressedFile);

				const link = document.createElement("a");
				link.href = url;
				link.download = `compressed-${file.name}`;

				link.click();

				URL.revokeObjectURL(url);
			}


			// Automatically download when compression finishes

		} catch (error) {
			console.error("Compression failed:", error);

		} finally {
			setCompressingFile(null);
			setProgress(0);
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
								Maximum files 5 • Format Supported JPEG, PNG, WEPT
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
											<Button variant="ghost" onClick={() => handleRemoveFile(idx)}>
												<X />
											</Button>

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
			<motion.aside
				animate={files.length === 0 ? { width: "25%" } : { width: "0%" }}
				className="fixed bottom-0 top-0 w-1/4  right-0 bg-accent ">
				<div className="p-4 flex-center flex-col">

					<FieldSet className="w-full max-w-xs">

						<Field>
							<FieldLabel htmlFor="feedback">Target Size</FieldLabel>
							<InputGroup>
								<InputGroupInput
									id="inline-end-input"
									type="text"
									placeholder="0"
								/>
								<InputGroupAddon align="inline-end">

								</InputGroupAddon>
							</InputGroup>
							<FieldDescription>
								Set desired file size for compression.
							</FieldDescription>
						</Field>


						<Field>
							<FieldLabel htmlFor="feedback"> Quality</FieldLabel>
							<Slider defaultValue={[33]} max={100} step={1} />
							<FieldDescription>
								Set desired file size for compression.
							</FieldDescription>
						</Field>

						<Field>
							<FieldLabel htmlFor="feedback">Maximum Resolution    </FieldLabel>
							<InputGroup>
								<InputGroupInput
									id="inline-end-input"
									type="text"
									placeholder="0"
								/>
								<InputGroupAddon align="inline-end">

								</InputGroupAddon>
							</InputGroup>
							<FieldDescription>
								Set desired file size for compression.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="feedback">Maximum Resolution    </FieldLabel>
							<Select items={items}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{items.map((item) => (
											<SelectItem key={item.value} value={item.value}>
												{item.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<FieldDescription>
								Set desired file size for compression.
							</FieldDescription>
						</Field>

					</FieldSet>


					<Button size="lg" className="mt-4 w-full" onClick={() => compressImage(files)}>Compress Image</Button>
				</div>

			</motion.aside>
		</div>
	)
}
