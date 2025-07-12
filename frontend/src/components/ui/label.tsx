import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const LabelWithValue = ({ 
  label, 
    classNameLabel, 
    value, 
    classNameValue
}: { 
  label: string, 
  classNameLabel?:string,
  value: any,
  classNameValue?:string,
}) => (
  <div className="flex flex-row justify-between items-start sm:items-center gap-2">
      <label className={`w-full ${classNameLabel}`}>{label}</label>
      <span className={`${classNameValue} text-blue-600 whitespace-nowrap`}>{value}</span>
  </div>
);

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
