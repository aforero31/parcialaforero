import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AirlineService } from '../airline/airline.service';
import { AirportDto } from '../airport/airport.dto';
import { AirportEntity } from '../airport/airport.entity';
import { plainToInstance } from 'class-transformer';
import { AirlineAirportService } from './airline-airport.service';

@Controller('airlines')
export class AirlineAirportController {
    constructor(
        private readonly airlineService: AirlineAirportService,
      ) {}

    @Post(':airlineId/airports/:airportId')
    async addAirportAirline(
        @Param('airlineId') airlineId: string,
        @Param('airportId') airportId: string,
    ) {
        return await this.airlineService.addAirportAirline(
            airlineId,
            airportId,
        );
    }


    @Get(':airlineId/airports/:airportId')
    async findAirportByAirlineIdAirportId(
        @Param('cultureId') cultureId: string,
        @Param('countryId') countryId: string,
    ) {
        return await this.airlineService.findAirportByAirlineIdAirportId(
        cultureId,
        countryId,
        );
    }


    @Get(':cultureId/countries')
    async findAirportByAirlineId(@Param('cultureId') cultureId: string) {
        return await this.airlineService.findAirportByAirlineId(
        cultureId,
        );
    }

    @Put(':airlineId/airports')
    async associateAirportsToAirlines(
        @Body() airportDto: AirportDto[],
        @Param('airlineId') airlineId: string,
    ) {
        const airports = plainToInstance(AirportEntity, airportDto);
        return await this.airlineService.associateAirportsToAirlines(
            airlineId,
            airports,
        );
    }


    @Delete(':airlineId/airports/:airportId')
    @HttpCode(204)
    async deleteAirportByAirlineIdAirportId(
        @Param('airlineId') airlineId: string,
        @Param('airportId') airportId: string,
    ) {
        return await this.airlineService.deleteAirportByAirlineIdAirportId(
            airlineId,
            airportId,
        );
    }
}
