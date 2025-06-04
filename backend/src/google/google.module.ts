import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [HttpModule],
  providers: [GoogleService],
  controllers: [GoogleController],
})
export class GoogleModule {}
