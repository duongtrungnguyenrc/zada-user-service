import { RepositoryService } from "@duongtrungnguyen/micro-commerce";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { Repository } from "typeorm";

import { AddressEntity } from "./entities";

@Injectable()
export class AddressService extends RepositoryService<AddressEntity> {
  constructor(
    @InjectRepository(AddressEntity) addressRepository: Repository<AddressEntity>,
    private readonly i18nService: I18nService,
  ) {
    super(addressRepository);
  }
}
