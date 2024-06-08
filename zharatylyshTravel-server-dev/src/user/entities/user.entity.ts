import { BookedTour } from 'src/booked-tour/entities/booked-tour.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Review } from 'src/review/entities/review.entity';
import { Sight } from 'src/sights/entities/sight.entity';
import { Tour } from 'src/tour/entities/tour.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createDate: Date;

  @Column({ nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  confirmationCode: boolean;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  cardNumber: string;

  // relation
  @OneToMany(() => Tour, (tour) => tour.user, { onDelete: 'CASCADE' })
  toures: Tour[];

  @OneToMany(() => Review, (review) => review.user, { onDelete: 'CASCADE' })
  reviews: Review[];

  @OneToMany(() => Sight, (sight) => sight.user, { onDelete: 'CASCADE' })
  sights: Sight[];

  @OneToMany(() => BookedTour, (booked) => booked.user, { onDelete: 'CASCADE' })
  bookedTour: BookedTour[];

  // payments
  @OneToMany(() => Payment, (payment) => payment.user, { onDelete: 'CASCADE' })
  payments: Payment[];
}
