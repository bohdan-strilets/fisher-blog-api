import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatisticsDocument = HydratedDocument<Statistics>;

@Schema({ versionKey: false, _id: false })
export class Statistics {
  @Prop({ default: 0 })
  numberViews: number;

  @Prop({ default: 0 })
  numberLikes: number;

  @Prop({ default: 0 })
  numberComments: number;

  @Prop({ default: 0 })
  readingTime: number;
}
