import { useEffect, useState } from 'react'
import ImageDropzone from './ImageDropZone'
import '../css/pets-modal.css'

const animalTypes = [
  'Dog',
  'Cat',
  'Bird',
  'Fish',
  'Rabbit',
  'Hamster',
  'Turtle',
  'Guinea Pig',
  'Other',
]

export default function PetDetailsModal({
  pet,
  canModify = true,
  onClose,
  onSave,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (pet) {
      setFormData({ ...pet })
      setIsEditing(false)
    }
  }, [pet])

  if (!pet) return null

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (isUploading || isSaving) return

    setIsSaving(true)
    try {
      // onSave resolves to true when the backend accepted the change
      const saved = await onSave({
        ...formData,
        petName: formData.petName.trim(),
        owner: formData.owner.trim(),
        registeredBy: pet.registeredBy, // locked: cannot be changed by editing
      })
      if (saved) setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${pet.petName}?`
    )

    if (confirmed) {
      onDelete(pet.id)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="pet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pet-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {isEditing ? (
          <>
            <h2 id="pet-modal-title">Edit Pet</h2>

            <form onSubmit={handleSave}>
              <label htmlFor="petName">Pet Name</label>
              <input
                id="petName"
                name="petName"
                value={formData.petName ?? ''}
                onChange={handleChange}
                required
              />

              <label htmlFor="owner">Owner</label>
              <input
                id="owner"
                name="owner"
                value={formData.owner ?? ''}
                onChange={handleChange}
                required
              />

              <label htmlFor="registeredBy">Registered By (locked)</label>
              <input
                id="registeredBy"
                name="registeredBy"
                value={pet.registeredBy ?? ''}
                disabled
              />

              <label htmlFor="animalType">Animal Type</label>
              <select
                id="animalType"
                name="animalType"
                value={formData.animalType ?? 'Other'}
                onChange={handleChange}
                required
              >
                {animalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label>Pet Picture</label>
              <ImageDropzone
                value={formData.petPicture ?? ''}
                onChange={(url) =>
                  setFormData((previous) => ({ ...previous, petPicture: url }))
                }
                onBusyChange={setIsUploading}
              />

              <div className="modal-actions">
                <button
                  type="submit"
                  className="modal-button"
                  disabled={isUploading || isSaving}
                >
                  {isSaving ? 'Saving…' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  className="modal-secondary"
                  onClick={() => {
                    setFormData({ ...pet })
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 id="pet-modal-title">{pet.petName}</h2>

            {pet.petPicture && (
              <img
                src={pet.petPicture}
                alt={pet.petName}
                className="pet-modal-image"
              />
            )}

            <div className="pet-details">
              <p><strong>Owner:</strong> {pet.owner}</p>
              <p><strong>Registered By:</strong> {pet.registeredBy}</p>
              <p><strong>Animal Type:</strong> {pet.animalType}</p>
              <p><strong>Likes:</strong> {pet.likes ?? 0}</p>
            </div>

            {canModify && (
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="modal-delete"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}