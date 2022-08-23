import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Min } from "class-validator";

export class UserCreationDTO {
    @IsEmail()
    email: string;
    @IsPhoneNumber('MA')
    phoneNumber: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    repeatPassword: string;
    @IsNotEmpty()
    surname: string;
    @IsNotEmpty()
    name: string;

    constructor(email: string, phoneNumber: string, password: string, repeatPassword: string, name: string, surname: string) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.repeatPassword = repeatPassword;
        this.name = name;
        this.surname = surname;
    }
}