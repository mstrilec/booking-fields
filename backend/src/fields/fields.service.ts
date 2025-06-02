import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import { DelayService } from '../delay/delay.service';
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
import { CITY_COORDINATES } from '../utils/constants';
import { convertRating, convertUserRatingTotal } from '../utils/functions';
import { LoggerService } from '../utils/logger.service';

@Injectable()
export class FieldsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly delayService: DelayService,
    @InjectRepository(Field)
    private fieldsRepo: Repository<Field>,
  ) {}
  async getNearbyFields(
    options: FindNearbyFieldsOptions = {},
  ): Promise<{ fields: GooglePlacesResult[]; nextPageToken?: string | null }> {
    const baseGoogleUrl = this.configService.get<string>('GOOGLE_URL');
    const defaultCityName = this.configService.get<string>(
      'DEFAULT_CITY',
      'Kyiv',
    );
    const defaultCity = Object.keys(City).includes(
      defaultCityName as keyof typeof City,
    )
      ? City[defaultCityName as keyof typeof City]
      : City.Kyiv;
    const defaultRadius = this.configService.get<number>(
      'DEFAULT_RADIUS',
      10000,
    );
    const defaultType = this.configService.get<string>(
      'DEFAULT_TYPE',
      'stadium',
    );
    const {
      city = defaultCity,
      radius = defaultRadius,
      type = defaultType,
      pageToken,
    } = options;

    const location = CITY_COORDINATES[city];
    const key = process.env.GOOGLE_API_KEY;
    let url: string;

    if (pageToken) {
      url = `${baseGoogleUrl}pagetoken=${pageToken}&key=${key}`;

      url += `&cacheBuster=${Date.now()}`;
    } else {
      url = `${baseGoogleUrl}location=${location}&radius=${radius}&type=${type}&key=${key}`;
    }

    if (pageToken) {
      await this.delayService.wait(2000);
    }

    try {
      const response: AxiosResponse<GoogleNearbySearchResponse> =
        await this.httpService.axiosRef.get(url);

      return {
        fields: response.data.results,
        nextPageToken: response.data.next_page_token || null,
      };
    } catch {
      LoggerService.error('Error fetching data from Google Places API');
      throw new Error('Failed to fetch data from Google Places API');
    }
  }

  async getFieldByPlaceId(placeId: string): Promise<FieldDetails> {
    const baseGoogleUrl = this.configService.get<string>('GOOGLE_URL_DETAILS');
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `${baseGoogleUrl}place_id=${placeId}&key=${apiKey}`;

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
        address: result.vicinity || result.formatted_address,
        phoneNumber:
          localField?.phoneNumber ?? result.international_phone_number,
        price: localField?.price,
        additionalInfo: localField?.additionalInfo,
        location: result.geometry?.location,
        website: result.website,
        rating: result.rating,
        userRatingTotal: result.user_ratings_total,
        icon: result.icon,
        reviews: result.reviews ?? [],
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
      LoggerService.error(
        `Error creating field with placeId ${placeId}:`,
        error,
      );
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
    const allCities = Object.values(City);

    for (const city of allCities) {
      LoggerService.log(`🔄 Synchronization of fields for the city: ${city}`);

      let nextPageToken: string | null | undefined = undefined;

      do {
        const { fields, nextPageToken: newToken } = await this.getNearbyFields({
          city,
          pageToken: nextPageToken,
        });

        for (const apiField of fields) {
          const placeId = apiField.place_id;

          try {
            const details = await this.getFieldByPlaceId(placeId);

            const existingField = await this.fieldsRepo.findOne({
              where: { placeId },
            });

            if (existingField) {
              this.fieldsRepo.merge(existingField, {
                name: details.name,
                address: details.address,
                phoneNumber: details.phoneNumber ?? undefined,
                price: details.price ?? undefined,
                additionalInfo: details.additionalInfo ?? undefined,
                location: details.location,
                website: details.website,
                rating: convertRating(details.rating),
                userRatingTotal: convertUserRatingTotal(
                  details.userRatingTotal,
                ),
                reviews: details.reviews,
                photos: details.photos,
              });

              await this.fieldsRepo.save(existingField);
              LoggerService.log(`📝 Updated field: ${placeId}`);
            } else {
              const newField = this.fieldsRepo.create({
                placeId: details.placeId,
                name: details.name,
                address: details.address,
                phoneNumber: details.phoneNumber ?? undefined,
                price: details.price ?? undefined,
                additionalInfo: details.additionalInfo ?? undefined,
                location: details.location,
                website: details.website,
                rating: convertRating(details.rating),
                userRatingTotal: convertUserRatingTotal(
                  details.userRatingTotal,
                ),
                reviews: details.reviews,
                photos: details.photos,
              });

              await this.fieldsRepo.save(newField);
              LoggerService.log(`➕ Created new field: ${placeId}`);
            }

            await this.delayService.wait(250);
          } catch (error) {
            LoggerService.warn(
              `⚠️ Failed to sync field ${placeId}: ${
                error && typeof error === 'object' && 'message' in error
                  ? (error as { message: string }).message
                  : error
              }`,
            );
          }
        }

        nextPageToken = newToken;

        if (nextPageToken) {
          await this.delayService.wait(2000);
        }
      } while (nextPageToken);

      LoggerService.log(`✅ Completed sync for the city: ${city}`);
    }

    LoggerService.log(`🎉 Synchronization completed for all cities`);
  }
}
