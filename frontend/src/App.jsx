import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setResponse('')
    try {
      const res = await fetch('http://localhost:8000/api/ask/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      setResponse(data.response)
    } catch (err) {
      setResponse('Error connecting to backend.')
    }
    setLoading(false)
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
      <button onClick={handleSubmit} disabled={loading || !message}>
        {loading ? 'Sending...' : 'Ask AI'}
      </button>
      {response && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f0f0f0',
            borderRadius: '4px',
          }}
        >
          <strong>Response:</strong> {response}
        </div>
      )}
    </div>
  )
}

export default App
