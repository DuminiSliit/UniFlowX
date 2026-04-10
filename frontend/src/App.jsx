import { useState } from 'react'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import ResourceList from './components/ResourceList'
import ResourceForm from './components/ResourceForm'

function App() {
  const [view, setView] = useState('resources-list') // 'list', 'form', 'resources-list', 'resource-form'
  const [editingResource, setEditingResource] = useState(null);

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setView('resource-form');
  };

  const handleNewResourceClick = () => {
    setEditingResource(null);
    setView('resource-form');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo">UniFlowX</h1>
        <div className="nav-links">
          <button 
            className={view === 'resources-list' || view === 'resource-form' ? 'active' : ''} 
            onClick={() => setView('resources-list')}
          >
            Facilities & Assets
          </button>
          {/* <button 
            className={view === 'list' || view === 'form' ? 'active' : ''} 
            onClick={() => setView('list')}
          >
            Bookings
          </button> */}
        </div>
      </nav>

      <main className="main-content">
        {view === 'form' && <BookingForm onSuccess={() => setView('list')} />}
        {view === 'list' && <BookingList />}
        
        {view === 'resources-list' && (
            <div>
                <button className="btn-primary" onClick={handleNewResourceClick} style={{marginBottom: '20px'}}>+ Add New Facility/Asset</button>
                <ResourceList onEdit={handleEditResource} />
            </div>
        )}
        
        {view === 'resource-form' && (
            <ResourceForm 
              onSuccess={() => setView('resources-list')} 
              onCancel={() => setView('resources-list')}
              editingResource={editingResource} 
            />
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2026 Smart Campus Operations Hub - UniFlowX</p>
      </footer>
    </div>
  )
}

export default App
