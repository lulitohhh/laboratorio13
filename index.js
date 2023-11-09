// Initialize tasks from LocalStorage or create an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || { todo: [], doing: [], done: [] };

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        // Create a task object with a unique ID and the initial state "To Do"
        const taskId = Date.now();
        const task = { id: taskId, text: taskText, state: 'todo' };

        // Add the task to the "To Do" column
        tasks.todo.push(task);

        // Save tasks to LocalStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Create a task card and append it to the "To Do" column
        createTaskCard(task, 'todo');

        // Clear the input field
        taskInput.value = '';
    }
}

function createTaskCard(task, columnId) {
    const taskColumn = document.getElementById(columnId);
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.textContent = task.text;
    taskCard.setAttribute('data-task-id', task.id);
    taskCard.setAttribute('data-task-state', task.state);
    taskCard.setAttribute('draggable', 'true');
    taskCard.innerHTML += `
        <button class="move-up" onclick="moveUp(this)">🡺</button>
        
        <button class="move-down" onclick="moveDown(this)">🡸</button>
        <button class="delete" onclick="deleteTask(this)">✘</button>
        
    `;
    taskColumn.appendChild(taskCard);
}

// Load existing tasks from LocalStorage and create task cards
function loadTasks() {
    for (const columnId in tasks) {
        const column = tasks[columnId];
        for (const task of column) {
            createTaskCard(task, columnId);
        }
    }
}

function moveUp(button) {
    const taskCard = button.parentElement;
    const taskId = taskCard.getAttribute('data-task-id');
    const taskState = taskCard.getAttribute('data-task-state');

    switch (taskState) {
        case 'todo':
            taskCard.setAttribute('data-task-state', 'doing');
            tasks.doing.push({ ...tasks.todo.find(task => task.id === +taskId), state: 'doing' });
            tasks.todo = tasks.todo.filter(task => task.id !== +taskId);
            break;
        case 'doing':
            taskCard.setAttribute('data-task-state', 'done');
            tasks.done.push({ ...tasks.doing.find(task => task.id === +taskId), state: 'done' });
            tasks.doing = tasks.doing.filter(task => task.id !== +taskId);
            break;
    }

    // Update LocalStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const targetColumnId = getNextColumnId(taskState, 'up');
    document.getElementById(targetColumnId).appendChild(taskCard);
}

function moveDown(button) {
    const taskCard = button.parentElement;
    const taskId = taskCard.getAttribute('data-task-id');
    const taskState = taskCard.getAttribute('data-task-state');

    switch (taskState) {
        case 'done':
            taskCard.setAttribute('data-task-state', 'doing');
            tasks.doing.push({ ...tasks.done.find(task => task.id === +taskId), state: 'doing' });
            tasks.done = tasks.done.filter(task => task.id !== +taskId);
            break;
        case 'doing':
            taskCard.setAttribute('data-task-state', 'todo');
            tasks.todo.push({ ...tasks.doing.find(task => task.id === +taskId), state: 'todo' });
            tasks.doing = tasks.doing.filter(task => task.id !== +taskId);
            break;
    }

    // Update LocalStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const targetColumnId = getNextColumnId(taskState, 'down');
    document.getElementById(targetColumnId).appendChild(taskCard);
}

function deleteTask(button) {
    const taskCard = button.parentElement;
    const taskId = taskCard.getAttribute('data-task-id');
    const taskState = taskCard.getAttribute('data-task-state');

    // Remove the task from the tasks array
    tasks[taskState] = tasks[taskState].filter(task => task.id !== +taskId);

    // Update LocalStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Remove the task card from the column
    taskCard.remove();
}

function getNextColumnId(currentColumnId, direction) {
    const columnOrder = ['todo', 'doing', 'done'];
    const currentIndex = columnOrder.indexOf(currentColumnId);

    if (direction === 'up') {
        return columnOrder[currentIndex + 1];
    } else if (direction === 'down') {
        return columnOrder[currentIndex - 1];
    }
}

loadTasks();
