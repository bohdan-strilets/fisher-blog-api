import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({ versionKey: false, _id: false })
export class Location {
  @Prop({ default: null })
  country: string;

  @Prop({ default: null })
  city: string;

  @Prop({ default: null })
  postcode: string;
}
