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
import { SubscribersService } from "./subscribers.service";
import { CreateSubscriberDto } from "./dto/create-subscriber.dto";
import { UpdateSubscriberDto } from "./dto/update-subscriber.dto";
import {
  ResponseMessage,
  SkipCheckPermission,
  User,
} from "src/decorator/customize";
import { IUser } from "src/users/user.interface";

@Controller("subscribers")
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage("Subscriber created successfully")
  create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @User() user: IUser
  ) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Get()
  @ResponseMessage("fetch subcriber with pagination")
  findAll(
    @Query("current") page: number,
    @Query("pageSize") limit: number,
    @Query() qs: string
  ) {
    return this.subscribersService.findAll(+page, +limit, qs);
  }

  @Get(":id")
  @ResponseMessage("fetch subscriber details")
  findOne(@Param("id") id: string) {
    return this.subscribersService.findOne(id);
  }

  @Post("skills")
  @SkipCheckPermission()
  @ResponseMessage("get subscriber skills")
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getUserSkills(user);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage("update subscriber")
  update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser
  ) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(":id")
  @ResponseMessage("remove subscriber")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
