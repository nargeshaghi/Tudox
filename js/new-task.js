$(document).ready(function () {
  const editData = JSON.parse(localStorage.getItem("editTask"));

  if (editData) {
    $("#taskInput").val(editData.text);
    $("#category").val(editData.category);
  }

  $('footer img[alt="add"]').addClass("active");

  $('footer img[alt="home"]').on("click", function () {
    $(this).addClass("active");
    setTimeout(() => {
      window.location.href = "home.html";
    }, 150);
  });

  function generateId() {
    return "task-" + Date.now();
  }

  function showError(inputSelector, errorSelector, message) {
    $(inputSelector).addClass("input-error");
    $(errorSelector).text(message);
    setTimeout(() => {
      $(inputSelector).removeClass("input-error");
    }, 500);
  }

  function clearErrors() {
    $("#taskError, #categoryError").text("");
    $("#taskInput, #category").removeClass("input-error");
  }

  function saveTask() {
    const text = $("#taskInput").val().trim();
    const category = $("#category").val();

    clearErrors();

    if (!text) {
      showError("#taskInput", "#taskError", "Task cannot be empty");
      return false;
    }

    if (!category) {
      showError("#category", "#categoryError", "Please select a category");
      return false;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (editData) {
      const index = tasks.findIndex((t) => t.id === editData.id);
      if (index !== -1) {
        tasks[index].text = text;
        tasks[index].category = category;
      }
      localStorage.removeItem("editTask");
    } else {
      tasks.push({ id: generateId(), text, category, done: false });
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));

    alert(editData ? "Task updated successfully!" : "Task saved successfully!");

    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);

    return true;
  }

  $(".btn").click(function (e) {
    e.preventDefault();
    saveTask();
  });

  $("#taskInput, #category").keydown(function (e) {
    if (e.key === "Enter" || e.which === 13) {
      e.preventDefault();
      saveTask();
    }
  });
});
