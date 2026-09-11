import React from 'react'
import { Slider } from "@/components/ui/slider"

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
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Settings2 } from 'lucide-react'
const items = [
  { label: "WebP", value: "WebP" },
  { label: "JPEG", value: "JPEG" },
  { label: "PNG", value: "PNG" },
]
function SideBar({ files, compressImage, settings, setSettings, isCompressing, hasPendingChanges, setHasPendingChanges }: { files: File[], compressImage: (files: File[]) => void, settings: any, setSettings: React.Dispatch<React.SetStateAction<any>>, isCompressing: boolean, hasPendingChanges: boolean, setHasPendingChanges: React.Dispatch<React.SetStateAction<boolean>> }) {
  const quality = Number.isFinite(settings?.initialQuality) ? settings.initialQuality : 0.8

  const hanldeOptionChange = (id: string, value: string | number) => {
    setSettings({ ...settings, [id]: value })
    if (hasPendingChanges) return
    setHasPendingChanges(true)
  }


  return (
    <motion.aside
      animate={files.length > 0 ? { x: 0 } : { x: 1000 }}
      className={` flex w-full flex-col bg-black lg:fixed lg:bottom-0 lg:right-0 lg:top-0 lg:flex lg:w-1/4 `}>
      <div className="flex h-full w-full flex-col justify-between p-4 md:p-6">

        <FieldSet className="w-full text-white ">

          {/* <Tabs defaultValue="account" > */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">
              <div className="p-1 bg-white rounded-xs text-black">
                <Settings2 size={15} />
              </div>
              <div>
                <h1 className="text-sm" >Settings</h1>
                <p className="text-xs text-muted-foreground">Adjust your image compression settings</p>
              </div>


            </div>
           
          </div>

          <Field>
            <FieldLabel htmlFor="quality"> Quality</FieldLabel>
            <Slider
              value={[quality * 100]}
              max={100}
              step={1}
              onValueChange={(value: number | readonly number[]) =>
                hanldeOptionChange('initialQuality', Number(value) / 100)}
              className=""
            />
            <FieldDescription>
              Controls how much visual quality to preserve {settings.initialQuality}.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="format">Format</FieldLabel>
            <Select items={items} value={settings.format} onValueChange={(value) => hanldeOptionChange('format', value)}>
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Format" />
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


        <Button size="lg" className="mt-4 w-full bg-white text-primary hover:bg-white/20! hover:text-white/70" onClick={() => compressImage(files)}
          disabled={!hasPendingChanges || isCompressing}>Compress Image</Button>
      </div>

    </motion.aside >
  )
}

export default SideBar

