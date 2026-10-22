// src/api.js
// Talks to the Lambda function URL that fronts the DynamoDB "pets" table.
//
// Setup: create a .env file in the project root (restart `npm run dev` after):
//   VITE_API_URL=https://abc123.lambda-url.us-east-1.on.aws
//
// Endpoints used:
//   GET    /pets              -> list of pets            (defined earlier)
//   POST   /pets/{id}/like    -> { likes }               (defined earlier)
//   DELETE /pets/{id}/like    -> { likes }               (defined earlier)
//   POST   /pets              -> created pet             (NEW - needs the Lambda update)
//   PUT    /pets/{id}         -> updated pet             (NEW - needs the Lambda update)
//   DELETE /pets/{id}         -> { deleted: true }       (NEW - needs the Lambda update)

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

// DynamoDB attribute names  <->  names used by the React components
export function toUi (item) {
  return {
    id: item.id,
    petName: item.name,
    owner: item.owner,
    registeredBy: item.manager,
    animalType: item.type,
    petPicture: item.imageUrl,
    birthday: item.birthday,
    likes: item.likes ?? 0
  }
}

// Only editable fields are sent. `likes` is deliberately left out so an edit
// can never overwrite the like counter.
function toApi (pet) {
  return {
    name: pet.petName,
    owner: pet.owner,
    manager: pet.registeredBy,
    type: pet.animalType,
    imageUrl: pet.petPicture ?? ''
  }
}

async function request (path, options = {}) {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not set. Add it to .env and restart Vite.')
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: options.body
      ? { 'Content-Type': 'application/json', ...options.headers }
      : options.headers
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${options.method ?? 'GET'} ${path} (${res.status})`)
  }

  return res.json()
}

export async function getPets () {
  const items = await request('/pets')
  return items.map(toUi)
}

// The server generates the id and starts likes at 0, so any id from the form is ignored.
export async function createPet (pet) {
  const item = await request('/pets', {
    method: 'POST',
    body: JSON.stringify(toApi(pet))
  })
  return toUi(item)
}

export async function updatePet (pet) {
  const item = await request(`/pets/${encodeURIComponent(pet.id)}`, {
    method: 'PUT',
    body: JSON.stringify(toApi(pet))
  })
  return toUi(item)
}

export function deletePet (id) {
  return request(`/pets/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

// For the public like button (not wired into the modal yet)
export async function likePet (id) {
  const { likes } = await request(`/pets/${encodeURIComponent(id)}/like`, { method: 'POST' })
  return likes
}

export async function unlikePet (id) {
  const { likes } = await request(`/pets/${encodeURIComponent(id)}/like`, { method: 'DELETE' })
  return likes
}