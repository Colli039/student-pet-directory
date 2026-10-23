import './css/App.css'
import SideMenu from './components/SideMenu'
import InstructionsPage from './pages/instructions-page'
import PetManagementPage from './pages/pet-management-page'

import { Routes, useLocation, Route } from 'react-router-dom'

function App () {
  return (
    <>
      <SideMenu />
      <main className='main-body'>
        <Routes>
          <Route path='/' element={<InstructionsPage />} />
          <Route path='/pets' element={<PetManagementPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
