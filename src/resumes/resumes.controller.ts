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
import { ResumesService } from "./resumes.service";
import { CreateResumeDto, CreateUserCvDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { ResponseMessage, User } from "src/decorator/customize";
import { IUser } from "src/users/user.interface";

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage("create new a resume")
  create(@Body() createResumeDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Post("by-user")
  @ResponseMessage("get resume by user")
  getRsumesByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user);
  }

  @Get()
  @ResponseMessage("get resume with paginate")
  findAll(
    @Query("current") page: number,
    @Query("pageSize") limit: number,
    @Query() qs: string
  ) {
    return this.resumesService.findAll(+page, +limit, qs);
  }

  @Get(":id")
  @ResponseMessage("get resume by id")
  findOne(@Param("id") id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(":id")
  @ResponseMessage("update status resume")
  update(
    @Param("id") id: string,
    @Body("status") status: string,
    @User() user: IUser
  ) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(":id")
  @ResponseMessage("delete resume")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
