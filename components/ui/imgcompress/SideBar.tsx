import React from 'react'
import { Slider } from "@/components/ui/slider"

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
import { Button } from '../button'
const items = [
  { label: "WebP", value: "WebP" },
  { label: "JPEG", value: "JPEG" },
  { label: "PNG", value: "PNG" },
]
function SideBar({ files, compressImage }: { files: File[], compressImage: (files: File[]) => void }) {
  return (
    <motion.aside
      animate={files.length === 0 ? { width: "25%" } : { width: "0%" }}
      className="fixed bottom-0 top-0 w-1/4  right-0 bg-accent ">
      <div className="p-4 flex-center flex-col">

        <FieldSet className="w-full max-w-xs">

          <Field>
            <FieldLabel htmlFor="target_size">Target Size</FieldLabel>
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
            <FieldLabel htmlFor="quality"> Quality</FieldLabel>
            <Slider defaultValue={[33]} max={100} step={1} />
            <FieldDescription>
              Set desired file size for compression.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="resolution">Maximum Resolution    </FieldLabel>
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
            <FieldLabel htmlFor="format">Format    </FieldLabel>
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
  )
}

export default SideBar