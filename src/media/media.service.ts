import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { ErrorResponse, SuccessResponse } from 'src/utils/helper.utils';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PageMetaDto } from './dto/page-meta.dto';
import { PageOptionsDto } from './dto/page-options.dto';
import { PageDto } from './dto/page.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRespository: Repository<Media>,
    private cloudinary: CloudinaryService,
  ) {}

  async create(createMediaDto: CreateMediaDto, file: Express.Multer.File) {
    try {
      const upload = await this.cloudinary.uploader(file);

      const media = await this.mediaRespository.save({
        ...createMediaDto,
        type: upload.resource_type,
        url: upload.url,
      });

      return SuccessResponse('Media created Successfully', media);
    } catch (error) {
      console.log(error);
      return ErrorResponse(error.message);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Media>> {
    const queryBuilder = this.mediaRespository.createQueryBuilder('media');

    queryBuilder
      .orderBy('media.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.perPage);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async search(query: string) {
    try {
      const media = await this.mediaRespository.findOneBy({ name: query });

      if (!media) {
        return ErrorResponse('Media not found');
      }

      return SuccessResponse('Media found', media);
    } catch (error) {
      return ErrorResponse(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const media = await this.mediaRespository.findOneBy({ id });

      if (!media) {
        return ErrorResponse('Media not found');
      }

      return SuccessResponse(`Media with id ${id} found`, media);
    } catch (error) {
      return ErrorResponse(error.message);
    }
  }

  async update(id: string, updateMediaDto: UpdateMediaDto) {
    try {
      const { data } = await this.findOne(id);

      await this.mediaRespository.update({ id }, updateMediaDto);

      return SuccessResponse(`Media updated`, data);
    } catch (error) {
      return ErrorResponse(error.message);
    }
  }

  async remove(id: string) {
    try {
      const media = await this.findOne(id);

      this.mediaRespository.remove(media.data);

      return SuccessResponse('Media deleted');
    } catch (error) {
      return ErrorResponse(error.message);
    }
  }
}
