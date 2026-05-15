const API_URL = 'http://localhost:3000/api'

export const api = {
    addTask: async function(taskText) {
       // {text: "Позвонить маме"}
        const response = await fetch(`${API_URL}/inbox`, {
            method: 'POST',
            headers: {                         
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                text: taskText,
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при добавлении дела')
        }
        
        return response.json()
    },
    addProblem: async function(taskText) {
        console.log(`Задача ${taskText} отправляется на сервер ....`)
        const response = await fetch(`${API_URL}/problems`, {
            method: 'POST',
            headers: {                         
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskText)
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при добавлении задачи')
        }
        
        return response.json()
    },
    addProject: async function(taskText) {
        console.log(`Проект ${taskText} отправляется на сервер ....`)
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {                         
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskText) 
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при добавлении проека')
        }
        
        return response.json()
    },
    getAllTasks: async function() {
        const response = await fetch(`${API_URL}/inbox`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при получении дел')
        }
        
        const data = await response.json()
        return data.taskObjects 
    },
    deleteTask: async function(taskId) {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка при удалении дела')
        return response.json()
    },
    
    addDelayedTask: async function(delayedData) {
         console.log(`Отлож. задача ${delayedData} отправляется на сервер ....`)
        const response = await fetch(`${API_URL}/delayed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(delayedData)  // { description, delayUntil, sourceTaskId }
        });
        if (!response.ok) throw new Error('Ошибка при сохранении отложенной задачи')
        return response.json()
    },
    getAllProjects: async function() {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка при получении проектов');
        const data = await response.json();
        return data.projects || [];
    },


    deleteProject: async function(projectId) {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка при удалении проекта');
        return response.json();
    },
    
    updateProject: async function(projectId, projectData) {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error('Ошибка при обновлении проекта');
        return response.json();
    },

    getAllProblems: async function() {
        const response = await fetch(`${API_URL}/problems`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка при получении задач');
        const data = await response.json();
        return data.problems || [];
    },

    deleteProblem: async function(problemId) {
        const response = await fetch(`${API_URL}/problems/${problemId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка при удалении задачи');
        return response.json();
    },

    addToCurrentWave: async function(task) {
        console.log('Отправляю ', task, ' ожидаю что в таком виде и попадет в файл')
        const response = await fetch(`${API_URL}/current-wave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Ошибка при добавлении в волну');
        return response.json();
    },
    getAllFromCurrentWave: async function() {
        const response = await fetch(`${API_URL}/current-wave`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Ошибка при получении дел из волны');
        return response.json();
    },

    removeTaskFromProject: async function(projectId, taskId) {
        const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка при удалении задачи из проекта');
        return response.json();
    },
    getState: async function (){
        const response = await fetch(`${API_URL}/mode`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка при получении состояния');
        return response.json();
    },
    setState: async function(mode) {
        const response = await fetch(`${API_URL}/mode`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mode)
        });
        
        if (!response.ok) throw new Error('Ошибка при обновлении состояния');
        return response.json();
    },
    doneProblemfromProject: async function(idProject, idProblem) {
        const response = await fetch(`${API_URL}/projects/${idProject}/tasks/${idProblem}/done`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Ошибка при обновлении статуса задачи');
        return response.json();
    },
    deleteProblemfromCurrentWave: async function(problemId) {
        const response = await fetch(`${API_URL}/current-wave/${problemId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Ошибка при удалении задачи');
        return response.json();
    }
}

