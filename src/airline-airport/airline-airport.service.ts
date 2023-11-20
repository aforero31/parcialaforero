import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(AirlineEntity)
      private readonly airlineRepository: Repository<AirlineEntity>,
    
    @InjectRepository(AirportEntity)
      private readonly airportRepository: Repository<AirportEntity>,
  ) {}


  async addAirportAirline(airlineId: string, airportId: string) {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The airport with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    
    const airLine: AirlineEntity =
      await this.airlineRepository.findOne({
        where: { id: airlineId },
        relations: ['airports'],
      });
      if (!airLine)
        throw new BusinessLogicException(
          'The airline with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    
      airLine.airports = [...airLine.airports, airport];
      return await this.airlineRepository.save(airLine);
  }
    
  async findAirportByAirlineIdAirportId(
    airlineId: string,
    airportId: string,
  ): Promise<AirportEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });
    if (!airport)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airLine: AirlineEntity =
      await this.airlineRepository.findOne({
        where: { id: airlineId },
        relations: ['airports'],
      });
    if (!airLine)
      throw new BusinessLogicException(
        'The airline with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const airlineAirport: AirportEntity =
    await airLine.airports.find((airport) => airport.id === airportId);
    if (!airlineAirport)
      throw new BusinessLogicException(
        'The country with the given id is not associated with the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
    );

    return airlineAirport;
}

    
    async findAirportByAirlineId(
        airlineId: string,
    ): Promise<AirportEntity[]> {
        const airLine: AirlineEntity =
          await this.airlineRepository.findOne({
            where: { id: airlineId },
            relations: ['airports'],
          });
        if (!airLine)
          throw new BusinessLogicException(
            'The airline with the given id was not found',
            BusinessError.NOT_FOUND,
          );
    
        return airLine.airports;
    }
    
    async associateAirportsToAirlines(
        airlineId: string,
        airports: AirportEntity[],
    ): Promise<AirlineEntity> {
        const airLine: AirlineEntity =
          await this.airlineRepository.findOne({
            where: { id: airlineId },
            relations: ['airports'],
          });
        if (!airLine)
          throw new BusinessLogicException(
            'The airline with the given id was not found',
            BusinessError.NOT_FOUND,
        );
    
        for (const airport of airports) {
          const airportFound: AirportEntity = await this.airportRepository.findOne({
            where: { id: airport.id },
        });
        if (!airportFound)
            throw new BusinessLogicException(
              'The product with the given id was not found',
              BusinessError.NOT_FOUND,
            );
        }
    
        airLine.airports = [...airLine.airports, ...airports];
        return await this.airlineRepository.save(airLine);
    }
    
    async deleteAirportByAirlineIdAirportId(
        airlineId: string,
        airportId: string,
    ): Promise<AirlineEntity> {
        const airLine: AirlineEntity =
          await this.airlineRepository.findOne({
            where: { id: airlineId },
            relations: ['airports'],
          });
        if (!airLine)
          throw new BusinessLogicException(
            'The airline with the given id was not found',
            BusinessError.NOT_FOUND,
          );
    
        const airport = await this.airportRepository.findOne({
          where: { id: airportId },
        });
        if (!airport)
          throw new BusinessLogicException(
            'The airport with the given id was not found',
            BusinessError.NOT_FOUND,
        );
        const airlineAirport: AirportEntity =
          await airLine.airports.find((airport) => airport.id === airportId);
        if (!airlineAirport)
          throw new BusinessLogicException(
            'The airport with the given id is not associated with the airline',
            BusinessError.PRECONDITION_FAILED,
          );
    
        airLine.airports = airLine.airports.filter(
          (airport) => airport.id !== airportId,
        );
        return await this.airlineRepository.save(airLine);
      }
      
}
