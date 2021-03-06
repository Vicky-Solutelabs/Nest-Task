import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./entities/user.entity";
import { JwtPayload } from "./jwt-payload.interface";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "Area51",
        });
    }

    async validate(payload:JwtPayload): Promise<User> {
        const {id} = payload;
        const user = this.userRepository.findOne({id});

        if(!user){
            throw new UnauthorizedException();
        }
        
        return user;
    }
}