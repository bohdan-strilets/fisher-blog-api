import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SocialNetworksDocument = HydratedDocument<SocialNetworks>;

@Schema({ versionKey: false, _id: false })
export class SocialNetworks {
  @Prop({ default: null })
  facebook: string;

  @Prop({ default: null })
  instagram: string;

  @Prop({ default: null })
  twitter: string;

  @Prop({ default: null })
  pinterest: string;
}
