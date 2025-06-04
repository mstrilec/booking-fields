import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../database/data-source';
import { Booking } from '../entities/booking.entity';
import { Comment } from '../entities/comment.entity';
import { Field } from '../entities/field.entity';
import { User } from '../entities/user.entity';

const BATCH_SIZE = 1000;

const NUM_USERS = 50000;
const NUM_FIELDS = 50000;
const NUM_BOOKINGS = 300000;
const NUM_COMMENTS = 800000;

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const userRepository = AppDataSource.getRepository(User);
  const fieldRepository = AppDataSource.getRepository(Field);
  const bookingRepository = AppDataSource.getRepository(Booking);
  const commentRepository = AppDataSource.getRepository(Comment);

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.time('Users');
  let insertedUsersCount = 0;
  for (let i = 0; i < NUM_USERS; i++) {
    const email = faker.internet.email();

    const existingUser = await userRepository.findOneBy({ email });

    if (existingUser) {
      continue;
    }

    const user = userRepository.create({
      email,
      password: hashedPassword,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement(['admin', 'user']),
      phoneNumber: faker.phone.number(),
      registrationDate: faker.date.past({ years: 2 }),
    });

    await userRepository.save(user);
    insertedUsersCount++;

    if (insertedUsersCount % 500 === 0) {
      console.log(`${insertedUsersCount} users inserted...`);
    }
  }
  console.timeEnd('Users');

  console.time('Fields');
  const fields: Field[] = [];
  for (let i = 0; i < NUM_FIELDS; i++) {
    fields.push(
      fieldRepository.create({
        name: faker.company.name(),
        placeId: faker.string.uuid(),
        phoneNumber: faker.phone.number(),
        price: Number(faker.commerce.price({ min: 20, max: 50, dec: 2 })),
        rating: Number((Math.random() * 5).toFixed(1)),
        location: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        additionalInfo: faker.lorem.sentence(),
        address: faker.location.streetAddress(),
        website: faker.internet.url(),
        userRatingTotal: faker.number.int({ min: 0, max: 100 }),
      }),
    );
    if (fields.length >= BATCH_SIZE || i === NUM_FIELDS - 1) {
      await fieldRepository.save(fields.splice(0, fields.length));
    }
  }
  console.timeEnd('Fields');

  const allUsers = await userRepository.find();
  const allFields = await fieldRepository.find();

  console.time('Bookings');
  const bookings: Booking[] = [];
  for (let i = 0; i < NUM_BOOKINGS; i++) {
    const start = faker.date.between({
      from: '2023-01-01T00:00:00.000Z',
      to: '2025-06-01T00:00:00.000Z',
    });
    bookings.push(
      bookingRepository.create({
        user: faker.helpers.arrayElement(allUsers),
        field: faker.helpers.arrayElement(allFields),
        startTime: start,
        endTime: new Date(start.getTime() + 60 * 60 * 1000),
        status: faker.helpers.arrayElement([
          'pending',
          'confirmed',
          'cancelled',
        ]),
        createdAt: faker.date.past(),
      }),
    );
    if (bookings.length >= BATCH_SIZE || i === NUM_BOOKINGS - 1) {
      await bookingRepository.save(bookings.splice(0, bookings.length));
    }
  }
  console.timeEnd('Bookings');

  console.time('Comments');
  const comments: Comment[] = [];
  for (let i = 0; i < NUM_COMMENTS; i++) {
    comments.push(
      commentRepository.create({
        text: faker.lorem.sentences({ min: 1, max: 3 }),
        user: faker.helpers.arrayElement(allUsers),
        field: faker.helpers.arrayElement(allFields),
        createdAt: faker.date.past(),
      }),
    );
    if (comments.length >= BATCH_SIZE || i === NUM_COMMENTS - 1) {
      await commentRepository.save(comments.splice(0, comments.length));
    }
  }
  console.timeEnd('Comments');

  await AppDataSource.destroy();
  console.log('Database connection closed');
}

seed().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
