
const state = {
	tasks: [
		{ id: "t1", title: "Read the lab README", status: "todo" },
		{ id: "t2", title: "Implement render()", status: "doing" },
		{ id: "t3", title: "Demo add / move / edit / delete", status: "done" },
	],
};

const STATUSES = ["todo", "doing", "done"];

function uid() {
	return `t${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}


function createButton(action, id, status, text) {
    const btn = document.createElement("button");
    btn.dataset.action = action;
    btn.dataset.id = id;
    if (status) btn.dataset.status = status;
    btn.textContent = text;
    return btn;
}

function render() {
    STATUSES.forEach(status => {
        const columnBody = document.querySelector(`[data-column-body="${status}"]`);
        const countBadge = document.querySelector(`[data-count="${status}"]`);
        
        // 1: Clear the column
        columnBody.innerHTML = "";
        
        // Filter tasks for the current status
        const columnTasks = state.tasks.filter(task => task.status === status);
        
        // 4: Update the count badge
        if (countBadge) {
            countBadge.textContent = columnTasks.length;
        }

        // 3: Show empty state if no tasks exist
        if (columnTasks.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.className = "empty";
            emptyMsg.textContent = "No tasks";
            columnBody.appendChild(emptyMsg);
            return; // Move to the next column
        }

        // 2: Build and append cards
        columnTasks.forEach(task => {
            const card = document.createElement("div");
            card.className = "card";

            const title = document.createElement("h3");
            title.textContent = task.title;
            card.appendChild(title);

            const actionsDiv = document.createElement("div");
            actionsDiv.className = "card-actions";

            // Move buttons (Quality Upgrade: Skip button if already in that column)
            if (task.status !== "todo") {
                actionsDiv.appendChild(createButton("move", task.id, "todo", "→ To Do"));
            }
            if (task.status !== "doing") {
                actionsDiv.appendChild(createButton("move", task.id, "doing", "→ Doing"));
            }
            if (task.status !== "done") {
                actionsDiv.appendChild(createButton("move", task.id, "done", "→ Done"));
            }

            // Edit and Delete buttons
            actionsDiv.appendChild(createButton("edit", task.id, "", "Edit"));
            actionsDiv.appendChild(createButton("delete", task.id, "", "Delete"));

            card.appendChild(actionsDiv);
            columnBody.appendChild(card);
        });
    });
}

function addTask(title) {
	state.tasks.push({ id: uid(), title, status: "todo" });
}

function moveTask(id, status) {
    const task = state.tasks.find((t) => t.id === id);
    if (task && STATUSES.includes(status)) {
        task.status = status;
    }
}

function editTask(id, title) {
	if (title && title.trim() !== "") {
        const task = state.tasks.find((t) => t.id === id);
        if (task) task.title = title.trim();
    }
}

function deleteTask(id) {
	if (confirm("Delete this task?")) {
        state.tasks = state.tasks.filter((t) => t.id !== id);
    }
}

function init() {
	const form = document.querySelector("#task-form");
	const board = document.querySelector("#board");

	form?.addEventListener("submit", (e) => {
		e.preventDefault(); // keep the page from reloading
		const input = document.querySelector("#task-title");
		const title = input?.value.trim();
		if (!title) return;
        
		addTask(title);
        input.value = "";
        input.focus(); // Quality upgrade: refocus input
        render();
	});

	// Event delegation: one listener handles all card buttons
	board?.addEventListener("click", (e) => {
		const btn = e.target.closest("button[data-action]");
		if (!btn) return;

		const { action, id, status } = btn.dataset;

		if (action === "move") {
            moveTask(id, status);
            render();
        } else if (action === "edit") {
            const task = state.tasks.find((t) => t.id === id);
            if (task) {
                const newTitle = prompt("Edit task title:", task.title);
                if (newTitle !== null) {
                    editTask(id, newTitle);
                    render();
                }
            }
        } else if (action === "delete") {
            deleteTask(id);
            render();
        }
	});

	render();
}

document.addEventListener("DOMContentLoaded", init);