import {validate} from "email-validator";


export class User {
  email: string;
  password: string;
  isValidEmail() {
    return validate(this.email);
  }
}