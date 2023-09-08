import { faker } from '@faker-js/faker';

export class BodySignIn {
  private _email: string;
  private _password: string;

  constructor(email?: string, password?: string) {
    this._email = email || faker.internet.email();
    this._password = password || '@StrongPassword1995';
  }

  generate() {
    return {
      email: this._email,
      password: this._password,
    };
  }
}
