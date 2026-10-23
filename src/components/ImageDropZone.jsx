import { useRef, useState } from 'react'
import { uploadImage } from '../services/api'
import '../css/image-dropzone.css'

/**
 * Drag-and-drop (or click-to-browse) image picker.
 * The chosen image is uploaded right away; `onChange` receives the S3 URL.
 *
 * Props:
 *   value             current image URL ('' if none)
 *   onChange(url)     called after a successful upload, or with '' when removed
 *   onBusyChange(bool) optional; true while an upload is running (use it to disable Save)
 */
export default function ImageDropzone ({ value, onChange, onBusyChange }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const setBusy = busy => {
    setIsUploading(busy)
    onBusyChange?.(busy)
  }

  const handleFile = async file => {
    if (!file) return
    setError('')
    setBusy(true)
    try {
      onChange(await uploadImage(file))
    } catch (err) {
      console.error(err)
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    if (!isUploading) handleFile(e.dataTransfer.files?.[0])
  }

  const openPicker = () => {
    if (!isUploading) inputRef.current?.click()
  }

  return (
    <div className='dropzone-field'>
      <div
        className={`dropzone${isDragging ? ' dropzone-active' : ''}`}
        role='button'
        tabIndex={0}
        aria-label='Upload a pet picture. Drop an image here or press Enter to browse.'
        aria-busy={isUploading}
        onClick={openPicker}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openPicker()
          }
        }}
        onDragOver={e => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <p>Uploading…</p>
        ) : value ? (
          <img src={value} alt='Pet preview' className='dropzone-preview' />
        ) : (
          <p>Drag an image here, or click to choose a file</p>
        )}

        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          hidden
          onChange={e => {
            handleFile(e.target.files?.[0])
            e.target.value = '' // lets the same file be picked again later
          }}
        />
      </div>

      {value && !isUploading && (
        <button
          type='button'
          className='dropzone-remove'
          onClick={() => onChange('')}
        >
          Remove picture
        </button>
      )}

      {error && (
        <p className='dropzone-error' role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}