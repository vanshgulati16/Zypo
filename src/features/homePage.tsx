import { useNavigate } from "react-router-dom"

export const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-w-full plasmo-bg-yellow-100">
      <div className="plasmo-bg-yellow-200 plasmo-p-3 plasmo-border-2 plasmo-border-black">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <svg className="plasmo-w-6 plasmo-h-6 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h1 className="plasmo-text-lg plasmo-font-bold plasmo-text-black">
            Zypo
          </h1>
        </div>
        <p className="plasmo-text-sm plasmo-text-black plasmo-mt-1">
          Select a tool to get started
        </p>
      </div>

      <div className="plasmo-flex plasmo-flex-col plasmo-gap-4 plasmo-p-4">
        <button 
          onClick={() => navigate("/convert")}
          className="plasmo-flex plasmo-items-start plasmo-gap-3 plasmo-p-4 plasmo-w-full
            plasmo-bg-pink-400 plasmo-rounded-md plasmo-border-2 plasmo-border-black
            hover:plasmo-translate-x-0.5 hover:plasmo-translate-y-0.5
            plasmo-shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
          <div className="plasmo-p-2.5 plasmo-rounded-md plasmo-bg-white plasmo-border-2 plasmo-border-black">
            <svg className="plasmo-w-5 plasmo-h-5 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="plasmo-text-left">
            <h2 className="plasmo-text-base plasmo-font-bold plasmo-text-black">
              Image Compressor
            </h2>
            <p className="plasmo-text-sm plasmo-text-black">
              Compress images without losing quality
            </p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/photo-editor")}
          className="plasmo-flex plasmo-items-start plasmo-gap-3 plasmo-p-4 plasmo-w-full
            plasmo-bg-cyan-400 plasmo-rounded-md plasmo-border-2 plasmo-border-black
            hover:plasmo-translate-x-0.5 hover:plasmo-translate-y-0.5
            plasmo-shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
          <div className="plasmo-p-2.5 plasmo-rounded-md plasmo-bg-white plasmo-border-2 plasmo-border-black">
            <svg className="plasmo-w-5 plasmo-h-5 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="plasmo-text-left">
            <h2 className="plasmo-text-base plasmo-font-bold plasmo-text-black">
              Image Editor
            </h2>
            <p className="plasmo-text-sm plasmo-text-black">
              Edit images with ease like remove background, change background color, etc.
            </p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/images-to-pdf")}
          className="plasmo-flex plasmo-items-start plasmo-gap-3 plasmo-p-4 plasmo-w-full
            plasmo-bg-purple-400 plasmo-rounded-md plasmo-border-2 plasmo-border-black
            hover:plasmo-translate-x-0.5 hover:plasmo-translate-y-0.5
            plasmo-shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
          <div className="plasmo-p-2.5 plasmo-rounded-md plasmo-bg-white plasmo-border-2 plasmo-border-black">
            <svg className="plasmo-w-5 plasmo-h-5 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div className="plasmo-text-left">
            <h2 className="plasmo-text-base plasmo-font-bold plasmo-text-black">
              Images to PDF
            </h2>
            <p className="plasmo-text-sm plasmo-text-black">
              Convert images to PDF
            </p>
          </div>
        </button>

        {/* Token Counter with Tooltip */}
        <div className="plasmo-relative plasmo-group plasmo-mt-2">
          <p className="plasmo-text-sm plasmo-text-gray-600 plasmo-font-medium plasmo-w-full plasmo-cursor-pointer">
            Tokens left: 50
          </p>
          <div className="plasmo-invisible group-hover:plasmo-visible 
            plasmo-absolute plasmo-left-0 plasmo-bottom-full plasmo-mb-2
            plasmo-bg-black plasmo-text-white plasmo-text-xs plasmo-font-medium
            plasmo-px-2 plasmo-py-1.5 plasmo-rounded-md
            plasmo-shadow-lg plasmo-z-10 plasmo-max-w-[180px]">
            Upgrade to premium for unlimited tokens and add on features
            <div className="plasmo-absolute plasmo-left-4 plasmo-top-full 
              plasmo-w-2 plasmo-h-2 plasmo-bg-black 
              plasmo-transform plasmo-rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
