import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return
    setLoading(true)
    setResponse('')
    try {
      const res = await fetch(`${API_URL}/api/ask/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      setResponse(data.response ?? data.error ?? 'No response')
    } catch (err) {
      setResponse(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI PoC (React + Django)</h1>
      <p>Type a message and send it to the Django backend.</p>
      <textarea
        rows={4}
        cols={50}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message..."
      />
      <br />
      <button onClick={handleSubmit} disabled={loading || !message.trim()}>
        {loading ? 'Sending...' : 'Ask AI'}
      </button>
      {response && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f0f0f0',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <strong>Response:</strong> {response}
        </div>
      )}
    </div>
  )
}

export default App