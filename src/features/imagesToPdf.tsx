import { useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { useNavigate } from "react-router-dom"

export const ImagesToPdf = () => {
    const navigate = useNavigate()
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [isConverting, setIsConverting] = useState(false)
    const [error, setError] = useState("")
    const [pdfName, setPdfName] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        const imageFiles = files.filter(file => file.type.startsWith('image/'))
        
        if (imageFiles.length !== files.length) {
            setError("Please upload only image files")
            return
        }

        setSelectedImages(prev => [...prev, ...imageFiles])
        setError("")
        
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleRemoveImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
    }

    const createPdf = async () => {
        if (selectedImages.length === 0) return

        try {
            setIsConverting(true)
            setError("")

            // Create a new PDF document
            const pdfDoc = await PDFDocument.create()

            // Convert each image to bytes and embed in PDF
            for (const imageFile of selectedImages) {
                // Convert File to Uint8Array
                const imageBytes = await imageFile.arrayBuffer()
                
                let image
                if (imageFile.type === 'image/jpeg') {
                    image = await pdfDoc.embedJpg(imageBytes)
                } else if (imageFile.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes)
                } else {
                    continue // Skip unsupported formats
                }

                // Add a page for each image
                const page = pdfDoc.addPage([image.width, image.height])
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height
                })
            }

            // Save the PDF with custom name or default
            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = pdfName ? `${pdfName}.pdf` : 'combined-images.pdf'
            document.body.appendChild(a)
            a.click()

            // Cleanup
            URL.revokeObjectURL(url)
            document.body.removeChild(a)
            setSelectedImages([])
            setPdfName("")

        } catch (err) {
            console.error(err)
            setError("Failed to create PDF. Please try again.")
        } finally {
            setIsConverting(false)
        }
    }

    return (
        <div className="plasmo-flex plasmo-flex-col plasmo-h-[600px] plasmo-w-full plasmo-bg-yellow-100">
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
                            Images to PDF
                        </h1>
                        <p className="plasmo-text-sm plasmo-text-black plasmo-mt-1">
                            Convert multiple images into a single PDF
                        </p>
                    </div>
                    <div className="plasmo-w-8"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="plasmo-flex-1 plasmo-overflow-y-auto plasmo-p-4">
                <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-6">
                    {/* Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="plasmo-bg-white plasmo-text-black plasmo-font-bold
                            plasmo-py-3 plasmo-px-8 plasmo-rounded-xl plasmo-text-xl 
                            plasmo-border-4 plasmo-border-black
                            hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
                        Add Images
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="plasmo-hidden"
                    />

                    {error && (
                        <div className="plasmo-text-red-600 plasmo-font-bold plasmo-bg-white 
                            plasmo-px-4 plasmo-py-2 plasmo-rounded-lg plasmo-border-2 plasmo-border-black">
                            {error}
                        </div>
                    )}

                    {/* Selected Images */}
                    {selectedImages.length > 0 && (
                        <div className="plasmo-w-full plasmo-max-w-2xl">
                            {/* PDF Name Input */}
                            <div className="plasmo-mb-4 plasmo-flex plasmo-flex-col plasmo-gap-2">
                                <label className="plasmo-text-black plasmo-font-bold">
                                    PDF Name (optional)
                                </label>
                                <input
                                    type="text"
                                    value={pdfName}
                                    onChange={(e) => setPdfName(e.target.value.trim())}
                                    placeholder="Enter PDF name (default: combined-images)"
                                    className="plasmo-px-4 plasmo-py-2 plasmo-rounded-lg 
                                        plasmo-border-4 plasmo-border-black
                                        plasmo-bg-white plasmo-text-black
                                        focus:plasmo-outline-none focus:plasmo-ring-2 
                                        focus:plasmo-ring-black plasmo-transition-all"
                                />
                            </div>

                            <div className="plasmo-mt-6 plasmo-flex plasmo-justify-center">
                                <button
                                    onClick={createPdf}
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
                                            Creating PDF...
                                        </span>
                                    ) : 'Create PDF'}
                                </button>
                            </div>

                            <div className="plasmo-grid plasmo-grid-cols-2 md:plasmo-grid-cols-3 plasmo-gap-4 plasmo-mt-6">
                                {selectedImages.map((file, index) => (
                                    <div key={index} className="plasmo-relative plasmo-group">
                                        <div className="plasmo-aspect-w-1 plasmo-aspect-h-1 
                                            plasmo-bg-white plasmo-rounded-lg plasmo-border-4 plasmo-border-black
                                            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                            plasmo-overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Selected ${index + 1}`}
                                                className="plasmo-w-full plasmo-h-full plasmo-object-cover"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="plasmo-absolute plasmo-top-2 plasmo-right-2 
                                                    plasmo-bg-red-400 plasmo-rounded-lg plasmo-p-2
                                                    plasmo-opacity-0 group-hover:plasmo-opacity-100
                                                    plasmo-border-2 plasmo-border-black
                                                    plasmo-shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                                    hover:plasmo-shadow-none
                                                    hover:plasmo-translate-x-0.5 hover:plasmo-translate-y-0.5
                                                    plasmo-transition-all plasmo-duration-200">
                                                <svg className="plasmo-w-5 plasmo-h-5 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 