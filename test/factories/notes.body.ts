import { faker } from '@faker-js/faker';

export class BodyNote {
  private _title: string;
  private _anotation: string;

  constructor(title?: string, anotation?: string) {
    this._title = title || faker.internet.email();
    this._anotation = anotation || faker.lorem.lines();
  }

  generate() {
    return {
      title: this._title,
      anotation: this._anotation,
    };
  }
}
