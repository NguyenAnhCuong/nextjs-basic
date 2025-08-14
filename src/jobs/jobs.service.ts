import { Injectable } from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { User } from "src/decorator/customize";
import { IUser } from "src/users/user.interface";
import { Job, JobDocument } from "./schema/job.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { InjectModel } from "@nestjs/mongoose";
import dayjs from "dayjs";
import aqp from "api-query-params";
import mongoose from "mongoose";

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private JobModel: SoftDeleteModel<JobDocument>
  ) {}

  async create(createJobDto: CreateJobDto, user: IUser) {
    const { startDate, endDate } = createJobDto;
    const checkStartDate = dayjs(startDate);
    const checkEndDate = dayjs(endDate);

    if (checkEndDate.isBefore(checkStartDate)) {
      throw new Error("End date must be after start date");
    }

    return this.JobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, population, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.JobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.JobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Invalid ID";
    }
    return this.JobModel.findById(id);
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const updated = await this.JobModel.updateOne(
      { _id: id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.JobModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
      }
    );
    return this.JobModel.softDelete({
      _id: id,
    });
  }
}
