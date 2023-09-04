import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CredentialsRepository } from './credentials.repository';
import { CredentialDto } from './dto/credential.dto';

@Injectable()
export class CredentialsService {
  constructor(private readonly repository: CredentialsRepository) {}

  async createCredential(userId: number, credentialsDTO: CredentialDto) {
    const credential = await this.repository.findCredentialByUserIdAndTitle( userId, credentialsDTO.title );
    if (credential) throw new ConflictException();
    return await this.repository.createCredential(userId, credentialsDTO);
  }

  async findAllCredentialsByUserId(userId: number) {
    return await this.repository.findAllCredentialsByUserId(userId);
  }

  async findCredentialById(id: number, userId: number) {
    const credential = await this.repository.findCredentialById(id);
    if (credential.length === 0) throw new NotFoundException();
    if (credential[0].userId !== userId) throw new ForbiddenException();
    return credential;
  }

  async deleteCredential(id: number, userId: number) {
    const credential = await this.repository.findCredentialById(id);
    if (credential.length === 0) throw new NotFoundException();
    if (credential[0].userId !== userId) throw new ForbiddenException();
    return await this.repository.deleteCredential(id);
  }

  async deleteAllCredentials(userId: number) {
    return await this.repository.deleteAllCredentials(userId);
  }
}
