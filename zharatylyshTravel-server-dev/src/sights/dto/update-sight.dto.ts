import { PartialType } from '@nestjs/mapped-types';
import { CreateSightDto } from './create-sight.dto';

export class UpdateSightDto extends PartialType(CreateSightDto) {}
