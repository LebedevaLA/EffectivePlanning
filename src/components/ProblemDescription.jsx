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
        <div className="modal-content-container" onClick={(e) => e.stopPropagation()}>
            <div className="text-conteiner-do-problem">
              <p style={{ color: 'var(--color-purple)' }}>{problem.problemDescription}</p>
              {problem.projectName && (
                  <p style={{ color: 'var(--color-orange)' }}>
                      Из проекта: <strong>{problem.projectName}</strong>
                  </p>
              )}
            </div>
            <div className="one-button-container">
                <button 
                    className="button-human" 
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