import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../database/data-source';
import { Booking } from '../entities/booking.entity';
import { Comment } from '../entities/comment.entity';
import { Field } from '../entities/field.entity';
import { User } from '../entities/user.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const userRepository = AppDataSource.getRepository(User);
  const fieldRepository = AppDataSource.getRepository(Field);
  const bookingRepository = AppDataSource.getRepository(Booking);
  const commentRepository = AppDataSource.getRepository(Comment);

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = Array.from({ length: 5 }, () =>
    userRepository.create({
      email: faker.internet.email(),
      password: hashedPassword,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement(['admin', 'user']),
      phoneNumber: faker.phone.number(),
    }),
  );

  await userRepository.save(users);
  console.log('Users seeded');

  const fields = Array.from({ length: 3 }, () =>
    fieldRepository.create({
      placeId: faker.string.uuid(),
      phoneNumber: faker.phone.number(),
      price: Number(faker.commerce.price({ min: 20, max: 50, dec: 2 })),
      additionalInfo: faker.lorem.sentence(),
    }),
  );

  await fieldRepository.save(fields);
  console.log('Fields seeded');

  const bookings = Array.from({ length: 5 }, () =>
    bookingRepository.create({
      user: faker.helpers.arrayElement(users),
      field: faker.helpers.arrayElement(fields),
      startTime: faker.date.soon(),
      endTime: faker.date.soon({ days: 1 }),
      status: faker.helpers.arrayElement(['pending', 'confirmed', 'cancelled']),
    }),
  );

  await bookingRepository.save(bookings);
  console.log('Bookings seeded');

  const comments = Array.from({ length: 10 }, () =>
    commentRepository.create({
      text: faker.lorem.sentences({ min: 1, max: 3 }),
      user: faker.helpers.arrayElement(users),
      field: faker.helpers.arrayElement(fields),
    }),
  );

  await commentRepository.save(comments);
  console.log('Comments seeded');

  await AppDataSource.destroy();
  console.log('Database connection closed');
}

seed().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
