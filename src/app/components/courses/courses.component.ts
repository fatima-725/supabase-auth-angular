// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { SupaService } from '../../service/supa.service';
// import { Course } from '../../models/course.model';
// import { MatDialog } from '@angular/material/dialog';

// @Component({
//   selector: 'app-courses',
//   templateUrl: './courses.component.html',
//   styleUrls: ['./courses.component.css'],
// })
// export class CoursesComponent implements OnInit {
//   courses: Course[] = [];
//   newCourse: Course = { title: '', description: '' };

//   constructor(private supabaseService: SupaService, private router: Router) {}

//   ngOnInit() {
//     this.loadCourses();
//   }

//   async checkAdmin() {
//     return this.supabaseService.isAdmin();
//   }

//   async loadCourses() {
//     try {
//       const { data, error } = await this.supabaseService.getCourses();
//       if (data) {
//         this.courses = data;
//       } else if (error) {
//         console.log(error);
//       } else {
//         this.courses = [];
//       }
//     } catch (error) {
//       console.error('Error loading courses', error);
//     }
//   }

//   async addCourse() {
//     const isAdmin = await this.supabaseService.isAdmin();
//     if (isAdmin) {
//       if (this.newCourse.title.trim() && this.newCourse.description.trim()) {
//         try {
//           const checkCourse = await this.supabaseService.getCourseByTitle(
//             this.newCourse.title
//           );
//           if (checkCourse) {
//             console.log('course already exists');
//             return;
//           }
//           const { data } = await this.supabaseService.addCourse(this.newCourse);
//           if (data) {
//             this.courses.push(data[0]);
//             this.newCourse = { title: '', description: '' };
//           }
//         } catch (error) {
//           console.error('Error adding course:', error);
//         }
//       }
//     }
//   }

//   async updateCourse(course: Course) {
//     try {
//       const isAdmin = await this.supabaseService.isAdmin();
//       if (isAdmin) {
//         const checkCourse = await this.supabaseService.getCourseByTitle(
//           this.newCourse.title
//         );
//         if (checkCourse) {
//           console.log('course already exists');
//           return;
//         }
//         const { data } = await this.supabaseService.updateCourse(course);
//         if (data) {
//           const index = this.courses.findIndex((c) => c.id === course.id);
//           if (index !== -1) {
//             this.courses[index] = data[0];
//           }
//         }
//       }
//     } catch (error) {
//       console.log('Error updating course', error);
//     }
//   }

//   async deleteCourse(id: number) {
//     try {
//       const isAdmin = await this.supabaseService.isAdmin();
//       if (isAdmin) {
//         const { data, error } = await this.supabaseService.deleteCourse(id);
//         if (data) {
//           this.courses = this.courses.filter((course) => course.id !== id);
//         }
//       }
//     } catch (error) {
//       console.error('Error deleting course:', error);
//     }
//     // }
//   }

//   async enroll(courseId: number) {
//     const isLoggedIn = await this.supabaseService.isLoggedIn();
//     if (isLoggedIn) {
//       try {
//         const result = await this.supabaseService.addUserCourse(courseId);
//         if (result) {
//           const { data, error } = result;
//           if (data) {
//             console.log('Course enrolled successfully');
//           } else if (error) {
//             console.error('Error enrolling course:', error);
//           }
//         }
//       } catch (error) {
//         console.error('Error during enrollment:', error);
//       }
//     } else {
//       this.router.navigate(['/login']);
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupaService } from '../../service/supa.service';
import { Course } from '../../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  newCourse: Course = { title: '', description: '' };
  isAdmin: boolean = false;
  visible: boolean = false;
  selectedCourse: Course = { title: '', description: '' };
  isLoading: boolean = true;
  constructor(private supabaseService: SupaService, private router: Router) {}

  async ngOnInit() {
    this.isAdmin = await this.supabaseService.isAdmin();
    this.loadCourses();
    this.isLoading = false;
  }

  async loadCourses() {
    this.isLoading = true;
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
    this.isLoading = false;
  }

  // async addCourse() {
  //   if (this.isAdmin) {
  //     if (this.newCourse.title.trim() && this.newCourse.description.trim()) {
  //       try {
  //         const checkCourse = await this.supabaseService.getCourseByTitle(this.newCourse.title);
  //         if (checkCourse) {
  //           console.log('Course already exists');
  //           return;
  //         }
  //         const { data } = await this.supabaseService.addCourse(this.newCourse);
  //         if (data) {
  //           this.courses.push(data[0]);
  //           this.newCourse = { title: '', description: '' };
  //         }
  //       } catch (error) {
  //         console.error('Error adding course:', error);
  //       }
  //     }
  //   }
  // }
  async addCourse() {
    if (this.isAdmin) {
      if (this.newCourse.title.trim() && this.newCourse.description.trim()) {
        try {
          const checkCourse = await this.supabaseService.getCourseByTitle(
            this.newCourse.title
          );
          if (checkCourse) {
            console.log('Course already exists');
            return;
          }
          const { data } = await this.supabaseService.addCourse(this.newCourse);
          if (data) {
            this.courses.push(data[0]);
          }
          this.newCourse = { title: '', description: '' };
          this.loadCourses();
        } catch (error) {
          console.error('Error adding course:', error);
        }
      }
    }
  }

  async updateCourse(course: Course) {
    if (this.isAdmin) {
      try {
        const checkCourse = await this.supabaseService.getCourseByTitle(
          this.selectedCourse.title
        );
        if (checkCourse) {
          console.log('Course already exists');
          const { data } = await this.supabaseService.updateCourse(course);
          if (data) {
            const index = this.courses.findIndex((c) => c.id === course.id);
            if (index !== -1) {
              this.courses[index] = data[0];
            }
          }
          this.loadCourses();
        }
      } catch (error) {
        console.log('Error updating course', error);
      }
    }
  }

  async deleteCourse(id: number) {
    if (this.isAdmin) {
      try {
        const { data, error } = await this.supabaseService.deleteCourse(id);
        if (data) {
          this.courses = this.courses.filter((course) => course.id !== id);
        }
        this.loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  }

  async enroll(courseId: number) {
    const isLoggedIn = await this.supabaseService.isLoggedIn();
    if (isLoggedIn) {
      try {
        const result = await this.supabaseService.addUserCourse(courseId);
        if (result) {
          const { data, error } = result;
          if (data) {
            console.log('Course enrolled successfully');
          } else if (error) {
            console.error('Error enrolling course:', error);
          }
        }
      } catch (error) {
        console.error('Error during enrollment:', error);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  openUpdateDialog(course: Course) {
    this.selectedCourse = { ...course };
    this.visible = true;
  }

  saveAndCloseDialog() {
    if (this.selectedCourse.id !== undefined) {
      this.updateCourse(this.selectedCourse);
    }
    this.visible = false;
  }
}
