import { useState } from 'react'

export const ProblemDescription = ({ isOpen, problem, onComplete }) => {
  if (!isOpen || !problem) return null;
  
  const handleComplete = () => {
    const confirmComplete = window.confirm('✅ Задача выполнена? Она будет отмечена как сделанная.');
    if (confirmComplete) {
      onComplete();
    }
  }
  
  return (
    <>
      <div className="modal-overlay">
        < div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
            <p>{problem.problemDescription}</p>
            {problem.projectName && (
                <p>
                Из проекта: <strong>{problem.projectName}</strong>
                </p>
            )}
            
            <div className="one-button-container">
                <button 
                    className="button-humans" 
                    onClick={handleComplete}
                >
                Сделано
                </button>
            </div>
        </div>
      </div>
    </>
  )
}