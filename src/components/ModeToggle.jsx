
export const ModeToggle = ({ mode, onToggle }) => {
  const isMonkey = mode === 'monkey'
  
  return (
    <div className="mode-switch">
      <span className={`mode-label ${isMonkey ? 'active' : ''}`}>🐒</span>
      <button 
        className={`switch-slider ${isMonkey ? 'monkey' : 'human'}`}
        onClick={() => onToggle(isMonkey ? 'human' : 'monkey')}
      >
        <div className="slider-knob"></div>
      </button>
      <span className={`mode-label ${!isMonkey ? 'active' : ''}`}>🧑</span>
    </div>
  )
}