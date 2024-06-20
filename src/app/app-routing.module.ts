import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses/courses.component';
import { TodoComponent } from './components/todo/todo.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { MyCoursesComponent } from './components/my-courses/my-courses.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { QuestionsComponent } from './components/questions/questions.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'todos', component: TodoComponent, canActivate: [AuthGuard] },
  {
    path: 'my-courses',
    component: MyCoursesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'question',
    component: QuestionsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
