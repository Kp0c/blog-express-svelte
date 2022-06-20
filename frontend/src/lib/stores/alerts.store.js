import {writable} from "svelte/store";

const initialState = [];

export const alerts = writable(initialState);

export function showAlert(type, message) {
  alerts.update(todos => {
    const id = (new Date()).getMilliseconds();
    todos.push({type, id, message});
    return todos;
  });
}

export function removeAlert(id) {
  alerts.update(todos => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index > -1) {
      todos.splice(index, 1);
    }
    return todos;
  });
}
