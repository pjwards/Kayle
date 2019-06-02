export type Rule = (value: string) => boolean | string;

export interface SignUpForm {
  email: string;
  password: string;
}
