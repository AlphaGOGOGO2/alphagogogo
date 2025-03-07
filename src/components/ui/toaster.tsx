
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="group flex gap-3 items-start border bg-white shadow-lg p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
              <span className="text-lg text-white">
                {action ? '🔗' : 'ℹ️'}
              </span>
            </div>
            <div className="grid gap-1 flex-1">
              {title && <ToastTitle className="text-lg font-semibold text-gray-800">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-sm text-gray-600">{description}</ToastDescription>
              )}
              {action && <div className="mt-3">{action}</div>}
            </div>
            <ToastClose className="absolute right-2 top-2 p-1 rounded-md text-gray-400 opacity-0 transition-opacity hover:text-gray-800 group-hover:opacity-100" />
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}
