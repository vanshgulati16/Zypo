import { useNavigate } from "react-router-dom"

export const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-w-full plasmo-bg-yellow-100">
      <div className="plasmo-bg-yellow-200 plasmo-p-6 plasmo-border-4 plasmo-border-black">
        <h1 className="plasmo-text-3xl plasmo-font-bold plasmo-text-black">
          Zypo Image Tools
        </h1>
        <p className="plasmo-text-lg plasmo-text-black plasmo-mt-2">
          Select a tool to get started
        </p>
      </div>

      <div className="plasmo-flex plasmo-flex-col plasmo-gap-6 plasmo-p-8">
        <button 
          onClick={() => navigate("/convert")}
          className="plasmo-flex plasmo-items-center plasmo-gap-4 plasmo-p-6 
            plasmo-bg-pink-400 plasmo-rounded-xl plasmo-border-4 plasmo-border-black
            hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
          <div className="plasmo-p-4 plasmo-rounded-lg plasmo-bg-white plasmo-border-4 plasmo-border-black">
            <svg className="plasmo-w-8 plasmo-h-8 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="plasmo-text-xl plasmo-font-bold plasmo-text-black">
              Image Compressor
            </h2>
            <p className="plasmo-text-lg plasmo-text-black">
              Compress images without losing quality
            </p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/photo-editor")}
          className="plasmo-flex plasmo-items-center plasmo-gap-4 plasmo-p-6 
            plasmo-bg-cyan-400 plasmo-rounded-xl plasmo-border-4 plasmo-border-black
            hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
          <div className="plasmo-p-4 plasmo-rounded-lg plasmo-bg-white plasmo-border-4 plasmo-border-black">
            <svg className="plasmo-w-8 plasmo-h-8 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="plasmo-text-xl plasmo-font-bold plasmo-text-black">
              Image Editor
            </h2>
            <p className="plasmo-text-lg plasmo-text-black">
              Edit images with ease like remove background, change background color, etc.
            </p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/images-to-pdf")}
          className="plasmo-flex plasmo-items-center plasmo-gap-4 plasmo-p-6 
            plasmo-bg-purple-400 plasmo-rounded-xl plasmo-border-4 plasmo-border-black
            hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
          <div className="plasmo-p-4 plasmo-rounded-lg plasmo-bg-white plasmo-border-4 plasmo-border-black">
            <svg className="plasmo-w-8 plasmo-h-8 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h2 className="plasmo-text-xl plasmo-font-bold plasmo-text-black">
              Images to PDF
            </h2>
            <p className="plasmo-text-lg plasmo-text-black">
              Convert images to PDF
            </p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/count")}
          className="plasmo-flex plasmo-items-center plasmo-gap-4 plasmo-p-6 
            plasmo-bg-purple-400 plasmo-rounded-xl plasmo-border-4 plasmo-border-black
            hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
          <div className="plasmo-p-4 plasmo-rounded-lg plasmo-bg-white plasmo-border-4 plasmo-border-black">
            <svg className="plasmo-w-8 plasmo-h-8 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h2 className="plasmo-text-xl plasmo-font-bold plasmo-text-black">
              Counter
            </h2>
            <p className="plasmo-text-lg plasmo-text-black">
              Simple counter tool
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
