import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { Repository } from "typeorm";

import { CreateAddressDto, UpdateAddressDto } from "./dtos";
import { AddressEntity } from "./entities";
import { AddressVM } from "./vms";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity) private readonly addressRepository: Repository<AddressEntity>,
    private readonly i18nService: I18nService,
  ) {}

  async getAddresses(userId: string): Promise<AddressVM[]> {
    return await this.addressRepository.find({
      where: { user: { id: userId } },
    });
  }

  async create(userId: string, data: CreateAddressDto): Promise<AddressVM> {
    const address = this.addressRepository.create({
      user: { id: userId },
      ...data,
    });

    return await this.addressRepository.save(address);
  }

  async update(id: string, data: UpdateAddressDto): Promise<AddressVM> {
    const address = await this.addressRepository.preload({
      id,
      ...data,
    });

    if (!address) {
      throw new NotFoundException(this.i18nService.t("address.not-found"));
    }

    return await this.addressRepository.save(address);
  }

  async delete(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(this.i18nService.t("address.not-found"));
    }
  }
}
