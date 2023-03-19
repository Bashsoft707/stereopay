import { Repository } from "typeorm";
import { EntityRepository } from "typeorm/";
import { Media } from "./entities/media.entity";

@EntityRepository(Media)
export class UserRepository extends Repository<Media> {}