import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Todo } from '../models/todo.model';
import { Course } from '../models/course.model';
import { User } from '@supabase/supabase-js';

interface myUser extends User {
  user_role: String;
}

@Injectable({
  providedIn: 'root',
})
export class SupaService {
  private supabase_client: SupabaseClient;
  constructor() {
    this.supabase_client = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  //auth
  signUp(email: string, password: string) {
    return this.supabase_client.auth
      .signUp({ email, password })
      .then(async (res) => {
        if (res.data.user?.id) {
          await this.supabase_client
            .from('user_role')
            .insert({ user_id: res.data.user?.id, role: 'User' });
        }
        return res;
      });
  }

  signIn(email: string, password: string) {
    return this.supabase_client.auth.signInWithPassword({ email, password });
  }

  async signOutUser() {
    const { error } = await this.supabase_client.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      console.log('User signed out successfully');
    }
  }

  // get user
  async getUser() {
    const {
      data: { user },
    } = await this.supabase_client.auth.getUser();
    if (user) {
      // const userRole = await this.supabase_client
      //   .from('user_role')
      //   .select('*')
      //   .eq('user_id', user.id);
      // if (userRole.data && userRole.data.length) {
      //   const _user = <myUser>user;
      //   _user['user_role'] = userRole.data[0].role;
      //   console.log(user);
      //   console.log(_user);
      // }
      return user;
    } else {
      return false;
    }
  }

  //check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    const user = await this.getUser();
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getUser();
    if (user) {
      const userRole = await this.supabase_client
        .from('user_role')
        .select('*')
        .eq('user_id', user.id);
      if (userRole.data && userRole.data.length) {
        const _user = <myUser>user;
        _user['user_role'] = userRole.data[0].role;
        console.log(userRole.data[0].role);
        // console.log(_user);
        if (userRole.data[0].role === 'Admin') {
          return true;
        }
      }
    }
    return false;
  }

  // todo
  async addTodo(todo: Todo) {
    const user = await this.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    todo.user_id = user.id;
    console.log(todo);
    const { data, error } = await this.supabase_client
      .from('todos')
      .insert(todo);
    return { data, error };
  }

  async getTodos() {
    const user = await this.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const { data, error } = await this.supabase_client
      .from('todos')
      .select('*')
      .eq('user_id', user.id);
    return { data, error };
  }

  async updateTodo(todo: Todo) {
    const user = await this.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const { data, error } = await this.supabase_client
      .from('todos')
      .update({ title: todo.title, completed: todo.completed })
      .eq('id', todo.id)
      .eq('user_id', user.id);
    return { data, error };
  }

  async deleteTodo(id: number) {
    const user = await this.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const { data, error } = await this.supabase_client
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    return { data, error };
  }

  // courses
  async addCourse(course: Course) {
    const { data, error } = await this.supabase_client
      .from('courses')
      .insert(course);
    return { data, error };
  }

  async getCourseByTitle(title: string) {
    const { data, error } = await this.supabase_client
      .from('courses')
      .select('*')
      .eq('title', title);
    return data;
  }

  async getCourses() {
    const { data, error } = await this.supabase_client
      .from('courses')
      .select('*');
    return { data, error };
  }

  async updateCourse(course: Course) {
    const { data, error } = await this.supabase_client
      .from('courses')
      .update({ title: course.title, description: course.description })
      .eq('id', course.id);
    return { data, error };
  }

  async deleteCourse(id: number) {
    const { data, error } = await this.supabase_client
      .from('courses')
      .delete()
      .eq('id', id);
    return { data, error };
  }

  //user-course
  async addUserCourse(courseId: number) {
    const user = await this.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }
    const { data: checkEnrollment } = await this.supabase_client
      .from('user_courses')
      .select('*')
      .eq('course_id', courseId)
      .eq('user_id', user.id);

    if (checkEnrollment?.length) {
      console.log('course already enrolled');
      return;
    }

    const { data, error } = await this.supabase_client
      .from('user_courses')
      .insert({ user_id: user.id, course_id: courseId });
    return { data, error };
  }

  async getUserCourse() {
    const user = await this.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const { data, error } = await this.supabase_client
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id);
    return { data, error };
  }

  async deleteUserCourse(courseId: number) {
    const user = await this.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const { data, error } = await this.supabase_client
      .from('user_courses')
      .delete()
      .eq('course_id', courseId)
      .eq('user_id', user.id);
    return { data, error };
  }
}
