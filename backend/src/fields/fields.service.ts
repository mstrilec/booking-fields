import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import { UpdateFieldDto } from '../dto/update-field.dto';
import { Field } from '../entities/field.entity';
import { City } from '../types/enums';
import {
  FieldDetails,
  FindNearbyFieldsOptions,
  GoogleNearbySearchResponse,
  GooglePlaceDetailsResponse,
  GooglePlacesResult,
} from '../types/interfaces';
import { CITY_COORDINATES } from '../types/variables';

@Injectable()
export class FieldsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Field)
    private fieldsRepo: Repository<Field>,
  ) {}

  async getNearbyFields(
    options: FindNearbyFieldsOptions = {},
  ): Promise<{ fields: GooglePlacesResult[]; nextPageToken?: string | null }> {
    const {
      city = City.Kyiv,
      radius = 10000,
      type = 'stadium',
      pageToken,
    } = options;

    const location = CITY_COORDINATES[city];
    const key = process.env.GOOGLE_API_KEY;

    console.log('Options: ', options);

    let url;

    if (pageToken) {
      url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${pageToken}&key=${key}`;

      url += `&cacheBuster=${Date.now()}`;
    } else {
      url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${key}`;
    }

    console.log('Запит до Google Places API:', url);

    if (pageToken) {
      console.log('Очікуємо 2 секунди перед запитом з pageToken...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    try {
      const response: AxiosResponse<GoogleNearbySearchResponse> =
        await this.httpService.axiosRef.get(url);

      console.log('Google Places API status:', response.data.status);
      console.log('Results count:', response.data.results?.length || 0);

      return {
        fields: response.data.results,
        nextPageToken: response.data.next_page_token || null,
      };
    } catch (error) {
      console.error('Error fetching from Google Places API:', error);
      throw error;
    }
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

      const localField = await this.fieldsRepo.findOne({
        where: { placeId },
        relations: ['comments', 'comments.user'],
      });

      const comments =
        localField?.comments?.map((comment) => ({
          id: comment.id,
          text: comment.text,
          createdAt: comment.createdAt,
          user: {
            id: comment.user.id,
            firstName: comment.user.firstName,
            lastName: comment.user.lastName,
            email: comment.user.email,
          },
        })) || [];

      return {
        placeId: result.place_id,
        name: result.name,
        address: result.formatted_address,
        phoneNumber:
          localField?.phoneNumber ?? result.international_phone_number,
        price: localField?.price,
        additionalInfo: localField?.additionalInfo,
        location: result.geometry?.location,
        website: result.website,
        reviews: result.reviews,
        photos: result.photos ?? [],
        comments: comments,
      };
    } catch {
      throw new NotFoundException('Field not found');
    }
  }

  async createFieldFromPlaceId(placeId: string): Promise<Field> {
    const existingField = await this.fieldsRepo.findOne({ where: { placeId } });
    if (existingField) {
      return existingField;
    }

    try {
      const fieldData = await this.getFieldByPlaceId(placeId);

      const newField = this.fieldsRepo.create({
        placeId: fieldData.placeId,
        phoneNumber: fieldData.phoneNumber ?? undefined,
        price: undefined,
        additionalInfo: undefined,
      });

      return await this.fieldsRepo.save(newField);
    } catch (error) {
      console.error(`Error creating field with placeId ${placeId}:`, error);
      throw new NotFoundException(
        'Could not create field from Google Places API',
      );
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

    for (const apiField of fieldsFromApi.fields) {
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
