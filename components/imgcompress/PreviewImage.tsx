import React from 'react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ChevronDown, ChevronUp, Download, ExternalLink, LoaderCircle, X } from 'lucide-react';
import { Separator } from '../ui/separator';
type PreviewImageProps = {
  previewImage: {
    url: string;
    index: number;
    fileName: string;
  },
  handlePreviewNavigation: (direction: 'prev' | 'next') => void,
  handleDownload: (fileName: string) => void,
  setPreviewImage: React.Dispatch<React.SetStateAction<{
    url: string;
    index: number;
    fileName: string;
  } | null>>,
  isDownloading: boolean,
  compressedFiles: any[]

}

function PreviewImage({ previewImage, handlePreviewNavigation, handleDownload, setPreviewImage, isDownloading, compressedFiles }: PreviewImageProps) {
  return (
    <div id='popup' className="fixed  inset-0 z-2 h-full w-full flex-center bg-black/60 backdrop-blur-sm ">
      <div className="flex gap-2 relative">
        <div id="preview-container" className="-ml-10 p-2 bg-background rounded max-w-100">
          <img src={previewImage?.url || ''} alt="Preview" />
        </div>


        <div className="absolute -left-20">
          <Button variant="secondary" onClick={() => setPreviewImage(null)}><X /></Button>
          <div className="flex flex-col  mt-4 bg-secondary rounded">


            <Tooltip >
              <TooltipTrigger render={<Button variant="ghost" onClick={() => handlePreviewNavigation('prev')} disabled={previewImage?.index === 0}><ChevronUp /></Button>} />
              <TooltipContent side={"left"}>
                <p>Prev</p>
              </TooltipContent>
            </Tooltip>
            <Separator className="bg-muted-foreground" />
            <Tooltip >
              <TooltipTrigger render={<Button variant="ghost" onClick={() => handlePreviewNavigation('next')} disabled={previewImage?.index === compressedFiles?.length - 1}><ChevronDown /></Button>} />
              <TooltipContent side={"left"}>
                <p>Next</p>
              </TooltipContent>
            </Tooltip>

          </div>

        </div>
        <div className="absolute -right-73 flex flex-col justify-end bottom-0 top-0  ">
          <div className="relative  h-70 w-70 bg-background p-3 rounded">
            <div className="flex gap-1">
              <Button ><ExternalLink /></Button>
              <Button className="flex-1 " onClick={() => handleDownload(previewImage?.fileName)} disabled={isDownloading}>
                {isDownloading ? <LoaderCircle className="animate-spin" /> : <Download />} Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewImage