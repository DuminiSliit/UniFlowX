import { useState } from 'react'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import ResourceList from './components/ResourceList'
import ResourceForm from './components/ResourceForm'

function App() {
  const [view, setView] = useState('resources-list') // 'resources-list', 'resource-form', 'form', 'list'
  const [editingResource, setEditingResource] = useState(null);
  const [preselectedResourceId, setPreselectedResourceId] = useState(null);

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setView('resource-form');
  };

  const handleBookResource = (resource) => {
    setPreselectedResourceId(resource.id);
    setView('form');
  };

  const handleNewResourceClick = () => {
    setEditingResource(null);
    setView('resource-form');
  };

  const handleNewBookingClick = () => {
    setPreselectedResourceId(null);
    setView('form');
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
            Facilities Catalogue
          </button>
          <button 
            className={view === 'list' || view === 'form' ? 'active' : ''} 
            onClick={() => setView('list')}
          >
            Manage Bookings
          </button>
        </div>
      </nav>

      <main className="main-content">
        {view === 'form' && (
          <BookingForm 
            onSuccess={() => setView('list')} 
            preselectedResourceId={preselectedResourceId}
          />
        )}
        
        {view === 'list' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 className="card-title" style={{margin: 0}}>Your Reservations</h2>
              <button className="btn-primary" onClick={handleNewBookingClick}>+ New Booking</button>
            </div>
            <BookingList />
          </div>
        )}
        
        {view === 'resources-list' && (
            <div>
                <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                  <button className="btn-primary" onClick={handleNewResourceClick}>+ Add New Facility/Asset</button>
                </div>
                <ResourceList onEdit={handleEditResource} onBook={handleBookResource} />
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
