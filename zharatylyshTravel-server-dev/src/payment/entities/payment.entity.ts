import { BookedTour } from 'src/booked-tour/entities/booked-tour.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stripePaymentIntentId: string;

  @Column()
  price: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.payments, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  @OneToOne(() => BookedTour, (bookedTour) => bookedTour.payments, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  bookedTour: BookedTour;
}
