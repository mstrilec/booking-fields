import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('photo/:photoReference')
  getPhoto(
    @Param('photoReference') photoReference: string,
    @Query('maxwidth') maxwidth: string = '400',
    @Res() res: Response,
  ) {
    return this.googleService.getPhoto(photoReference, maxwidth, res);
  }

  @Get('geocode')
  getGeocode(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.googleService.getGeocode(lat, lng);
  }
}
