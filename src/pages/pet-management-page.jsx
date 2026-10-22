import '../css/pet-management-page.css'
import PetTable from '../components/PetsTable'

function PetManagementPage () {
  return (
    <div className='login-body'>
      <h1>Registered Pets</h1>
      <PetTable />
    </div>
  )
}

export default PetManagementPage
