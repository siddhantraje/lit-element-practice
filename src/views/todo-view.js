import { LitElement, html } from "lit-element";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-radio-button/vaadin-radio-button";
import "@vaadin/vaadin-radio-button/vaadin-radio-group";
import { VisibilityFilters } from '../redux/reducer'
import { connect } from "pwa-helpers";
import { store } from "../redux/store";
import { updateFilter, addTodo, updateTodoStatus, clearCompleted } from "../redux/actions";


class TodoView extends connect(store)(LitElement) {
  // this contains properties of component
  // it will return an object
  static get properties() {
    return {
      todos: { type: Array },
      filter: { type: String },
      task: { type: String },
    };
  }

  stateChanged(state){
    this.todos = state.todos;
    this.filter = state.filter;
  }

  // When any of these properties changes, render() will be executed

  //To define properties
  // we also need to call super() always
  constructor() {
    super();
    this.todos = [];
    this.filter = VisibilityFilters.SHOW_ALL;
    this.task = "";
  }

  render() {
    return html`    
      <div class="input-layout" @keyup="${this.shortcutListener}">
        <vaadin-text-field
          placeholder="Task"
          value="${this.task || ''}"
          @change="${this.updateTask}"
        >
        </vaadin-text-field>
        <vaadin-button theme="primary" @click="${this.addTodo}"
          >Add Todo</vaadin-button
        >
      </div>

      <div class="todos-list">
        ${this.applyFilter(this.todos).map(
          (todo) => html`
            <div class="todo-item">
              <vaadin-checkbox
                ?checked=${todo.complete}
                @change=${(e) => this.updateTodoStatus(todo, e.target.checked)}
                >${todo.task}
              </vaadin-checkbox>
            </div>
          `
        )}
      </div>

      <vaadin-radio-group
      class="visibility-filters"
      value="${this.filter}"
      @value-changed="${this.filterChanged}"
      >
          ${Object.values(VisibilityFilters).map(filter => html`
            <vaadin-radio-button value="${filter}">${filter}</vaadin-radio-button>
          `
            )}
      </vaadin-radio-group>

      <vaadin-button @click="${this.clearCompleted}">Clear Completed</vaadin-button>
    
    `;
  }

  filterChanged(e){
store.dispatch(updateFilter(e.detail.value));
  }

  clearCompleted(){
      store.dispatch(clearCompleted())
  }

  applyFilter(todos){
        switch(this.filter){
            case VisibilityFilters.SHOW_ACTIVE: return todos.filter((todo) => !todo.complete);
            case VisibilityFilters.SHOW_COMPLETED: return todos.filter((todo) => todo.complete);
            default: return todos;
        }
  }

  updateTask(e) {
    this.task = e.target.value;
  }

  addTodo() {
    if (this.task) {
      store.dispatch(addTodo(this.task));
      // always creating a new instance because if we just push the push, then LitElement will not be able to detect the change and render will not be executed again
      this.task = "";
    }
  }

  shortcutListener(e) {
    if (e.key === "Enter") this.addTodo();
  }

  updateTodoStatus(updatedTodo, complete) {
    store.dispatch(updateTodoStatus(updatedTodo, complete))
  }
}

customElements.define("todo-view", TodoView);
