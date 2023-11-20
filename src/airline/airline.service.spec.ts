import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let entityList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase(); 
  });

  const seedDatabase = async () => {
    repository.clear();
    entityList = [];
    for(let i = 0; i < 9; i++){
        const entity: AirlineEntity = await repository.save({
          name: faker.lorem.sentence({ min: 3, max: 6 })})
          entityList.push(entity);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airline', async () => {
    const entities: AirlineEntity[] = await service.findAll();
    expect(entities).not.toBeNull();
    expect(entities).toHaveLength(entityList.length);
  });

  it('findOne should return a airline by id', async () => {
    const entity: AirlineEntity = entityList[0];
    const found: AirlineEntity = await service.findOne(entity.id);
    expect(found).not.toBeNull();
    expect(found.name).toEqual(entity.name)
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('create should return a new airline', async () => {
    const entity: AirlineEntity = {
      id: '',
      name: faker.lorem.sentence({ min: 3, max: 6 }),
      description: faker.lorem.paragraphs({ min: 3, max: 6 }),
      createAt: faker.lorem.sentence({ min: 3, max: 6 }),
      website: faker.lorem.sentence({ min: 3, max: 6 }),
      airports: []
    }
    
    const created: AirlineEntity = await service.create(entity);
    expect(created).not.toBeNull();
 
    const stored: AirlineEntity = await repository.findOne({where: {id: created.id}})
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(created.name)
  });

  it('update should modify a airline', async () => {
    const entity: AirlineEntity = entityList[0];
    entity.name = "New name";
    entity.description = "New description";
    entity.createAt = "New createAt";
    entity.website = "New website";

    const updated: AirlineEntity = await service.update(entity.id, entity);
    expect(updated).not.toBeNull();

    const stored: AirlineEntity = await repository.findOne({ where: { id: entity.id } })
    expect(stored).not.toBeNull();
    expect(stored.name).toEqual(entity.name)
    expect(stored.description).toEqual(entity.description)
    expect(stored.createAt).toEqual(entity.createAt)
    expect(stored.website).toEqual(entity.website)
  });

  it('update should throw an exception for an invalid airline', async () => {
    let entity: AirlineEntity = entityList[0];
    entity = {
      ...entity, name: "New name"
    }
    await expect(() => service.update("0", entity)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('delete should remove a airline', async () => {
    const entity: AirlineEntity = entityList[0];
    await service.delete(entity.id);
    const deleted: AirlineEntity = await repository.findOne({ where: { id: entity.id } })
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });



});
