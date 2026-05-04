import { cn } from '@/lib/utils'
import { forwardRef, type TextareaHTMLAttributes } from 'react'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }>(
  ({ className, label, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        id={id}
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none',
          className
        )}
        {...props}
      />
    </div>
  )
)

Textarea.displayName = 'Textarea'
export default Textarea
