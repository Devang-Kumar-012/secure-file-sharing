import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

function RoutePlaceholder({ label = 'Page' }) {
  return (
    <div className="route-placeholder">
      <h2>{label}</h2>
      <p>This page is under construction.</p>
      <Link to="/dashboard">
        <Button variant="secondary" size="md">Back to Dashboard</Button>
      </Link>
    </div>
  )
}

export default RoutePlaceholder
