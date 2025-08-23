import { Controller, Get } from "@nestjs/common";
import { MailService } from "./mail.service";
import { Public, ResponseMessage } from "src/decorator/customize";
import { MailerService } from "@nestjs-modules/mailer";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import {
  Subscriber,
  SubscriberDocument,
} from "src/subscribers/schemas/subscriber.schema";
import { Job, JobDocument } from "src/jobs/schemas/job.schema";
import { InjectModel } from "@nestjs/mongoose";
import { name } from "ejs";

@Controller("mail")
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private SubscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name) private JobModel: SoftDeleteModel<JobDocument>
  ) {}
  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    const subscribers = await this.SubscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.JobModel.find({
        skills: { $in: subsSkills },
      });
      //todo
      if (jobWithMatchingSkills?.length > 0) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company.name,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ",
            skills: item.skills,
          };
        });
        await this.mailerService.sendMail({
          to: "hanglong18ch@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: "Welcome to NestJs App! Confirm your Email",
          template: "new-job", // HTML body content
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
      //build template
    }
  }
}
