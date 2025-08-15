import { Controller, Get } from "@nestjs/common";
import { Public, ResponseMessage } from "./decorator/customize";

@Controller()
export class AppController {
  @Public()
  @Get("/day")
  @ResponseMessage("get day")
  getDay() {
    try {
      const day = new Date();
      return { day };
    } catch (error) {
      return { error: error.message };
    }
  }
}
