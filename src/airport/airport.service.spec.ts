import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { AirportEntity } from './airport.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let entityList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase(); 
  });

  const seedDatabase = async () => {
    repository.clear();
    entityList = [];
    for(let i = 0; i < 9; i++){
        const entity: AirportEntity = await repository.save({
          name: faker.lorem.sentence({ min: 3, max: 6 })})
          entityList.push(entity);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airport', async () => {
    const entities: AirportEntity[] = await service.findAll();
    expect(entities).not.toBeNull();
    expect(entities).toHaveLength(entityList.length);
  });

  it('findOne should return a airport by id', async () => {
    const entity: AirportEntity = entityList[0];
    const found: AirportEntity = await service.findOne(entity.id);
    expect(found).not.toBeNull();
    expect(found.name).toEqual(entity.name)
    expect(found.code).toEqual(entity.code)
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('create should return a new airport', async () => {
    const entity: AirportEntity = {
      id: '',
      name: faker.lorem.sentence({ min: 3, max: 6 }),
      code: faker.lorem.paragraphs({ min: 3, max: 2 }),
      country: faker.address.country(),
      city: faker.address.city(),
      airlines: []
    }
    
    const created: AirportEntity = await service.create(entity);
    expect(created).not.toBeNull();
 
    const stored: AirportEntity = await repository.findOne({where: {id: created.id}})
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(created.name)
    expect(stored.code).toEqual(created.code)
    expect(stored.country).toEqual(created.country)
    expect(stored.city).toEqual(created.city)
  });

  it('update should modify a airport', async () => {
    const entity: AirportEntity = entityList[0];
    entity.name = "New name";
    entity.code = "New code";
    entity.country = "New country";
    entity.city = "New city";

    const updated: AirportEntity = await service.update(entity.id, entity);
    expect(updated).not.toBeNull();

    const stored: AirportEntity = await repository.findOne({ where: { id: entity.id } })
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(entity.name)
    expect(stored.code).toEqual(entity.code)
    expect(stored.country).toEqual(entity.country)
    expect(stored.city).toEqual(entity.city)
  });

  it('update should throw an exception for an invalid airport', async () => {
    let entity: AirportEntity = entityList[0];
    entity = {
      ...entity, name: "New name"
    }
    await expect(() => service.update("0", entity)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('delete should remove a airport', async () => {
    const entity: AirportEntity = entityList[0];
    await service.delete(entity.id);
    const deleted: AirportEntity = await repository.findOne({ where: { id: entity.id } })
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });


});
