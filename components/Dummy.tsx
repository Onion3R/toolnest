//  <Field>
//                 <FieldLabel htmlFor="target_size">Target Size</FieldLabel>
//                 <InputGroup>
//                   <InputGroupInput
//                     id="inline-end-input"
//                     type="text"
//                     placeholder="0"
//                     value={settings.maxSizeMB ?? ""}
//                     onChange={(e) => setSettings({ ...settings, maxSizeMB: Number(e.target.value) })}
//                   />
//                   <InputGroupAddon align="inline-end">

//                   </InputGroupAddon>
//                 </InputGroup>
//                 <FieldDescription>
//                   Controls how small the resulting file should be.
//                 </FieldDescription>
//               </Field>


//               <Field>
//                 <FieldLabel htmlFor="quality"> Quality</FieldLabel>
//                 <Slider
//                   value={[quality * 100]}
//                   max={100}
//                   step={1}
//                   onValueChange={(value: number | readonly number[]) => setSettings({ ...settings, initialQuality: Number(value) / 100 })}
//                 />
//                 <FieldDescription>
//                   Controls how much visual quality to preserve.
//                 </FieldDescription>
//               </Field>

//               <Field>
//                 <FieldLabel htmlFor="resolution">Maximum Resolution    </FieldLabel>
//                 <InputGroup>
//                   <InputGroupInput
//                     id="inline-end-input"
//                     type="text"
//                     placeholder="0"
//                     value={settings.maxWidthOrHeight ?? ""}
//                     onChange={(e) => setSettings({ ...settings, maxWidthOrHeight: Number(e.target.value) })}
//                   />
//                   <InputGroupAddon align="inline-end">

//                   </InputGroupAddon>
//                 </InputGroup>
//                 <FieldDescription>
//                   Controls the resolution.
//                 </FieldDescription>
//               </Field>
//               <Field>
//                 <FieldLabel htmlFor="format">Format    </FieldLabel>
//                 <Select items={items} value={settings.format} onValueChange={(value) => setSettings({ ...settings, format: value })}>
//                   <SelectTrigger className="w-45">
//                     <SelectValue placeholder="Format" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       {items.map((item) => (
//                         <SelectItem key={item.value} value={item.value}>
//                           {item.label}
//                         </SelectItem>
//                       ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//                 <FieldDescription>
//                   Set desired file size for compression.
//                 </FieldDescription>
//               </Field>