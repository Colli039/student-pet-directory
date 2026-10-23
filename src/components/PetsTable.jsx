import '../css/pet-table.css'
import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  createSortedRowModel,
  sortFns
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import PetDetailsModal from './PetDetailsModal'
import AddPetModal from './AddPetModal'
import { getPets, createPet, updatePet, deletePet } from '../services/api'

// v9: features (and row models) are a required table option.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns
})

const columns = [
  { accessorKey: 'petName', header: 'Pet Name' },
  { accessorKey: 'owner', header: 'Owner' },
  { accessorKey: 'registeredBy', header: 'Registered By' },
  { accessorKey: 'animalType', header: 'Animal Type' },
  { accessorKey: 'likes', header: 'Likes' }
]

// The table belongs to one user, set at build time from USER_NAME in the EC2 user data
// (written to VITE_USER_NAME). There is no prompt and no way to switch users in the app.
// This only filters what the table shows; it is not security.
const rawName = String(import.meta.env.VITE_USER_NAME ?? '').trim()
const USER_NAME = rawName === 'PASTE_YOUR_NAME_HERE' ? '' : rawName

// "maria cruz " and "Maria Cruz" count as the same person
const sameName = (a, b) =>
  String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase()

export default function PetTable () {
  const [pets, setPets] = useState([])
  const [selectedPet, setSelectedPet] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false

    getPets()
      .then(data => {
        if (!cancelled) {
          setPets(data)
          setStatus('ready')
        }
      })
      .catch(error => {
        console.error(error)
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Each handler talks to the backend first and only updates local state on success.
  const handleSavePet = async updatedPet => {
    try {
      const saved = await updatePet(updatedPet)
      setPets(previous =>
        previous.map(pet => (pet.id === saved.id ? saved : pet))
      )
      setSelectedPet(saved)
      return true
    } catch (error) {
      console.error(error)
      alert('Could not save your changes. Please try again.')
      return false
    }
  }

  const handleDeletePet = async petId => {
    try {
      await deletePet(petId)
      setPets(previous => previous.filter(pet => pet.id !== petId))
      setSelectedPet(null)
    } catch (error) {
      console.error(error)
      alert('Could not delete the pet. Please try again.')
    }
  }

  const handleAddPet = async newPet => {
    try {
      const created = await createPet(newPet)
      setPets(previous => [...previous, created])
      setIsAddModalOpen(false)
    } catch (error) {
      console.error(error)
      alert('Could not add the pet. Please try again.')
    }
  }

  // Only this user's entries go into the table.
  const myPets = pets.filter(pet => sameName(pet.registeredBy, USER_NAME))

  const table = useTable({
    features,
    columns,
    data: myPets,
    initialState: { sorting: [{ id: 'likes', desc: true }] }
  })

  if (!USER_NAME) {
    return (
      <p>
        This app has no user name configured. Set USER_NAME in the EC2 user data
        (or VITE_USER_NAME in a local .env file) and rebuild.
      </p>
    )
  }
  if (status === 'loading') return <p>Loading pets…</p>
  if (status === 'error') {
    return <p>Could not load pets. Check the API URL and the Lambda CORS settings.</p>
  }

  return (
    <>
      <div className='table-toolbar'>
        <div>
          <h2>My Pets</h2>
          <p>
            Showing pets registered by <strong>{USER_NAME}</strong>
          </p>
        </div>

        <button
          type='button'
          className='add-pet-button'
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Pet
        </button>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              onClick={() => setSelectedPet(row.original)}
              className='clickable-row'
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedPet(row.original)
                }
              }}
            >
              {row.getAllCells().map(cell => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {myPets.length === 0 && <p>No pets registered under {USER_NAME} yet.</p>}

      <PetDetailsModal
        pet={selectedPet}
        onClose={() => setSelectedPet(null)}
        onSave={handleSavePet}
        onDelete={handleDeletePet}
      />
      {isAddModalOpen && (
        <AddPetModal
          registeredBy={USER_NAME}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddPet}
        />
      )}
    </>
  )
}