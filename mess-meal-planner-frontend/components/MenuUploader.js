'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Camera, Loader, FileText, Image as ImageIcon } from 'lucide-react'

export default function MenuUploader({ onUpload, isAnalyzing }) {
  const [preview, setPreview] = useState(null)
  const [fileType, setFileType] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    
    if (!file) return
    
    // Determine file type
    const isPDF = file.type === 'application/pdf'
    setFileType(isPDF ? 'pdf' : 'image')
    
    // Create preview for images only
    if (!isPDF) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
    
    // Upload file
    onUpload(file)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10485760 // 10MB
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        
        {isAnalyzing ? (
          <div className="space-y-4">
            <Loader className="h-16 w-16 mx-auto text-blue-500 animate-spin" />
            <p className="text-lg font-medium text-gray-700">Analyzing menu...</p>
            <p className="text-sm text-gray-500">
              {fileType === 'pdf' ? 'Extracting text from PDF...' : 'Extracting food items and calculating macros...'}
            </p>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Menu preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
            <p className="text-sm text-gray-600">Click or drag to upload a different file</p>
          </div>
        ) : fileType === 'pdf' ? (
          <div className="space-y-4">
            <FileText className="h-16 w-16 mx-auto text-red-500" />
            <p className="text-lg font-medium text-gray-700">PDF uploaded successfully!</p>
            <p className="text-sm text-gray-600">Click or drag to upload a different file</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <ImageIcon className="h-12 w-12 text-blue-400" />
              <FileText className="h-12 w-12 text-red-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop menu image or PDF here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPG, PNG images and PDF files (Max 10MB)
              </p>
            </div>
            <button className="mt-4 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="h-5 w-5 mr-2" />
              Choose File
            </button>
          </div>
        )}
      </div>

      {/* File type indicator */}
      {fileType && !isAnalyzing && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          {fileType === 'pdf' ? (
            <>
              <FileText className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-600">PDF file detected</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">Image file detected</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}