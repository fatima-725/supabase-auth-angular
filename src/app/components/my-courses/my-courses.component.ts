import { Component, OnInit } from '@angular/core';
import { SupaService } from '../../service/supa.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css',
})
export class MyCoursesComponent {
  courses: Course[] = [];
  UserCourses: Course[] = [];

  constructor(private supabaseService: SupaService) {}

  async ngOnInit() {
    await this.loadCourses();
    await this.loadUserCourses();
  }

  async loadCourses() {
    try {
      const { data, error } = await this.supabaseService.getCourses();
      if (data) {
        this.courses = data;
      } else if (error) {
        console.log(error);
      } else {
        this.courses = [];
      }
    } catch (error) {
      console.error('Error loading courses', error);
    }
  }

  async loadUserCourses() {
    const { data, error } = await this.supabaseService.getUserCourse();
    if (data) {
      const userCourseIds = data.map((uc: any) => uc.course_id);
      this.UserCourses = this.courses.filter((course) =>
        userCourseIds.includes(course.id)
      );
    } else {
      console.log('error in loading user courses', error);
    }
  }

  async addCourseToUser(courseId: number) {
    const response = await this.supabaseService.addUserCourse(courseId);

    // Check if response is defined and not null
    if (response && response.data) {
      await this.loadUserCourses();
    } else {
      console.error('Error adding course to user:', response?.error); // Log the error if available
    }
  }
  async removeCourseFromUser(courseId: number) {
    const { data, error } = await this.supabaseService.deleteUserCourse(
      courseId
    );
    if (data) {
      await this.loadUserCourses();
    } else {
      console.error('Error removing course from user:', error);
    }
  }
}
