import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Location, LocationDocument } from './location.schema';
import {
  SocialNetworks,
  SocialNetworksDocument,
} from './social-networks.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: new Date() })
  dateBirth: Date;

  @Prop({ default: 'other', enum: ['man', 'woman', 'other'] })
  gender: 'man' | 'woman' | 'other';

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  profession: string;

  @Prop({ default: null })
  phoneNumber: string;

  @Prop({ type: Location, default: {} })
  location: LocationDocument;

  @Prop({ type: SocialNetworks, default: {} })
  socialNetworks: SocialNetworksDocument;

  @Prop({ default: [], type: [String] })
  hobby: string[];

  @Prop({ required: true })
  avatarURL: string;

  @Prop({ required: true })
  posterURL: string;

  @Prop({ required: true })
  activationToken: string;

  @Prop({ default: false })
  isActivated: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
