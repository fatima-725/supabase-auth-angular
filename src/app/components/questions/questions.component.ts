import { Component, OnInit } from '@angular/core';
import { Question } from '../../models/question.model';
import { SupaService } from '../../service/supa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
})
export class QuestionsComponent implements OnInit {
  question: Question[] = [];
  newQuestion: Question = {
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: '',
  };
  isAdmin: boolean = false;
  selectedQuestion: Question = {
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: '',
  };
  isLoading: boolean = true;
  visible: boolean = false;
  constructor(private supabaseService: SupaService, private router: Router) {}

  async ngOnInit() {
    this.isAdmin = await this.supabaseService.isAdmin();
    this.loadQuestions();
  }

  async loadQuestions() {
    this.isLoading = true;
    try {
      const { data, error } = await this.supabaseService.getQuestions();
      if (data) {
        this.question = data;
      } else if (error) {
        console.log(error);
      } else {
        this.question = [];
      }
    } catch (error) {
      console.error('Error loading courses', error);
    }
    this.isLoading = false;
  }

  async addQuestion() {
    if (this.isAdmin) {
      if (this.newQuestion.question.trim()) {
        try {
          const checkQuestion = await this.supabaseService.getQuestionByTitle(
            this.newQuestion.question
          );
          if (checkQuestion) {
            console.log('question already exists');
            return;
          }
          const { data } = await this.supabaseService.addQuestion(
            this.newQuestion
          );
          if (data) {
            this.question.push(data[0]);
          }
          this.newQuestion = {
            question: '',
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            correct_option: '',
          };
          this.loadQuestions();
        } catch (error) {
          console.error('Error adding course:', error);
        }
      }
    }
  }

  async updateQuestion(question: Question) {
    if (this.isAdmin) {
      try {
        const checkQuestion = await this.supabaseService.getQuestionByTitle(
          this.selectedQuestion.question
        );
        if (checkQuestion) {
          console.log('question already exists');
          const { data } = await this.supabaseService.updateQuestion(question);
          if (data) {
            const index = this.question.findIndex((q) => q.id === question.id);
            if (index !== -1) {
              this.question[index] = data[0];
            }
          }
          this.loadQuestions();
        }
      } catch (error) {
        console.log('Error updating course', error);
      }
    }
  }

  async deleteQuestion(id: number) {
    if (this.isAdmin) {
      try {
        const { data, error } = await this.supabaseService.deleteQuestion(id);
        if (data) {
          this.question = this.question.filter(
            (question) => question.id !== id
          );
        }
        this.loadQuestions();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  }

  openUpdateDialog(question: Question) {
    this.selectedQuestion = { ...question };
    this.visible = true;
  }

  saveAndCloseDialog() {
    if (this.selectedQuestion.id !== undefined) {
      this.updateQuestion(this.selectedQuestion);
    }
    this.visible = false;
  }
}
