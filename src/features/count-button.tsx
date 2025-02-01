import { useReducer } from "react"

export const CountButton = () => {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <button
      onClick={() => increase()}
      type="button"
      className="plasmo-flex plasmo-flex-row plasmo-items-center plasmo-px-6 plasmo-py-3 
        plasmo-text-lg plasmo-rounded-xl plasmo-transition-all
        plasmo-bg-green-400 plasmo-border-4 plasmo-border-black plasmo-text-black
        hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
        plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:plasmo-shadow-none plasmo-duration-200">
      Count:
      <span className="plasmo-inline-flex plasmo-items-center plasmo-justify-center 
        plasmo-w-10 plasmo-h-6 plasmo-ml-3 plasmo-text-lg plasmo-font-bold 
        plasmo-rounded-full plasmo-bg-white plasmo-border-2 plasmo-border-black">
        {count}
      </span>
    </button>
  )
}
