import { useEffect } from "react"
import { AlertCircle, X } from "lucide-react"

//Reusable Toast component for displaying messages
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000) 
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-5 right-5 bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 min-w-[320px]">
      <div className="flex-shrink-0 bg-yellow-500 rounded p-1">
        <AlertCircle className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 text-sm font-medium text-yellow-600">{message}</div>
      <button onClick={onClose} className="flex-shrink-0 text-yellow-600 hover:text-yellow-700 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

