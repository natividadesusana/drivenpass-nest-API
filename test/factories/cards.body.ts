import { faker } from '@faker-js/faker';

export class BodyCard {
  private _title: string;
  private _number: string;
  private _name: string;
  private _cvv: string;
  private _exp: string;
  private _password: string;
  private _isVirtual: boolean;
  private _isCredit: boolean;
  private _isDebit: boolean;

  constructor(
    title?: string,
    number?: string,
    name?: string,
    cvv?: string,
    exp?: string,
    password?: string,
    isVirtual?: boolean,
    isCredit?: boolean,
    isDebit?: boolean,
  ) {
    this._title = title || faker.finance.accountName();
    this._number = number || faker.finance.creditCardNumber().replace(/-/g, '');
    this._name = name || faker.person.fullName();
    this._cvv = cvv || faker.finance.creditCardCVV();
    this._exp = exp || faker.date.month();
    this._password = password || faker.internet.password();
    this._isVirtual = isVirtual || faker.datatype.boolean();
    this._isCredit = isCredit || faker.datatype.boolean();
    this._isDebit = isDebit || faker.datatype.boolean();
  }

  generate() {
    return {
      title: this._title,
      number: this._number,
      name: this._name,
      cvv: this._cvv,
      exp: this._exp,
      password: this._password,
      isVirtual: this._isVirtual,
      isCredit: this._isCredit,
      isDebit: this._isDebit,
    };
  }
}
