import {
  FileImage, FileText, FileAudio, FileVideo, FileArchive,
  FileType2, FileSpreadsheet, FileBarChart2, File,
} from 'lucide-react'
import { getMimeCategory, FILE_COLORS } from '../lib/fileUtils'

const iconMap = {
  image:       FileImage,
  pdf:         FileType2,
  text:        FileText,
  audio:       FileAudio,
  video:       FileVideo,
  archive:     FileArchive,
  word:        FileText,
  excel:       FileSpreadsheet,
  powerpoint:  FileBarChart2,
  other:       File,
}

function FileIcon({ mimeType, name, size = 24, className = '' }) {
  const cat = getMimeCategory(mimeType, name)
  const Icon = iconMap[cat] || File
  const color = FILE_COLORS[cat] || FILE_COLORS.other

  return <Icon size={size} color={color} aria-hidden className={className} />
}

export default FileIcon
