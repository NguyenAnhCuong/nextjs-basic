import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "src/users/user.interface";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage("Create new job")
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Get all jobs with pagination")
  findAll(
    @Query("current") page: number,
    @Query("pageSize") limit: number,
    @Query() qs: string
  ) {
    return this.jobsService.findAll(+page, +limit, qs);
  }

  @Get(":id")
  @Public()
  @ResponseMessage("Get job by ID")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(":id")
  @ResponseMessage("Update job by ID")
  update(
    @Param("id") id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete job by ID")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
