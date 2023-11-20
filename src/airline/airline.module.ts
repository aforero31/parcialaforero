import { Module } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { AirlineEntity } from './airline.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineController } from './airline.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  providers: [AirlineService],
  controllers: [AirlineController]
})
export class AirlineModule {}
