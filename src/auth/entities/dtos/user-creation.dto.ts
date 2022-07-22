import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Min } from "class-validator";

export class UserCreationDTO {
    @IsEmail()
    email: string;
    @IsPhoneNumber('MA')
    phoneNumber: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    surname: string;
    @IsNotEmpty()
    name: string;

    constructor(email: string, phoneNumber: string, password: string, name: string, surname: string) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.name = name;
        this.surname = surname;
    }
}