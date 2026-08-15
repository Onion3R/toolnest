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
import { motion } from 'motion/react'
import { Button } from '../ui/button'
import { Settings2 } from 'lucide-react'
const items = [
  { label: "WebP", value: "WebP" },
  { label: "JPEG", value: "JPEG" },
  { label: "PNG", value: "PNG" },
]
function SideBar({ files, compressImage, settings, setSettings }: { files: File[], compressImage: (files: File[]) => void, settings: any, setSettings: React.Dispatch<React.SetStateAction<any>> }) {
  const quality = Number.isFinite(settings?.initialQuality) ? settings.initialQuality : 0.8

  return (
    <motion.aside
      animate={files.length > 0 ? { width: "25%" } : { width: "0%" }}
      className="fixed bottom-0 top-0 w-1/4  right-0 bg-accent ">
      <div className="p-4 flex justify-between h-full  flex-col w-full min-w-90 ">

        <FieldSet className="w-full ">

          <Tabs defaultValue="account" >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3  ">
                <Settings2 size={14} />
                <h1 >Settings</h1>

              </div>
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="advance">Advance</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="account">Make changes to your account here.</TabsContent>
            <TabsContent value="advance">
              <Field>
                <FieldLabel htmlFor="target_size">Target Size</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="inline-end-input"
                    type="text"
                    placeholder="0"
                    value={settings.maxSizeMB ?? ""}
                    onChange={(e) => setSettings({ ...settings, maxSizeMB: Number(e.target.value) })}
                  />
                  <InputGroupAddon align="inline-end">

                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Controls how small the resulting file should be.
                </FieldDescription>
              </Field>


              <Field>
                <FieldLabel htmlFor="quality"> Quality</FieldLabel>
                <Slider
                  value={[quality * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value: number | readonly number[]) => setSettings({ ...settings, initialQuality: Number(value) / 100 })}
                />
                <FieldDescription>
                  Controls how much visual quality to preserve.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="resolution">Maximum Resolution    </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="inline-end-input"
                    type="text"
                    placeholder="0"
                    value={settings.maxWidthOrHeight ?? ""}
                    onChange={(e) => setSettings({ ...settings, maxWidthOrHeight: Number(e.target.value) })}
                  />
                  <InputGroupAddon align="inline-end">

                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Controls the resolution.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="format">Format    </FieldLabel>
                <Select items={items} value={settings.format} onValueChange={(value) => setSettings({ ...settings, format: value })}>
                  <SelectTrigger className="w-45">
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
          </Tabs>

        </FieldSet>


        <Button size="lg" className="mt-4 w-full" onClick={() => compressImage(files)}>Compress Image</Button>
      </div>

    </motion.aside>
  )
}

export default SideBar