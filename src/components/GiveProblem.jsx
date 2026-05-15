import { useState } from 'react'
import { api } from "../services/api"
import { ProblemDescription } from './ProblemDescription'

export const GiveProblem = ({ setMode, addTaskModule, onCloseAddTask, onAddTask }) => {
  const [isDescrProblemOpen, setDescrProblemModalOpen] = useState(false)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [allProblems, setAllProblems] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(null)

  const handleOpenUnloadModal = () => {
    if (allProblems == null) {
      loadProblems();
    } else {
      setDescrProblemModalOpen(true);
    }
  }

  const handleCloseDescrProblemModal = async () => {
    const nextIndex = currentIndex + 1;
    
    await handleDeleteTaskFromWave();
    
    // Если задача была из проекта - обновляем её статус на done
    if (currentProblem?.projectId) {
      try {
        await api.doneProblemfromProject(currentProblem.projectId, currentProblem.problemId);
        console.log('Задача в проекте отмечена как выполненная');
      } catch (error) {
        console.error('Ошибка при обновлении статуса в проекте:', error);
      }
    }
    
    if (nextIndex < allProblems.length) {
      setCurrentProblem(allProblems[nextIndex]);
      setCurrentIndex(nextIndex);
    } else {
      console.log('Все дела сделаны');
      setCurrentProblem(null);
      setCurrentIndex(null);
      setAllProblems(null);
      setDescrProblemModalOpen(false);
      if (inbox.length > 0){
        await api.setState('inbox');
        setMode('inbox');
      }else{
        await api.setState('projects');
        setMode('projects');
      }
    }
  }

  const loadProblems = async () => {
    try {
      const problems = await api.getAllFromCurrentWave();
      console.log('Загружены задачи из текущей волны:', problems);
      setAllProblems(problems);
      setCurrentIndex(0);
      if (problems.length > 0) {
        setCurrentProblem(problems[0]);
        setDescrProblemModalOpen(true);
      } else {
        console.log('Нет дел для выполнения');
        await api.setState('projects');
        setMode('projects');
        setDescrProblemModalOpen(false);
      }
    } catch (error) {
      setDescrProblemModalOpen(false);
      console.error('Ошибка при получении дел:', error);
    }
  }
  
  const handleDeleteTaskFromWave = async () => {
    console.log('Попытка удалить из волны:', currentProblem);
    if (currentProblem) {
      try {
        await api.deleteProblemfromCurrentWave(currentProblem.problemId);
        console.log('Задача удалена из текущей волны');
      } catch (error) {
        console.error('Ошибка при удалении:', error);
      }
    }
  }

  return (
    <div className="inbox_container">
      <section className="inbox">
        <h2>Задачи</h2>
        <button className="human_button_inbox" onClick={handleOpenUnloadModal}>
          Выдать задачу
        </button>
      </section>
      
      <ProblemDescription
        isOpen={isDescrProblemOpen}
        problem={currentProblem}
        onComplete={handleCloseDescrProblemModal}
        addTaskModule = { addTaskModule}
        onCloseAddTask={ onCloseAddTask }
        onAddTask={ onAddTask }
      />
    </div>
  )
}
