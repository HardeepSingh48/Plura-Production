'use client'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  LucideImageDown,
} from 'lucide-react'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEditor } from '@/providers/editor/editor-provider'
import { Slider } from '@/components/ui/slider'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';



const SettingsTab = () => {
  const { state, dispatch } = useEditor()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id
    let value = e.target.value

    if (styleSettings === 'backgroundImage') {
      const trimmed = value.trim()

      if (!trimmed.startsWith('url(')) {
        value = `url('${trimmed}')`
      }
    }

    const styleObject = {
      [styleSettings]: value,
    }

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id
    let value = e.target.value

    // Handle YouTube watch?v=... to embed conversion
    if (settingProperty === 'src') {
      const watchPattern = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
      const shortPattern = /(?:https?:\/\/)?youtu\.be\/([^?&]+)/;
      const match = value.match(watchPattern) || value.match(shortPattern);

      if (match) {
        const videoId = match[1]
        value = `https://www.youtube.com/embed/${videoId}`
      }
    }

    const styleObject = {
      [settingProperty]: value,
    }

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    })
  }

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={['Typography', 'Dimensions', 'Decorations', 'Flexbox']}
    >
      <AccordionItem
        value="Custom"
        className="px-6 py-0  "
      >
        <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
        <AccordionContent>
          {state.editor.selectedElement.type === 'link' &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Link Path</p>
                <Input
                  id="href"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.href}
                />
              </div>
            )}
          {state.editor.selectedElement.type === 'video' &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Video Link Path</p>
                <Input
                  id="src"
                  placeholder="https:youtube.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.src}
                />
              </div>
            )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Typography"
        className="px-6 py-0  border-y-[1px]"
      >
        <AccordionTrigger className="!no-underline">
          Typography
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 ">
          <div className="flex flex-col gap-2 ">
            <p className="text-muted-foreground">Text Align</p>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'textAlign',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.textAlign}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="left"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignLeft size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="right"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignRight size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="center"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignCenter size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="justify"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                >
                  <AlignJustify size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Font Family</p>
            <Input
              id="DM Sans"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.fontFamily}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Color</p>
            <Input
              id="color"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.color}
            />
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Weight</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: 'font-weight',
                      value: e,
                    },
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Font Weights</SelectLabel>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="normal">Regular</SelectItem>
                    <SelectItem value="lighter">Light</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <Input
                placeholder="px"
                id="fontSize"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.fontSize}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Dimensions"
        className=" px-6 py-0 "
      >
        <AccordionTrigger className="!no-underline">
          Dimensions
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Height</Label>
                    <Input
                      id="height"
                      placeholder="px"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.height}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Width</Label>
                    <Input
                      placeholder="px"
                      id="width"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.width}
                    />
                  </div>
                </div>
              </div>
              <p>Margin px</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      id="marginTop"
                      placeholder="px"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginTop}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="marginBottom"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginBottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="marginLeft"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginLeft}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="marginRight"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginRight}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Padding px</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      placeholder="px"
                      id="paddingTop"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingTop}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="paddingBottom"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingBottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="paddingLeft"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingLeft}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="paddingRight"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingRight}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Decorations"
        className="px-6 py-0 "
      >
        <AccordionTrigger className="!no-underline">
          Decorations
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <div>
            <Label className="text-muted-foreground">Opacity</Label>
            <div className="flex items-center justify-end">
              <small className="p-2">
                {typeof state.editor.selectedElement.styles?.opacity ===
                  'number'
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                    (
                      state.editor.selectedElement.styles?.opacity || '0'
                    ).replace('%', '')
                  ) || 0}
                %
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'opacity',
                    value: `${e[0]}%`,
                  },
                })
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.opacity === 'number'
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                    (
                      state.editor.selectedElement.styles?.opacity || '0'
                    ).replace('%', '')
                  ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Border Radius</Label>
            <div className="flex items-center justify-end">
              <small className="">
                {typeof state.editor.selectedElement.styles?.borderRadius ===
                  'number'
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                    (
                      state.editor.selectedElement.styles?.borderRadius || '0'
                    ).replace('px', '')
                  ) || 0}
                px
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'borderRadius',
                    value: `${e[0]}px`,
                  },
                })
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.borderRadius ===
                  'number'
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                    (
                      state.editor.selectedElement.styles?.borderRadius || '0'
                    ).replace('%', '')
                  ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Color</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">
              <div
                className="w-12 "
                style={{
                  backgroundColor:
                    state.editor.selectedElement.styles.backgroundColor,
                }}
              />
              <Input
                placeholder="#HFI245"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundColor"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.backgroundColor}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Image</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">
              <div
                className="w-12 "
                style={{
                  backgroundImage:
                    state.editor.selectedElement.styles.backgroundImage,
                }}
              />
              <Input
                placeholder="url()"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundImage"
                onChange={handleOnChanges}
                value={
                  state.editor.selectedElement.styles.backgroundImage
                    ?.replace(/^url\(['"]?/, '') // remove url('
                    ?.replace(/['"]?\)$/, '')    // remove ')
                  ?? ''
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Image Position</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'backgroundSize',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.backgroundSize?.toString()}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value="cover"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <ChevronsLeftRightIcon size={18} />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Cover – fill the container</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value="contain"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <AlignVerticalJustifyCenter size={22} />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">Contain – fit without cropping</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger
                        value="auto"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                        <LucideImageDown size={18} />
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs z-[9999]">Auto – use image&apos;s original size</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TabsList>
            </Tabs>

          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Flexbox"
        className="px-6 py-0  "
      >
        <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
        <AccordionContent>
          <Label className="text-muted-foreground">Justify Content</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: 'justifyContent',
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.justifyContent}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              {[
                {
                  value: 'space-between',
                  icon: <AlignHorizontalSpaceBetween size={18} />,
                  label: 'Space between',
                },
                {
                  value: 'space-evenly',
                  icon: <AlignHorizontalSpaceAround size={18} />,
                  label: 'Space evenly',
                },
                {
                  value: 'center',
                  icon: <AlignHorizontalJustifyCenterIcon size={18} />,
                  label: 'Center',
                },
                {
                  value: 'start',
                  icon: <AlignHorizontalJustifyStart size={18} />,
                  label: 'Start',
                },
                {
                  value: 'end',
                  icon: <AlignHorizontalJustifyEndIcon size={18} />,
                  label: 'End',
                },
              ].map(({ value, icon, label }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value={value}
                      className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                    >
                      {icon}
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8} className="z-[9999] text-xs">
                    {label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TabsList>
          </Tabs>
          <Label className="text-muted-foreground pt-3 pb-3">Align Items</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: 'alignItems',
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.alignItems}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              {[
                {
                  value: 'center',
                  icon: <AlignVerticalJustifyCenter size={18} />,
                  label: 'Center',
                },
                {
                  value: 'normal',
                  icon: <AlignVerticalJustifyStart size={18} />,
                  label: 'Start',
                },
              ].map(({ value, icon, label }) => (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value={value}
                      className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                    >
                      {icon}
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={8} className="z-[9999] text-xs">
                    {label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 p-3">
            <Input
              className="h-4 w-4"
              placeholder="px"
              type="checkbox"
              id="display"
              checked={state.editor.selectedElement.styles.display === 'flex'}
              onChange={(va) => {
                handleOnChanges({
                  target: {
                    id: 'display',
                    value: va.target.checked ? 'flex' : 'block',
                  },
                })
              }}
            />
            <Label className="text-muted-foreground">Flex</Label>
          </div>
          <div>
            <Label className="text-muted-foreground"> Direction</Label>
            <Input
              placeholder="px"
              id="flexDirection"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.flexDirection}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default SettingsTab
