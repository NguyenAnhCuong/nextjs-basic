import { Injectable } from "@nestjs/common";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Company, CompanyDocument } from "./schemas/company.schema";
import { InjectModel } from "@nestjs/mongoose";
import { IUser } from "src/users/user.interface";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private CompanyModel: SoftDeleteModel<CompanyDocument>
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.CompanyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.CompanyModel.updateOne(
      { _id: id },
      { ...updateCompanyDto, createdBy: { _id: user._id, email: user.email } }
    );
  }

  async remove(id: string) {
    return await this.CompanyModel.deleteOne({ _id: id });
  }
}
