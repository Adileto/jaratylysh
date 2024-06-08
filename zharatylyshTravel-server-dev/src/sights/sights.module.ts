import { Module } from '@nestjs/common';
import { SightsService } from './sights.service';
import { SightsController } from './sights.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sight } from './entities/sight.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sight])
  ],
  controllers: [SightsController],
  providers: [SightsService]
})
export class SightsModule {}
