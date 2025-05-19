import { Injectable } from '@nestjs/common';

@Injectable()
export class DelayService {
  async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
