import React, { useState } from 'react'
import { FileIcon as Document } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Analysis from './Analysis'

interface FileWithPath extends File {
  path?: string;
}

const DocumentUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [description, setDescription] = useState<string>('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
      setSuccess(false)
      setShowAnalysis(false)
    }
  }

  const handleUpload = () => {
    if (file) {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setSuccess(true)
          setShowAnalysis(true)
          speak(`Document ${file.name} uploaded and analyzed successfully`)
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
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Document className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, or TXT (MAX. 10MB)</p>
              </div>
              <input 
                id="document-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept=".pdf,.docx,.txt"
                aria-label="Upload document"
              />
            </label>
          </div>
          {file && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Selected file: {file.name}</p>
              <Button
                onClick={handleUpload}
                className="w-full"
                aria-label={`Upload ${file.name}`}
              >
                Upload Document
              </Button>
            </div>
          )}
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
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
            <div className="mt-4 text-primary dark:text-green-400" role="alert">
              <p>Document uploaded successfully!</p>
            </div>
          )}
        </CardContent>
      </Card>
      {showAnalysis && (
        <Analysis
          type="document"
          fileName={file?.name || ''}
          fileSize={`${(file?.size || 0) / 1024} KB`}
          uploadDate={new Date().toLocaleString()}
          processingTime="2.3 seconds"
          contentType={file?.type || ''}
          confidence={85}
          description='This document appears to be a ...'
        />
      )}
    </div>
  )
}

export default DocumentUpload