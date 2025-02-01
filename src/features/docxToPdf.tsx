import { useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"

export const DocxToPdf = () => {
    const navigate = useNavigate()
    const [isConverting, setIsConverting] = useState<boolean>(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [error, setError] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.name.endsWith('.docx')) {
            setError("Please upload a .docx file")
            return
        }

        setUploadedFile(file)
        setError("")
    }

    const handleConversion = async () => {
        if (!uploadedFile) return

        setIsConverting(true)
        setError("")

        const formData = new FormData()
        formData.append('docxFile', uploadedFile)

        try {
            const response = await fetch('http://localhost:3000/convert', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || 'Conversion failed')
            }

            // Get the blob from the response
            const blob = await response.blob()
            
            // Create a download link with 'converted-' prefix
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `converted-${uploadedFile.name.replace('.docx', '.pdf')}`
            document.body.appendChild(a)
            a.click()
            
            // Cleanup
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            setUploadedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            
        } catch (err) {
            setError(err.message || "Failed to convert file. Please try again.")
            console.error(err)
        } finally {
            setIsConverting(false)
        }
    }

    return (
        <div className="plasmo-flex plasmo-flex-col plasmo-h-[600px] plasmo-w-[800px] plasmo-bg-yellow-100">
            {/* Header */}
            <div className="plasmo-bg-yellow-200 plasmo-p-4 plasmo-border-b-4 plasmo-border-black">
                <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
                    <button 
                        onClick={() => navigate("/")}
                        className="plasmo-p-2 plasmo-bg-white plasmo-rounded-lg plasmo-border-4 plasmo-border-black
                            hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
                        <svg className="plasmo-w-5 plasmo-h-5 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div className="plasmo-flex-1 plasmo-text-center">
                        <h1 className="plasmo-text-xl plasmo-font-bold plasmo-text-black">
                            DOCX to PDF Converter
                        </h1>
                        <p className="plasmo-text-sm plasmo-text-black plasmo-mt-1">
                            Convert Word documents to PDF format
                        </p>
                    </div>
                    <div className="plasmo-w-8"></div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="plasmo-flex plasmo-justify-center plasmo-items-center plasmo-flex-1 plasmo-p-8">
                <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-6 
                    plasmo-p-8 plasmo-bg-pink-400 plasmo-rounded-xl plasmo-border-4 plasmo-border-black
                    plasmo-shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    
                    <div className="plasmo-p-6 plasmo-bg-white plasmo-rounded-full plasmo-border-4 plasmo-border-black">
                        <svg className="plasmo-w-16 plasmo-h-16 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>

                    {error && (
                        <div className="plasmo-text-red-600 plasmo-font-bold plasmo-bg-white 
                            plasmo-px-4 plasmo-py-2 plasmo-rounded-lg plasmo-border-2 plasmo-border-black">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="plasmo-bg-white plasmo-text-black plasmo-font-bold
                            plasmo-py-3 plasmo-px-8 plasmo-rounded-xl plasmo-text-xl 
                            plasmo-border-4 plasmo-border-black
                            hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
                        {uploadedFile ? 'Change File' : 'Upload DOCX'}
                    </button>

                    {uploadedFile && (
                        <div className="plasmo-text-lg plasmo-font-medium plasmo-text-black">
                            Selected: {uploadedFile.name}
                        </div>
                    )}

                    {uploadedFile && (
                        <button
                            onClick={handleConversion}
                            disabled={isConverting}
                            className="plasmo-bg-green-400 plasmo-text-black plasmo-font-bold
                                plasmo-py-3 plasmo-px-8 plasmo-rounded-xl
                                plasmo-border-4 plasmo-border-black
                                hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                                plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200
                                disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed
                                disabled:plasmo-transform-none disabled:plasmo-shadow-none">
                            {isConverting ? (
                                <span className="plasmo-flex plasmo-items-center plasmo-gap-2">
                                    <svg className="plasmo-animate-spin plasmo-h-5 plasmo-w-5" viewBox="0 0 24 24">
                                        <circle className="plasmo-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="plasmo-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Converting...
                                </span>
                            ) : 'Convert to PDF'}
                        </button>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".docx"
                        onChange={handleFileUpload}
                        className="plasmo-hidden"
                    />

                    <p className="plasmo-text-lg plasmo-font-medium plasmo-text-black">
                        Supported format: DOCX
                    </p>
                </div>
            </div>
        </div>
    )
}
