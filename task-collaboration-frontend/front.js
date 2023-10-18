<!DOCTYPE html>
<html>
<head>
    <title>Task Management</title>
</head>
<body>
    <h1>Task Management</h1>
    
    <!-- Form for adding a task -->
    <form id="taskForm">
        <label for="title">Title:</label>
        <input type="text" id="title" required><br>
        <label for="description">Description:</label>
        <input type="text" id="description"><br>
        <label for="dueDate">Due Date:</label>
        <input type="text" id="dueDate"><br>
        <button type="submit">Add Task</button>
    </form>

    <!-- Task List -->
    <h2>Task List</h2>
    <ul id="taskList"></ul>

    <script>
        // Function to fetch and display tasks
        async function fetchTasks() {
            const response = await fetch('/tasks'); // Updated URL
            const data = await response.json();

            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `Title: ${task.title}, Description: ${task.description}, Due Date: ${task.due_date}`;
                taskList.appendChild(li);
            });
        }

        // Event listener for form submission
        const taskForm = document.getElementById('taskForm');
        taskForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const dueDate = document.getElementById('dueDate').value;

            const response = await fetch('/tasks', { // Updated URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description, due_date: dueDate })
            });

            const data = await response.json();
            console.log('Task added:', data.message);

            fetchTasks(); // Refresh the task list
            taskForm.reset(); // Clear the form
        });

        // Initial fetch of tasks
        fetchTasks();
    </script>
</body>
</html>
