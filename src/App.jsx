import './css/App.css'
import InstructionsPage from './pages/instructions-page'
import PetManagementPage from './pages/pet-management-page'
import PetRankingsPage from './pages/pet-rankings-page'
import LoginPage from './pages/login-page'

import {Routes, useLocation, Route} from 'react-router-dom'


function App() {
  return (
    <main className="main-body">
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<InstructionsPage />} />
        <Route path='/manage' element={<PetManagementPage />} />
        <Route path='/rankings' element={<PetRankingsPage />} />
      </Routes>
    </main>
  )
}

export default App
