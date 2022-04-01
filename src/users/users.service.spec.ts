import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import {
  createConnection,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const testConnectionName = 'testConnection';
  let repository: Repository<User>;

  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    const connection = await createConnection({
      type: 'postgres',
      url: 'postgres://postgres:postgres@localhost:5432/walthrough',
      dropSchema: true,
      entities: [User],
      synchronize: true,
      logging: false,
      name: testConnectionName,
    });

    repository = getRepository(User, testConnectionName);

    service = new UsersService(repository);
    return connection;
  });

  afterAll(async () => {
    await getConnection(testConnectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be registerUser', async () => {
    const dto: UserRegisterDto = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@email.com',
      phone: '+00000000',
      password: 'password',
    };
    const res = await service.registerUser(dto);
    expect(res).toBeDefined();
  });

  it('should be showAll', async () => {
    const res = await service.showAll();
    expect(res).toBeDefined();
  });

  it('should be findById', async () => {
    const res = await service.findById(1);
    expect(res).toBeDefined();
  });

  it('should be update', async () => {
    const dto: UpdateUserDto = {
      firstName: 'test_update',
    };
    const res = await service.update(1, dto);
    expect(res).toBeUndefined();
  });

  it('should be destroy', async () => {
    const res = await service.destroy(1);
    expect(res).toBeUndefined();
  });
});
