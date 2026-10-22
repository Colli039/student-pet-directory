import './css/App.css'
import SideMenu from './components/SideMenu'
import InstructionsPage from './pages/instructions-page'
import PetManagementPage from './pages/pet-management-page'
import PetRankingsPage from './pages/pet-rankings-page'
import LoginPage from './pages/login-page'

import { Routes, useLocation, Route } from 'react-router-dom'

function App () {
  return (
    <>
      <SideMenu />
      <main className='main-body'>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/instructions' element={<InstructionsPage />} />
          <Route path='/' element={<PetManagementPage />} />
          <Route path='/rankings' element={<PetRankingsPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
