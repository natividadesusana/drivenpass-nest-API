import { faker } from '@faker-js/faker';

export class BodyCredential {
  private _title: string;
  private _username: string;
  private _password: string;
  private _url: string;

  constructor(
    title?: string,
    username?: string,
    password?: string,
    url?: string,
  ) {
    this._title = title || faker.internet.email();
    this._username = username || faker.person.firstName();
    this._password = password || faker.internet.password();
    this._url = url || faker.internet.url();
  }

  generate() {
    return {
      title: this._title,
      username: this._username,
      password: this._password,
      url: this._url,
    };
  }
}
