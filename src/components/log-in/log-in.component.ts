import {
  Component,
  Vue,
} from 'vue-property-decorator';
import {
  EMAIL_RULES,
  PASSWORD_RULES,
} from '@/const/auth';
import { ErrorResponse } from '@/interface/api';
import {
  logInGoogle,
  logInLocal,
} from '@/api/user';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { User } from '@/models/user/user';
import { UserInterface } from '@/interface/user';
import {
  SignUpForm,
  Rule,
} from '@/interface/auth';

@Component
export default class LogInComponent extends Vue {

  public valid: boolean = true;
  public email: string = '';
  public password: string = '';

  public emailRules: Rule[] = EMAIL_RULES;
  public passwordRules: Rule[] = PASSWORD_RULES;

  public errors: ErrorResponse[] = [];

  public signUp(): void {
    this.$router.push('signup');
  }

  public logInLocal(): void {
    if (!(this.$refs.form as any).validate()) {
      return;
    }

    logInLocal({
      email: this.email,
      password: this.password,
    } as SignUpForm)
      .pipe(
        catchError((err: any) => {
          if (err && err.errors) {
            this.errors = err.errors;
          }

          this.errors = [{
            location: '',
            param: '',
            msg: 'Server error occurred.',
          }];

          return EMPTY;
        }),
      )
      .subscribe((user: UserInterface) => {
        this.$store.dispatch('login', new User(user))
          .then(() => this.$router.push('/'));
      });
  }

  public logInGoogle(): void {
    logInGoogle();
  }
}
