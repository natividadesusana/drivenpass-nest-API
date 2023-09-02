import { PartialType } from '@nestjs/swagger';
import { CreateEraseDto } from './create-erase.dto';

export class UpdateEraseDto extends PartialType(CreateEraseDto) {}
