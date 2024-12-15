import React from 'react'
import { FileText, Image, Clock, Calendar, Tag, AlignLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface AnalysisProps {
  type: 'document' | 'image'
  fileName: string
  fileSize: string
  uploadDate: string
  processingTime: string
  contentType: string
  confidence: number
  description: string
}

const Analysis: React.FC<AnalysisProps> = ({
  type,
  fileName,
  fileSize,
  uploadDate,
  processingTime,
  contentType,
  confidence,
  description,
}) => {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'document' ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
          File Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">File Name:</span>
            <span className="text-sm">{fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">File Size:</span>
            <span className="text-sm">{fileSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Date:</span>
            <span className="text-sm">{uploadDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Processing Time:</span>
            <span className="text-sm">{processingTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Content Type:</span>
          <span className="text-sm">{contentType}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Confidence Score:</span>
            <span className="text-sm font-medium">{confidence}%</span>
          </div>
          <Progress value={confidence} className="w-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Description:</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default Analysis