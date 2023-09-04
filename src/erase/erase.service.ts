import { NotesService } from './../notes/notes.service';
import { CardsService } from '@/cards/cards.service';
import { CredentialsService } from '@/credentials/credentials.service';
import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EraseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cardsService: CardsService,
    private readonly credentialsService: CredentialsService,
    private readonly notesService: NotesService,
  ) {}

  async deleteAccount(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) throw new UnauthorizedException('Invalid password');

    await Promise.all([
      this.cardsService.deleteAllCards(user.id),
      this.credentialsService.deleteAllCredentials(user.id),
      this.notesService.deleteAllNotes(user.id),
    ]);

    await this.usersService.deleteUser(user.id);
  }
}
