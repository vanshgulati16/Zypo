import {useRef, useState, useEffect} from 'react';
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom"

type SizeUnit = 'MB' | 'KB'

export const ConvertFormat = () => {
    const navigate = useNavigate()
    const [compressedLink, setCompressedLink] = useState<string>("");
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalLink, setOriginalLink] = useState<string>("");
    const [clicked, setClicked] = useState<boolean>(false);
    const [uploadImage, setUploadImage] = useState<boolean>(false);
    const [outputFileName, setOutputFileName] = useState<string>("");
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [compressedSize, setCompressedSize] = useState<number>(0)
    const [targetSize, setTargetSize] = useState<number>(1)
    const [sizeUnit, setSizeUnit] = useState<SizeUnit>('MB')
    const [customSize, setCustomSize] = useState<boolean>(false)
    const [compressionQuality, setCompressionQuality] = useState<number>(80)
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
    }

    const uploadLink = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const imageFile = event.target.files?.[0]
        if (!imageFile) return
        
        const objectUrl = URL.createObjectURL(imageFile)
        setOriginalLink(objectUrl)
        setOriginalImage(imageFile)
        setOutputFileName(`compressed-${imageFile.name}`)
        setUploadImage(true)
        setClicked(false)
        setCompressedLink("")
    }

    const handleCompression = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault()
        if (!originalImage) return

        // Convert target size to MB for compression
        const sizeInMB = sizeUnit === 'MB' ? targetSize : targetSize / 1024
        const targetSizeInBytes = sizeInMB * 1024 * 1024

        const compressionPasses = [
            { quality: compressionQuality / 100, width: 1920 }, // Initial pass with user quality
            { quality: 0.5, width: 1600 },                      // Medium compression
            { quality: 0.3, width: 1280 },                      // High compression
            { quality: 0.1, width: 1024 },                      // Very high compression
            { quality: 0.05, width: 800 }                       // Maximum compression
        ]

        try {
            setIsConverting(true)
            let compressedImage = originalImage
            let result = null

            // Try each compression pass until target size is reached
            for (const pass of compressionPasses) {
                const options = {
                    maxSizeMB: customSize ? sizeInMB : 3,
                    maxWidthOrHeight: pass.width,
                    useWebWorker: true,
                    initialQuality: pass.quality,
                }

                result = await imageCompression(compressedImage, options)
                
                // If we've reached target size or this isn't a custom size compression, stop
                if (!customSize || result.size <= targetSizeInBytes) {
                    break
                }
                
                // Use the result as input for next pass if needed
                compressedImage = result
            }

            if (result) {
                const downloadLink = URL.createObjectURL(result)
                setCompressedLink(downloadLink)
                setCompressedSize(result.size)
                setClicked(true)
            }
        } catch (error) {
            console.error("Compression failed:", error)
        } finally {
            setIsConverting(false)
        }
    }

    const handleSizeChange = (value: number) => {
        // Set minimum values based on unit
        const minSize = sizeUnit === 'MB' ? 0.1 : 100
        setTargetSize(Math.max(minSize, value))
    }

    const handleDeleteImage = () => {
        // Cleanup URLs
        if (originalLink) URL.revokeObjectURL(originalLink)
        if (compressedLink) URL.revokeObjectURL(compressedLink)
        
        // Reset all states
        setOriginalLink("")
        setOriginalImage(null)
        setOutputFileName("")
        setUploadImage(false)
        setCompressedLink("")
        setCompressedSize(0)
        setClicked(false)
    }

    useEffect(() => {
        return () => {
            if (originalLink) URL.revokeObjectURL(originalLink)
            if (compressedLink) URL.revokeObjectURL(compressedLink)
        }
    }, [originalLink, compressedLink])

    return (
        <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-w-full plasmo-bg-yellow-100">
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
                            Image Compressor
                        </h1>
                        <p className="plasmo-text-sm plasmo-text-black plasmo-mt-1">
                            Compress your images without losing quality
                        </p>
                    </div>
                    <div className="plasmo-w-8"></div>
                </div>
            </div>

            {/* Upload Section */}
            {!uploadImage && (
                <div className="plasmo-flex plasmo-justify-center plasmo-items-center plasmo-flex-1 plasmo-p-8">
                    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-6 
                        plasmo-p-8 plasmo-bg-pink-400 plasmo-rounded-xl plasmo-border-4 plasmo-border-black
                        plasmo-shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="plasmo-p-6 plasmo-bg-white plasmo-rounded-full plasmo-border-4 plasmo-border-black">
                            <svg className="plasmo-w-16 plasmo-h-16 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="plasmo-bg-white plasmo-text-black plasmo-font-bold
                                plasmo-py-3 plasmo-px-8 plasmo-rounded-xl plasmo-text-xl 
                                plasmo-border-4 plasmo-border-black
                                hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                                plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200">
                            Upload Image
                        </button>
                        <p className="plasmo-text-lg plasmo-font-medium plasmo-text-black">
                            Supported formats: JPG, PNG, WEBP
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={uploadLink}
                            className="plasmo-hidden"
                        />
                    </div>
                </div>
            )}

            {/* Image Preview Section */}
            {uploadImage && (
                <div className="plasmo-flex-1 plasmo-overflow-y-auto plasmo-p-4">
                    <div className="plasmo-flex plasmo-flex-col md:plasmo-flex-row plasmo-gap-6 plasmo-justify-center">
                        {/* Original Image Card */}
                        <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3">
                            <div className="plasmo-relative plasmo-group plasmo-w-[200px] plasmo-h-[200px] 
                                plasmo-bg-white plasmo-rounded-xl plasmo-border-4 plasmo-border-black
                                plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="plasmo-w-full plasmo-h-full plasmo-overflow-hidden">
                                    <img 
                                        src={originalLink} 
                                        alt="Original" 
                                        className="plasmo-w-full plasmo-h-full plasmo-object-contain"
                                    />
                                </div>
                                {/* Delete button overlay */}
                                <button
                                    onClick={handleDeleteImage}
                                    className="plasmo-absolute plasmo-top-2 plasmo-right-2 plasmo-bg-red-400 
                                        plasmo-rounded-lg plasmo-p-2 plasmo-opacity-0 group-hover:plasmo-opacity-100 
                                        plasmo-border-2 plasmo-border-black plasmo-shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                        hover:plasmo-shadow-none hover:plasmo-translate-x-0.5 hover:plasmo-translate-y-0.5
                                        plasmo-transition-all plasmo-duration-200 plasmo-z-10">
                                    <svg className="plasmo-w-5 plasmo-h-5 plasmo-text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-2">
                                <div className="plasmo-text-lg plasmo-font-bold plasmo-text-black">Original Image</div>
                                <div className="plasmo-text-lg plasmo-text-black">
                                    Size: {originalImage && formatFileSize(originalImage.size)}
                                </div>
                            </div>
                        </div>

                        {/* Compress Button and Size Options */}
                        {!clicked && (
                            <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-self-center plasmo-gap-4">
                                <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                                    <input
                                        type="checkbox"
                                        id="customSize"
                                        checked={customSize}
                                        onChange={(e) => setCustomSize(e.target.checked)}
                                        className="plasmo-w-4 plasmo-h-4 plasmo-rounded plasmo-border-black"
                                    />
                                    <label htmlFor="customSize" className="plasmo-text-black plasmo-font-medium">
                                        Custom Size
                                    </label>
                                </div>

                                {customSize && (
                                    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-4">
                                        <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-2">
                                            <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                                                <input
                                                    type="number"
                                                    value={targetSize}
                                                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                                                    min={sizeUnit === 'MB' ? 0.01 : 10}
                                                    step={sizeUnit === 'MB' ? 0.01 : 10}
                                                    className="plasmo-w-24 plasmo-px-2 plasmo-py-1 plasmo-rounded-lg 
                                                        plasmo-border-2 plasmo-border-black plasmo-text-center"
                                                />
                                                <select
                                                    value={sizeUnit}
                                                    onChange={(e) => setSizeUnit(e.target.value as SizeUnit)}
                                                    className="plasmo-px-2 plasmo-py-1 plasmo-rounded-lg 
                                                        plasmo-border-2 plasmo-border-black plasmo-bg-white">
                                                    <option value="MB">MB</option>
                                                    <option value="KB">KB</option>
                                                </select>
                                            </div>
                                            <span className="plasmo-text-sm plasmo-text-black">
                                                Min: {sizeUnit === 'MB' ? '0.01 MB' : '10 KB'}
                                            </span>
                                        </div>

                                        <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-2">
                                            <label className="plasmo-text-sm plasmo-font-bold plasmo-text-black">
                                                Initial Compression Quality: {compressionQuality}%
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={compressionQuality}
                                                onChange={(e) => setCompressionQuality(Number(e.target.value))}
                                                className="plasmo-w-full plasmo-h-2 plasmo-bg-white plasmo-rounded-lg 
                                                    plasmo-appearance-none plasmo-cursor-pointer
                                                    plasmo-border-2 plasmo-border-black"
                                            />
                                            <div className="plasmo-flex plasmo-justify-between plasmo-w-full plasmo-text-xs plasmo-text-black">
                                                <span>Maximum Compression</span>
                                                <span>Best Quality</span>
                                            </div>
                                            <span className="plasmo-text-xs plasmo-text-gray-600 plasmo-text-center">
                                                Note: Multiple compression passes may be used to reach target size
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleCompression}
                                    disabled={isConverting}
                                    className="plasmo-bg-green-400 plasmo-text-black plasmo-font-bold
                                        plasmo-py-3 plasmo-px-6 plasmo-rounded-xl
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
                                            Compressing...
                                        </span>
                                    ) : 'Compress Image'}
                                </button>
                            </div>
                        )}

                        {/* Compressed Image Card */}
                        <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3">
                            <div className="plasmo-w-[200px] plasmo-h-[200px] 
                                plasmo-bg-white plasmo-rounded-xl plasmo-border-4 plasmo-border-black
                                plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {compressedLink ? (
                                    <img 
                                        src={compressedLink} 
                                        alt="Compressed" 
                                        className="plasmo-w-full plasmo-h-full plasmo-object-contain"
                                    />
                                ) : (
                                    <div className="plasmo-w-full plasmo-h-full plasmo-flex plasmo-items-center 
                                        plasmo-justify-center plasmo-text-black plasmo-text-lg plasmo-text-center plasmo-p-4
                                        plasmo-font-medium">
                                        Compressed image will appear here
                                    </div>
                                )}
                            </div>
                            {clicked && (
                                <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-2">
                                    <div className="plasmo-text-lg plasmo-font-bold plasmo-text-black">Compressed Image</div>
                                    <div className="plasmo-text-lg plasmo-text-black">
                                        Size: {formatFileSize(compressedSize)}
                                    </div>
                                    <div className="plasmo-text-lg plasmo-font-bold plasmo-text-green-600">
                                        Reduced by {((originalImage?.size ?? 0 - compressedSize) / (originalImage?.size ?? 1) * 100).toFixed(1)}%
                                    </div>
                                    <a
                                    href={compressedLink}
                                    download={outputFileName}
                                        className="plasmo-bg-purple-400 plasmo-text-black plasmo-font-bold
                                            plasmo-py-2 plasmo-px-6 plasmo-rounded-lg
                                            plasmo-border-4 plasmo-border-black
                                            hover:plasmo-translate-x-1 hover:plasmo-translate-y-1
                                            plasmo-shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                            hover:plasmo-shadow-none plasmo-transition-all plasmo-duration-200
                                            plasmo-flex plasmo-items-center plasmo-gap-2">
                                        <svg className="plasmo-w-5 plasmo-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}