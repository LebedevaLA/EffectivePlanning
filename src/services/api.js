const API_URL = 'http://localhost:3000/api'

export const api = {
    addTask: async function(taskText) {
       // {text: "Позвонить маме"}
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {                         
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                text: taskText,
                status: 'inbox'
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при добавлении дела')
        }
        
        return response.json()
    },
    addProblem: async function(taskText) {
       // {text: "Позвонить маме"}
        const response = await fetch(`${API_URL}/problems`, {
            method: 'POST',
            headers: {                         
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                text: taskText,
                status: 'inbox'
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при добавлении задачи')
        }
        
        return response.json()
    },
    addProject: async function(taskText) {
       // {text: "Позвонить маме"}
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {                         
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                text: taskText,
                status: 'inbox'
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка при добавлении проека')
        }
        
        return response.json()
    },
    getAllTasks: async function() {
        const response = await fetch(`${API_URL}/tasks?status=inbox`, {
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
    
    delayTask: async function(taskId, delayUntil) {
        const response = await fetch(`${API_URL}/tasks/${taskId}/delay`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ delayUntil })
        });
        if (!response.ok) throw new Error('Ошибка при откладывании')
        return response.json()
    }
}
