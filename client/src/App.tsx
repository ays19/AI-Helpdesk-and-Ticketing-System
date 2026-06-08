import { useEffect, useState } from 'react'
import './App.css'

interface HealthcareResponse {
  message: string
  database?: string
  userCount?: number
}

function App() {
  const [healthcare, setHealthcare] = useState<HealthcareResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchHealthcareMessage() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/healthcare')

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: HealthcareResponse = await response.json()

        if (!ignore) {
          setHealthcare(data)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load healthcare API message')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchHealthcareMessage()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="app">
      <h1>AI Helpdesk & Ticketing System</h1>
      <section className="healthcare-status">
        <h2>Healthcare API</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {healthcare && (
          <>
            <p className="message">{healthcare.message}</p>
            {healthcare.database && (
              <p>Database: {healthcare.database}</p>
            )}
            {healthcare.userCount !== undefined && (
              <p>Users in database: {healthcare.userCount}</p>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default App
