import { useState } from 'react'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import './App.css'

function App() {
  const [view, setView] = useState('list') // 'list' or 'form'

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo">UniFlowX</h1>
        <div className="nav-links">
          <button 
            className={view === 'list' ? 'active' : ''} 
            onClick={() => setView('list')}
          >
            My Bookings
          </button>
          <button 
            className={view === 'form' ? 'active' : ''} 
            onClick={() => setView('form')}
          >
            New Booking
          </button>
        </div>
      </nav>

      <main className="main-content">
        {view === 'form' ? (
          <BookingForm onSuccess={() => setView('list')} />
        ) : (
          <BookingList />
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2026 Smart Campus Operations Hub - UniFlowX</p>
      </footer>
    </div>
  )
}

export default App
