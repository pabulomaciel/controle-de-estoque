document.addEventListener('DOMContentLoaded', () => { 
const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks(){
    taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML=`
    <span>${task}</span>
    <div>
    <button class="edit-btn" onclick= "editTask(${index})">Editar</button>
    <button class="delete-btn" onclick= "deleteTask(${index})">Excluir</button>
    </div>
    `;
    taskList.appendChild(li);
  });
  saveTasks();
}
//Salvar tarefas
function saveTasks() {
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

//Asdicionar tarefa
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (taskInput.value.trim()){
        tasks.push(taskInput.value.trim());
        taskInput.value = '';
        renderTasks();
    }
});

//Editar tarefas
window.editTask = (index) => {
    const newTask = prompt('Editar tarefa: ', tasks[index]);
    if(newTask !== null){
        tasks[index] = newTask.trim();
        renderTasks();
    }
};

//excluir tarefas

window.deleteTask = (index) => {
   if (confirm('Tem certeza que deseja excluir a tarefa?')){
    tasks.splice(index, 1);
    renderTasks();
   }
};

}); 

