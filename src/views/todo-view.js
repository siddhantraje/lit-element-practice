import { LitElement, html } from "lit-element";
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';

const VisibilityFilters = {
    SHOW_ALL : 'All',
    SHOW_ACTIVE : 'Active',
    SHOW_COMPLETED : 'Completed'
}

class TodoView extends LitElement{

    // this contains properties of component
    // it will return an object
    static get properties(){
        return {
            todos: {type: Array},
            filter: {type: String},
            task: {type:String}
        }
    }

    // When any of these properties changes, render() will be executed

    //To define properties 
    // we also need to call super() always
    constructor(){
        super();
        this.todos = [];
        this.filter = VisibilityFilters.SHOW_ALL;
        this.task = '';
    }

    render(){
        return html`
          <div class='input-layout' @keyup="${this.shortcutListener}">
                <vaadin-text-field
                placeholder="Task"
                value="${this.task}"
                @change="${this.updateTask}">

                </vaadin-text-field>
                <vaadin-button
                theme="primary"
                @click="${this.addTodo}">Add Todo</vaadin-button>
          </div>
        `;
    }

    updateTask(e){
        this.task = e.target.value;
    }

    addTodo(){
        if(this.task){
            this.todos = [...this.todos, {
                task: this.task,
                completed: false
            }];
        // always creating a new instance because if we just push the push, then LitElement will not be able to detect the change and render will not be executed again
        this.task ='';
        }
    }

    shortcutListener(e){
if(e.key === 'Enter')
this.addTodo();
    }

}

customElements.define('todo-view', TodoView)