const API_URL = 'http://localhost:3000/api' //вставить свой

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
    getAllTasks: async function(){
        // { taskObjects : [
            //{text: "Купить хлеб"},
            //{text: "Позвонить маме"}
        //] }
        const response = await fetch(`${API_URL}/tasks?status=inbox`, {
            method: 'GET',
            headers: {                         
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Ошибка при получении дел')
        }
        return response.json()
    }
}
