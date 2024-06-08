import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  async sendActivationMail(to: string) {
    try {
      await this.mailService.sendMail({
        from: 'lotinsk@gmail.com',
        to,
        subject: 'Activation link',
        text: `Your activation link is:`,
        html: `<a href=${`http://localhost:3000/`}>Your activation}</a>`,
      });
    } catch (error) {
      return error;
    }
  }

  // async sendEmail() {
  //   await this.mailService.sendMail({
  //     from: 'lotinsk@gmail.com',
  //     to: 'rahmatov.ruslan.02@bk.ru',
  //     subject: 'subject',
  //     text: 'text',
  //     html: '<b>welcome html</b>',
  //   });
  // }

  // async sendEmail(email: string, confirmationCode: string) {
  //   await this.mailService.sendMail({
  //     from: 'lotinsk@gmail.com',
  //     to: email,
  //     subject: `Confirm your email ${email}`,
  //     text: `Please confirm your email by clicking the following link: ${confirmationCode}`,
  //     html: `<p>Please confirm your email by clicking the following link: <a href="${confirmationCode}">${confirmationCode}</a></p>`,
  //   });
  // }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user)
      throw new BadRequestException(
        `Такой пользователь ${createUserDto.email} уже существует!`,
      );
    // const confirmationCode = Math.floor(1000 + Math.random() * 9000).toString();
    await this.sendActivationMail(createUserDto.email);

    const newUser = this.userRepository.create(createUserDto);
    newUser.confirmationCode = true;
    if (!newUser) throw new BadRequestException(`Введите все атрибуты`);
    return await this.userRepository.save(newUser);
  }

  async auth(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
    if (!user) throw new BadRequestException('Вы не зарегистрированы!');
    return user;
  }

  async findAll() {
    const user = await this.userRepository.find();
    if (!user) throw new NotFoundException('Пользователей нет!');
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException(`Пользователь с ${id} не найден!`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException('Такого пользователя нет!');
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException(`Такого пользователя с ${id} нет!`);
    return await this.userRepository.delete(id);
  }
}
