import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import { UpdateFieldDto } from '../dto/update-field.dto';
import { Field } from '../entities/field.entity';
import {
  FieldDetails,
  GoogleNearbySearchResponse,
  GooglePlaceDetailsResponse,
  GooglePlacesResult,
} from '../types/interfaces';

@Injectable()
export class FieldsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Field)
    private fieldsRepo: Repository<Field>,
  ) {}

  async getNearbyFields(): Promise<GooglePlacesResult[]> {
    const location = '50.4501,30.5234';
    const radius = 5000;
    const type = 'stadium';
    const key = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${key}`;

    const response: AxiosResponse<GoogleNearbySearchResponse> =
      await this.httpService.axiosRef.get(url);
    return response.data.results;
  }

  async getFieldByPlaceId(placeId: string): Promise<FieldDetails> {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    try {
      const response: AxiosResponse<GooglePlaceDetailsResponse> =
        await this.httpService.axiosRef.get(url);
      const data = response.data;

      if (data.status !== 'OK' || !data.result) {
        throw new NotFoundException('Field not found in Google Places API');
      }

      const result = data.result;

      return {
        placeId: result.place_id,
        name: result.name,
        address: result.formatted_address,
        phoneNumber: result.international_phone_number,
        location: result.geometry?.location,
        website: result.website,
        reviews: result.reviews,
      };
    } catch {
      throw new NotFoundException('Field not found');
    }
  }

  async updateField(placeId: string, dto: UpdateFieldDto): Promise<Field> {
    let field = await this.fieldsRepo.findOne({ where: { placeId } });

    if (!field) {
      const googleField = await this.getFieldByPlaceId(placeId);
      field = this.fieldsRepo.create({
        placeId: googleField.placeId,
        phoneNumber: googleField.phoneNumber,
      });
    }

    if (!field) {
      throw new NotFoundException('Field not found');
    }

    Object.assign(field, dto);
    return this.fieldsRepo.save(field);
  }

  async syncNearbyFields(): Promise<void> {
    const fieldsFromApi = await this.getNearbyFields();

    for (const apiField of fieldsFromApi) {
      const exists = await this.fieldsRepo.findOne({
        where: { placeId: apiField.place_id },
      });

      if (!exists) {
        const newField = this.fieldsRepo.create({
          placeId: apiField.place_id,
          phoneNumber: undefined,
          price: undefined,
          additionalInfo: undefined,
        });
        await this.fieldsRepo.save(newField);
      }
    }
  }
}
