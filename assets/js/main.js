document.addEventListener("DOMContentLoaded", function() {
    // Referencias a elementos del DOM
    const taskInput = document.getElementById("newTask");
    const addButton = document.querySelector(".input-task button");
    const taskTableBody = document.querySelector(".task-table tbody");
    const pendientesTextElement = document.querySelector(".task-section li:first-child");
    const realizadasTextElement = document.querySelector(".task-section li:nth-child(2)");
    const totalTextElement = document.getElementById("totalText");

    // Almacenar tareas en un array
    let tasks = [];

    addButton.addEventListener("click", function() {
        addTask();
    });

    // Evento para agregar una tarea al presionar la tecla Enter en el input
    taskInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    // Filtros de visualización de tareas
    pendientesTextElement.addEventListener('click', function() {
        displayTasks("Pendiente");
    });

    realizadasTextElement.addEventListener('click', function() {
        displayTasks("Realizada");
    });

    totalTextElement.addEventListener('click', function() {
        displayTasks("Total");
    });

    // Función para agregar una tarea
    function addTask() {
        if (taskInput.value.trim() !== "") {
            const newTask = {
                id: tasks.length + 1,
                description: taskInput.value.trim(),
                status: "Pendiente"
            };
            tasks.push(newTask);

            displayTasks("Pendiente");
            taskInput.value = "";
        }
    }

    // Función para mostrar tareas en la tabla 
    function displayTasks(filter = "Pendiente") {
        taskTableBody.innerHTML = ""; 

        const filteredTasks = tasks.filter(task => {
            if (filter === "Total") return true;
            return task.status === filter;
        });

        filteredTasks.forEach(task => {
            const row = document.createElement('tr');

            // Si el filtro es "Realizada", muestra solo ID y descripción
            if (filter === "Realizada") {
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.description}</td>
                `;
            } else { // De lo contrario, muestra ID, descripción y botones de acción
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.description}</td>
                    <td>
                        <button class="status-btn" data-id="${task.id}" data-status="Realizada">✔</button>
                        ${task.status === "Pendiente" ? `<button class="status-btn" data-id="${task.id}" data-status="Eliminar">❌</button>` : ""}
                    </td>
                `;
            }

            const btnRealizada = row.querySelector('[data-status="Realizada"]');
            const btnEliminar = row.querySelector('[data-status="Eliminar"]');

            if (btnRealizada) {
                btnRealizada.addEventListener('click', function() {
                    setTaskStatus(task.id, "Realizada");
                    displayTasks("Pendiente"); 
                });
            }

            if (btnEliminar) {
                btnEliminar.addEventListener('click', function() {
                    removeTask(task.id);
                    displayTasks("Pendiente"); 
                });
            }

            taskTableBody.appendChild(row);
        });

        // Actualizar contadores de tareas 
        document.getElementById("totalTasks").textContent = tasks.length;
        const completedTasks = tasks.filter(task => task.status === "Realizada").length;
        realizadasTextElement.textContent = `Realizadas: ${completedTasks}`;
        pendientesTextElement.textContent = `Pendientes: ${tasks.length - completedTasks}`;
    }

    // Función para cambiar el estado de una tarea
    function setTaskStatus(taskId, status) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            displayTasks("Pendiente"); 
        }
    }

    // Función para eliminar una tarea
    function removeTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
    }
});
