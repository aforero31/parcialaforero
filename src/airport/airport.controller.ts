import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportEntity } from './airport.entity';
import { AirportDto } from './airport.dto';
import { plainToInstance } from 'class-transformer';

@Controller('airports')
export class AirportController {
    constructor(private readonly airportService: AirportService) {}

    @Get()
    async findAll() {
        return await this.airportService.findAll();
    }

    @Get(':airportId')
    async findOne(@Param('airportId') airportId: string) {
        return await this.airportService.findOne(airportId);
    }

    @Post()
    async create(@Body() airportDto: AirportDto) {
        const airline: AirportEntity = plainToInstance(AirportEntity, airportDto);
        return await this.airportService.create(airline);
    }

    @Put(':airportId')
    async update(@Param('airportId') airportId: string, @Body() airportDto: AirportDto) {
        const airline: AirportEntity = plainToInstance(AirportEntity, airportDto);
        return await this.airportService.update(airportId, airline);
    }

    @Delete(':airportId')
    @HttpCode(204)
    async delete(@Param('airportId') airportId: string) {
        return await this.airportService.delete(airportId);
    }
}
