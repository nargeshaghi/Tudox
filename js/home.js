$(document).ready(function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  localStorage.setItem("tasks", JSON.stringify(tasks));

  function renderTasks() {
    $("#taskList").empty();

    if (tasks.length === 0) {
      $("#taskList").append("<li>No tasks found.</li>");
      updateProgress();
      return;
    }

    tasks.forEach(function (task) {
      const checked = task.done ? "checked" : "";
      const completedClass = task.done ? "completed" : "";

      const taskItem = `
        <li class="task-item ${completedClass}" data-id="${task.id}">
          <div class="note">
            <div class="task-top">
              <label class="checkbox-done">
                <input type="checkbox" class="task-check" ${checked} />
              </label>
              <span class="task-text">${task.text}</span>
              <div class="task-actions">
                <button class="edit-btn" title="Edit">✏️</button>
                <button class="delete-btn" title="Delete">🗑️</button>
              </div>
            </div>
            <div class="task-category">${task.category}</div>
          </div>
        </li>
      `;
      $("#taskList").append(taskItem);
    });

    updateProgress();
  }

  $(document).on("click", ".delete-btn", function () {
    const taskId = $(this).closest(".task-item").data("id");
    tasks = tasks.filter((t) => t.id !== taskId);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  });

  $(document).on("change", ".task-check", function () {
    const taskId = $(this).closest(".task-item").data("id");
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index !== -1) {
      tasks[index].done = this.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      $(this).closest("li").toggleClass("completed", this.checked);
      updateProgress();
    }
  });

  $(document).on("click", ".edit-btn", function () {
    const taskId = $(this).closest(".task-item").data("id");
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
      localStorage.setItem("editTask", JSON.stringify(task));
      window.location.href = "newtask.html";
    }
  });

  $('footer img[alt="add"]').on("click", function () {
    localStorage.removeItem("editTask");
    window.location.href = "newtask.html";
  });

  function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    $(".percent").text(percent + "%");

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    $(".pr-fg").css({
      "stroke-dasharray": circumference,
      "stroke-dashoffset": offset,
    });

    const categories = ["stretch", "cardio", "strength", "relax"];
    categories.forEach((cat) => {
      const catTasks = tasks.filter((t) => t.category === cat);
      const catCompleted = catTasks.filter((t) => t.done).length;
      const catPercent =
        catTasks.length === 0
          ? 0
          : Math.round((catCompleted / catTasks.length) * 100);

      $(`.bar.${cat} .fill`).css("height", catPercent + "%");

      $(`.labels p:contains(${capitalize(cat)}) span`).text(catPercent + "%");
    });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  $("body.statistics .bottom-nav img").on("click", function () {
    $("body.statistics .bottom-nav img").removeClass("active");

    $(this).addClass("active");
  });

  renderTasks();
});
