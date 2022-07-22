import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "src/management/entities/profiles.entity";
import { DataSource, Repository } from "typeorm";
import { UserCreationDTO } from "../entities/dtos/user-creation.dto";
import { User } from "../entities/users.entity";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        private dataSource: DataSource
    ) {}

    async create(userCreationDTO: UserCreationDTO) : Promise<Profile> {
        let user = new User();
        let profile = new Profile();

        user.email = userCreationDTO.email;
        user.password = userCreationDTO.password;
        user.phoneNumber = userCreationDTO.phoneNumber;

        profile.name = userCreationDTO.name;
        profile.surname = userCreationDTO.surname;
        profile.user = user;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            await this.userRepository.save(user);
            let profileCreated = await this.profileRepository.save(profile);

            return profileCreated;

        } catch(err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            queryRunner.release();
        }
    }
}