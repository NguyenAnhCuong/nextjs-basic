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
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { IUser } from "src/users/user.interface";
import { ResponseMessage, User } from "src/decorator/customize";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("roles")
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage("Create a new Role")
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage("Get all Role with pagination")
  findAll(
    @Query("current") page: number,
    @Query("pageSize") limit: number,
    @Query() qs: string
  ) {
    return this.rolesService.findAll(+page, +limit, qs);
  }

  @Get(":id")
  @ResponseMessage("Get Role by id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(":id")
  @ResponseMessage("update role")
  update(
    @Param("id") id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(":id")
  @ResponseMessage("delete role")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
