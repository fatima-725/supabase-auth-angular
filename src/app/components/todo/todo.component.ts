import { Component, OnInit } from '@angular/core';
import { SupaService } from '../../service/supa.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: string = '';

  constructor(private supabaseService: SupaService) {}

  ngOnInit() {
    this.loadTodos();
  }

  async loadTodos() {
    try {
      const { data, error } = await this.supabaseService.getTodos();
      console.log(data);
      if (error) {
        console.error('Error loading todos:', error);
      } else if (data) {
        this.todos = data;
      } else {
        this.todos = [];
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }

  async addTodo() {
    console.log('asdasd');
    if (this.newTodo.trim()) {
      const todo: Todo = {
        title: this.newTodo.trim(),
        completed: false,
        user_id: '',
      };

      try {
        const { data, error } = await this.supabaseService.addTodo(todo);
        if (error) {
          console.error('Error adding todo:', error);
        } else if (data) {
          this.todos.push(data[0]);
          this.newTodo = '';
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  }

  async updateTodo(todo: Todo) {
    try {
      const updatedTodo = { ...todo };
      updatedTodo.completed = !updatedTodo.completed;
      const { data, error } = await this.supabaseService.updateTodo(
        updatedTodo
      );
      if (error) {
        console.error('Error updating todo:', error);
      } else {
        const index = this.todos.findIndex((t) => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async deleteTodo(id?: number) {
    if (id !== undefined) {
      try {
        const { data, error } = await this.supabaseService.deleteTodo(id);
        if (error) {
          console.error('Error deleting todo:', error);
        } else {
          this.todos = this.todos.filter((todo) => todo.id !== id);
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  }
}
