import { useState } from 'react'
import ImageDropzone from './ImageDropZone'
import '../css/pets-modal.css'

const initialForm = {
  petName: '',
  owner: '',
  registeredBy: '',
  animalType: 'Dog',
  petPicture: '',
  likes: 0
}

const animalTypes = [
  'Dog',
  'Cat',
  'Bird',
  'Fish',
  'Rabbit',
  'Hamster',
  'Turtle',
  'Guinea Pig',
  'Other'
]

export default function AddPetModal ({ registeredBy = '', onClose, onAdd }) {
  const [formData, setFormData] = useState({ ...initialForm, registeredBy })
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(previous => ({
      ...previous,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (isUploading || isSaving) return

    setIsSaving(true)
    try {
      await onAdd({
        ...formData,
        petName: formData.petName.trim(),
        owner: formData.owner.trim(),
        // always the configured user, whatever is in the form
        registeredBy: registeredBy || formData.registeredBy.trim(),
        likes: 0
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div
        className='pet-modal'
        role='dialog'
        aria-modal='true'
        aria-labelledby='add-pet-title'
        onClick={e => e.stopPropagation()}
      >
        <button
          type='button'
          className='modal-close'
          onClick={onClose}
          aria-label='Close modal'
        >
          &times;
        </button>

        <h2 id='add-pet-title'>Add New Pet</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor='new-pet-name'>Pet Name</label>
          <input
            id='new-pet-name'
            name='petName'
            value={formData.petName}
            onChange={handleChange}
            placeholder='Enter pet name'
            required
          />

          <label htmlFor='new-pet-owner'>Owner</label>
          <input
            id='new-pet-owner'
            name='owner'
            value={formData.owner}
            onChange={handleChange}
            placeholder="Enter owner's name"
            required
          />

          <label htmlFor='new-pet-registrar'>Registered By (locked)</label>
          <input
            id='new-pet-registrar'
            name='registeredBy'
            value={formData.registeredBy}
            onChange={handleChange}
            placeholder='Enter employee name'
            disabled={Boolean(registeredBy)}
            required
          />

          <label htmlFor='new-pet-type'>Animal Type</label>
          <select
            id='new-pet-type'
            name='animalType'
            value={formData.animalType}
            onChange={handleChange}
            required
          >
            {animalTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label>Pet Picture</label>
          <ImageDropzone
            value={formData.petPicture}
            onChange={url =>
              setFormData(previous => ({ ...previous, petPicture: url }))}
            onBusyChange={setIsUploading}
          />

          <div className='modal-actions'>
            <button
              type='submit'
              className='modal-button'
              disabled={isUploading || isSaving}
            >
              {isSaving ? 'Adding…' : 'Add Pet'}
            </button>

            <button type='button' className='modal-secondary' onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}