import { useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"

type EditMode = 'none' | 'remove-bg' | 'filter' | 'adjust'
type BgColor = 'transparent' | 'white' | 'red' | 'blue' | 'green' | 'yellow' | 'purple'

export const PhotoEditor = () => {
    const navigate = useNavigate()
    const [originalImage, setOriginalImage] = useState<File | null>(null)
    const [editedImage, setEditedImage] = useState<string | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string>("")
    const [editMode, setEditMode] = useState<EditMode>('none')
    const [bgColor, setBgColor] = useState<BgColor>('transparent')
    const [hasRemovedBg, setHasRemovedBg] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError("Please upload an image file")
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string)
            setOriginalImage(file)
            setEditedImage(null)
            setError("")
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveBackground = async () => {
        if (!originalImage) return
        setIsProcessing(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append('image_file', originalImage)
            formData.append('size', 'auto')
            formData.append('channels', 'rgba')
            formData.append('format', 'auto')

            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': process.env.PLASMO_PUBLIC_REMOVE_BG_API_KEY
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error('Failed to remove background')
            }

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setEditedImage(url)
            setHasRemovedBg(true)
            setBgColor('transparent')
        } catch (err) {
            console.error(err)
            setError("Failed to remove background. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleChangeBackground = async (selectedColor: BgColor) => {
        if (!originalImage || !hasRemovedBg) return
        setIsProcessing(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append('image_file', originalImage)
            formData.append('size', 'auto')
            formData.append('channels', 'rgba')
            formData.append('format', 'auto')
            formData.append('bg_color', selectedColor)

            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': process.env.PLASMO_PUBLIC_REMOVE_BG_API_KEY // Replace with your actual API key
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error('Failed to change background color')
            }

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setEditedImage(url)
            setBgColor(selectedColor)
        } catch (err) {
            console.error(err)
            setError("Failed to change background color. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!editedImage) return
        
        const a = document.createElement('a')
        a.href = editedImage
        a.download = `edited-${originalImage?.name || 'image.png'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const handleRemoveImage = () => {
        setOriginalImage(null)
        setEditedImage(null)
        setPreviewImage(null)
        setHasRemovedBg(false)
        setBgColor('transparent')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
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
                            Photo Editor
                        </h1>
                        <p className="plasmo-text-sm plasmo-text-black plasmo-mt-1">
                            Edit your photos with powerful tools
                        </p>
                    </div>
                    <div className="plasmo-w-8"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="plasmo-flex plasmo-flex-1 plasmo-p-4 plasmo-gap-4">
                {/* Tools Panel */}
                <div className="plasmo-w-48 plasmo-bg-pink-400 plasmo-rounded-xl plasmo-p-4 
                    plasmo-border-4 plasmo-border-black plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="plasmo-flex plasmo-flex-col plasmo-gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="plasmo-bg-white plasmo-text-black plasmo-font-bold
                                plasmo-py-2 plasmo-px-4 plasmo-rounded-lg 
                                plasmo-border-4 plasmo-border-black
                                hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                                plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
                            Upload Image
                        </button>

                        {originalImage && (
                            <>
                                <button
                                    onClick={handleRemoveBackground}
                                    disabled={isProcessing}
                                    className="plasmo-bg-purple-400 plasmo-text-black plasmo-font-bold
                                        plasmo-py-2 plasmo-px-4 plasmo-rounded-lg
                                        plasmo-border-4 plasmo-border-black
                                        hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                                        plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                        hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200
                                        disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed">
                                    Remove Background
                                </button>

                                <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
                                    <div className="plasmo-text-sm plasmo-font-bold plasmo-text-black">Background Color:</div>
                                    <div className="plasmo-grid plasmo-grid-cols-3 plasmo-gap-2">
                                        {[
                                            { name: 'transparent', style: 'plasmo-bg-white plasmo-bg-opacity-50' },
                                            { name: 'white', style: 'plasmo-bg-white' },
                                            { name: 'red', style: 'plasmo-bg-red-500' },
                                            { name: 'blue', style: 'plasmo-bg-blue-500' },
                                            { name: 'green', style: 'plasmo-bg-green-500' },
                                            { name: 'yellow', style: 'plasmo-bg-yellow-500' },
                                            { name: 'purple', style: 'plasmo-bg-purple-500' }
                                        ].map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => handleChangeBackground(color.name as BgColor)}
                                                disabled={isProcessing}
                                                className={`plasmo-w-full plasmo-h-8 plasmo-rounded-lg plasmo-border-2 plasmo-border-black
                                                    ${color.style}
                                                    hover:plasmo-translate-x-0.5 hover:plasmo-translate-y-0.5
                                                    plasmo-shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                                    hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200
                                                    disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed
                                                    ${bgColor === color.name ? 'plasmo-ring-2 plasmo-ring-black' : ''}`}
                                                title={color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {editedImage && (
                            <button
                                onClick={handleDownload}
                                className="plasmo-bg-green-400 plasmo-text-black plasmo-font-bold
                                    plasmo-py-2 plasmo-px-4 plasmo-rounded-lg
                                    plasmo-border-4 plasmo-border-black
                                    hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                                    plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                    hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
                                Download
                            </button>
                        )}
                    </div>
                </div>

                {/* Image Preview Area */}
                <div className="plasmo-flex-1 plasmo-bg-white plasmo-rounded-xl plasmo-p-4 
                    plasmo-border-4 plasmo-border-black plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {error && (
                        <div className="plasmo-text-red-600 plasmo-font-bold plasmo-bg-white 
                            plasmo-px-4 plasmo-py-2 plasmo-rounded-lg plasmo-border-2 plasmo-border-black
                            plasmo-mb-4">
                            {error}
                        </div>
                    )}

                    <div className="plasmo-flex plasmo-justify-center plasmo-items-center plasmo-h-full">
                        {!previewImage ? (
                            <div className="plasmo-text-center plasmo-text-gray-500">
                                <p className="plasmo-text-lg plasmo-font-medium">No image selected</p>
                                <p className="plasmo-text-sm">Upload an image to get started</p>
                            </div>
                        ) : (
                            <div className="plasmo-relative plasmo-w-full plasmo-h-full">
                                <img 
                                    src={editedImage || previewImage} 
                                    alt="Preview"
                                    className="plasmo-w-full plasmo-h-full plasmo-object-contain"
                                />
                                {/* Remove Image Button */}
                                <button
                                    onClick={handleRemoveImage}
                                    className="plasmo-absolute plasmo-top-2 plasmo-right-2 
                                        plasmo-bg-red-500 plasmo-text-white
                                        plasmo-w-8 plasmo-h-8 plasmo-rounded-lg
                                        plasmo-border-2 plasmo-border-black
                                        hover:plasmo-translate-x-0.5 hover:plasmo-translate-y-0.5
                                        plasmo-shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                        hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200
                                        plasmo-flex plasmo-items-center plasmo-justify-center">
                                    <svg 
                                        className="plasmo-w-5 plasmo-h-5" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24">
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M6 18L18 6M6 6l12 12" 
                                        />
                                    </svg>
                                </button>
                                {isProcessing && (
                                    <div className="plasmo-absolute plasmo-inset-0 plasmo-flex 
                                        plasmo-items-center plasmo-justify-center plasmo-bg-black/50">
                                        <div className="plasmo-text-white plasmo-flex plasmo-items-center plasmo-gap-2">
                                            <svg className="plasmo-animate-spin plasmo-h-5 plasmo-w-5" viewBox="0 0 24 24">
                                                <circle className="plasmo-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="plasmo-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                            </svg>
                                            Processing...
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="plasmo-hidden"
            />
        </div>
    )
} 