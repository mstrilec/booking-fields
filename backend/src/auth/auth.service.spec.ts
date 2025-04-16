import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmail: jest.Mock;
    create: jest.Mock;
  };
  let jwtService: {
    sign: jest.Mock;
  };

  let mockUser: Pick<
    User,
    'id' | 'email' | 'password' | 'firstName' | 'lastName' | 'role'
  >;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    mockUser = {
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
    };

    usersService = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockResolvedValue(mockUser),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mockToken'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should login successfully with correct credentials', async () => {
    const result = await service.login({
      email: mockUser.email,
      password: 'password123',
    });

    expect(result.accessToken).toBe('mockToken');
    expect(result.user.email).toBe(mockUser.email);
  });

  it('should throw UnauthorizedException with wrong password', async () => {
    jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(false);

    await expect(
      service.login({ email: mockUser.email, password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should register a new user', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    const result = await service.register({
      email: 'new@example.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'User',
    });

    expect(result.accessToken).toBe('mockToken');
    expect(usersService.create).toHaveBeenCalled();
  });

  it('should throw ConflictException if user already exists', async () => {
    await expect(
      service.register({
        email: mockUser.email,
        password: '123456',
        firstName: 'Test',
        lastName: 'User',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
