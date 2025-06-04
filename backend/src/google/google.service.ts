import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { Readable } from 'stream';
import { GeocodeResponse } from '../types/interfaces';

@Injectable()
export class GoogleService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getPhoto(
    photoReference: string,
    maxwidth: string,
    res: Response,
  ): Promise<void> {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photoReference}&key=${apiKey}`;

    const response: AxiosResponse<Readable> = await lastValueFrom(
      this.httpService.get<Readable>(url, {
        responseType: 'stream',
      }),
    );

    response.data.pipe(res);
  }

  async getGeocode(lat: string, lng: string): Promise<GeocodeResponse> {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=uk`;

    const response: AxiosResponse<GeocodeResponse> = await lastValueFrom(
      this.httpService.get<GeocodeResponse>(url),
    );

    return response.data;
  }
}
