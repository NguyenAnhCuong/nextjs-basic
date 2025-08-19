import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateResumeDto, CreateUserCvDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { IUser } from "src/users/user.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Resume, ResumeDocument } from "./schemas/resume.schema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import aqp from "api-query-params";
import mongoose from "mongoose";

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private ResumeModel: SoftDeleteModel<ResumeDocument>
  ) {}
  async create(createResumeDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createResumeDto;
    const newCv = await this.ResumeModel.create({
      url,
      companyId,
      jobId,
      userId: user._id,
      status: "PENDING",
      createdBy: { _id: user._id, email: user.email },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      ],
    });

    return {
      _id: newCv?._id,
      createAt: newCv?.createdAt,
    };
  }

  async findByUser(user: IUser) {
    return await this.ResumeModel.find({
      userId: user._id,
    })
      .sort("-createAt")
      .populate([
        { path: "companyId", select: { name: 1 } },
        { path: "jobId", select: { name: 1 } },
      ]);
  }

  async findAll(currentPage: number, limit: number, queryString: string) {
    const { filter, population, sort, projection } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.ResumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.ResumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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
      throw new BadRequestException("Invalid id");
    }
    return await this.ResumeModel.findById(id);
  }

  async update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id");
    }

    const updated = await this.ResumeModel.updateOne(
      {
        _id: id,
      },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        $push: {
          history: {
            status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        },
      }
    );

    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id");
    }
    await this.ResumeModel.updateOne(
      { _id: id },
      {
        deletedBy: { _id: user._id, email: user.email },
      }
    );
    return this.ResumeModel.softDelete({
      _id: id,
    });
  }
}
