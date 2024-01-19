"use strict";

function controller(view, model, payload) {
    const formSelector = payload.formSelector;
    const todosContainerSelector = payload.todosContainerSelector;

    const form = document.querySelector(formSelector);
    const todosContainer = document.querySelector(todosContainerSelector);

    const selectorValidation = (formSelector, todosContainerSelector) => {
        if (
            typeof formSelector !== "string" ||
            typeof todosContainerSelector !== "string"
        )
            throw new Error("Invalid form or Todo selector");
        if (formSelector.trim() === 0 || todosContainerSelector.trim() === 0)
            throw new Error("Selector is empty bug");
    };

    const formValidation = (form) => {
        if (!(form instanceof HTMLFormElement))
            throw new Error("Form was not found");
    };

    selectorValidation(formSelector, todosContainerSelector);
    formValidation(form, todosContainer);

    model.init(formSelector);
    view.init(form, todosContainer);

    const fetchFormData = (inputs) => {
        let data = inputs;
        if (inputs instanceof NodeList) {
            data = Array.from(inputs);
        }

        return data.reduce((acc, item) => {
            acc[item.name] = item.value;
            return acc;
        }, {});
    };

    const submitHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const inputs = form.querySelectorAll("input, textarea");
        const data = model.setData(fetchFormData(inputs));

        if (!data.success) throw new Error("Something wrong with saving data");

        view.renderTodoItem(data.savedData);
        view.clearForm();
    };

    const loadHandler = () => {
        const todoItems = model.getData();
        if (!todoItems) return;

        let itr = todoItems[Symbol.iterator]();

        for (let value of itr) {
            view.renderTodoItem(value);
        }

        // todoItems.forEach((item) => view.renderTodoItem(item));
    };

    const removeTodoHandler = (event) => {
        event.stopPropagation();

        if (!event.target.classList.contains("remove")) return;

        let todoId = event.target
            .closest("[data-todo-id]")
            .getAttribute(`data-todo-id`);
        todoId = Number(todoId);
        model.removeTodoItem(todoId);
        view.removeTodoItem(todoId);
    };

    const statusChangeHandler = (event) => {
        event.stopPropagation();

        if (!event.target.classList.contains("statusTodo")) return;
        const setStatusValue = event.target.value;
        let idTargetTodo = event.target
            .closest("[data-todo-id]")
            .getAttribute(`data-todo-id`);
        idTargetTodo = Number(idTargetTodo);
        console.log(event.target);

        model.setStatus(idTargetTodo, setStatusValue);
    };

    form.addEventListener("submit", submitHandler);
    window.addEventListener("DOMContentLoaded", loadHandler);
    todosContainer.addEventListener("click", removeTodoHandler);
    todosContainer.addEventListener("change", statusChangeHandler);

    return {};
}