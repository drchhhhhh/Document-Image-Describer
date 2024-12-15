import React, { useState } from 'react'
import { Image } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Analysis from './Analysis'

const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      setSuccess(false)
      setShowAnalysis(false)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = () => {
    if (file) {
      // Simulating upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setSuccess(true)
          setShowAnalysis(true)
          speak(`Image ${file.name} uploaded and analyzed successfully`)
        }
      }, 500)
    }
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Image className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, or GIF (MAX. 5MB)</p>
              </div>
              <input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*"
                aria-label="Upload image"
              />
            </label>
          </div>
          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
            </div>
          )}
          {file && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Selected file: {file.name}</p>
              <Button
                onClick={handleUpload}
                className="w-full"
                aria-label={`Upload ${file.name}`}
              >
                Upload Image
              </Button>
            </div>
          )}
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uploading: {progress}%</p>
            </div>
          )}
          {success && (
            <div className="mt-4 text-green-500 dark:text-green-400" role="alert">
              <p>Image uploaded successfully!</p>
            </div>
          )}
        </CardContent>
      </Card>
      {showAnalysis && (
        <Analysis
          type="image"
          fileName={file?.name || ''}
          fileSize={`${(file?.size || 0) / 1024} KB`}
          uploadDate={new Date().toLocaleString()}
          processingTime="1.8 seconds"
          contentType={file?.type || ''}
          confidence={92}
          description='This image appears to be a ...'
        />
      )}
    </div>
  )
}

export default ImageUpload