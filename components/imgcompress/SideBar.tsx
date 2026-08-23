import React from 'react'
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  FieldContent,
  FieldDescription,
  FieldGroup,
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
function SideBar({ files, compressImage, settings, setSettings, isCompressing, compressedFiles }: { files: File[], compressImage: (files: File[]) => void, settings: any, setSettings: React.Dispatch<React.SetStateAction<any>>, isCompressing: boolean, compressedFiles: { id: string, fileSize: number }[] }) {
  const quality = Number.isFinite(settings?.initialQuality) ? settings.initialQuality : 0.8

  return (
    <motion.aside
      className={`${files.length > 0 ? "flex" : "hidden"} w-full flex-col bg-accent lg:fixed lg:bottom-0 lg:right-0 lg:top-0 lg:flex lg:w-1/4`}>
      <div className="flex h-full w-full flex-col justify-between p-4 md:p-6">

        <FieldSet className="w-full ">

          <Tabs defaultValue="account" >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Settings2 size={14} />
                <h1 >Settings</h1>

              </div>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="advance" disabled={true}>Advance</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="account">

              <Field>
                <FieldLabel htmlFor="quality"> Quality</FieldLabel>
                <Slider
                  value={[quality * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value: number | readonly number[]) => setSettings({ ...settings, initialQuality: Number(value) / 100 })}
                />
                <FieldDescription>
                  Controls how much visual quality to preserve {settings.initialQuality}.
                </FieldDescription>
              </Field>
              <Field>
              <FieldLabel htmlFor="format">Format</FieldLabel>
                <Select items={items} value={settings.format} onValueChange={(value) => setSettings({ ...settings, format: value })}>
                    <SelectTrigger className="w-full sm:w-45">
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
            </TabsContent>
            <TabsContent value="advance">


            </TabsContent>
          </Tabs>

        </FieldSet>


        <Button size="lg" className="mt-4 w-full" onClick={() => compressImage(files)} disabled={compressedFiles.length === files.length || isCompressing}>Compress Image</Button>
      </div>

    </motion.aside >
  )
}

export default SideBar  