import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokensType } from './types/tokens.type';
import { UserDocument } from 'src/users/schemas/user.schema';
import { PayloadType } from './types/payload.type';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  createPayload(user: UserDocument): PayloadType {
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActivated: user.isActivated,
    };
    return payload;
  }

  async createTokens(payload: CreateTokenDto): Promise<TokensType> {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });

    const tokens = { accessToken, refreshToken };
    const tokensFromDb = await this.TokenModel.findOne({ owner: payload._id });

    if (!tokensFromDb) {
      await this.TokenModel.create({ ...tokens, owner: payload._id });
    }
    if (tokensFromDb) {
      await this.TokenModel.findByIdAndUpdate(tokensFromDb._id, { ...tokens });
    }

    return tokens;
  }

  checkToken(token: string, type: 'access' | 'refresh'): PayloadType | null {
    let payload: PayloadType;

    if (type === 'access') {
      payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } else if (type === 'refresh') {
      payload = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    }

    if (payload) {
      return payload;
    } else {
      return null;
    }
  }

  async findTokenFromDb(userId: Types.ObjectId): Promise<TokenDocument | null> {
    const tokens = await this.TokenModel.findOne({ owner: userId });

    if (tokens) {
      return tokens;
    }

    return null;
  }
}
