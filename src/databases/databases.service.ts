import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import {
  Permission,
  PermissionDocument,
} from "src/permissions/schemas/permission.schema";
import { Role, RoleDocument } from "src/roles/schemas/role.schema";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from "./sample";

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name) private UserModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name)
    private PermissionModel: SoftDeleteModel<PermissionDocument>,
    private configService: ConfigService,
    private UserService: UsersService
  ) {}
  async onModuleInit() {
    const isInit = this.configService.get<string>("SAMPLE_DATA");
    if (Boolean(isInit)) {
      const countUser = await this.UserModel.count({});
      const countPermission = await this.PermissionModel.count({});
      const countRole = await this.RoleModel.count({});

      //create permissions
      if (countPermission === 0) {
        await this.PermissionModel.insertMany(INIT_PERMISSIONS);
        //bulk create
      }

      // create role
      if (countRole === 0) {
        const permissions = await this.PermissionModel.find({}).select("_id");
        await this.RoleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: "Admin thì full quyền :v",
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: "Người dùng/Ứng viên sử dụng hệ thống",
            isActive: true,
            permissions: [], //không set quyền, chỉ cần add ROLE
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.RoleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.RoleModel.findOne({ name: USER_ROLE });
        await this.UserModel.insertMany([
          {
            name: "I'm admin",
            email: "admin@gmail.com",
            password: await this.UserService.hashPassword(
              this.configService.get<string>("INIT_PASSWORD")
            ),
            age: 69,
            gender: "MALE",
            address: "VietNam",
            role: adminRole?._id,
          },
          {
            name: "I'm Hỏi Dân IT",
            email: "hoidanit@gmail.com",
            password: await this.UserService.hashPassword(
              this.configService.get<string>("INIT_PASSWORD")
            ),
            age: 96,
            gender: "MALE",
            address: "VietNam",
            role: adminRole?._id,
          },
          {
            name: "I'm normal user",
            email: "user@gmail.com",
            password: await this.UserService.hashPassword(
              this.configService.get<string>("INIT_PASSWORD")
            ),
            age: 69,
            gender: "MALE",
            address: "VietNam",
            role: userRole?._id,
          },
        ]);
      }

      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        this.logger.log(">>> ALREADY INIT SAMPLE DATA...");
      }
    }
  }
}
