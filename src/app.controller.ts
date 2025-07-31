import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  // private readonly appService: AppService;
  // constructor(appService: AppService) {
  //   this.appService = appService;
  // }
  //====
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Render('home')
  getHello() {
    const message = this.appService.getHello();
    return { message: message };
  }
}
