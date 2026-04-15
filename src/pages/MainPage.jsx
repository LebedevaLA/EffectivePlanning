import { useState } from 'react'
import { InBox } from '../components/InBox'
import { ModeToggle } from '../components/ModeToggle'



export const MainPage = () => {
  const [mode, setMode] = useState('monkey')
  const handleToggle = (newMode) => {
    setMode(newMode)
  }
  
  return (
    <div className="page-wrapper">
      <h1>Effective Planning</h1>
      <InBox mode={mode} />
      <footer>
        <ModeToggle mode={mode} onToggle={handleToggle} />
      </footer>
    </div>
  )
}