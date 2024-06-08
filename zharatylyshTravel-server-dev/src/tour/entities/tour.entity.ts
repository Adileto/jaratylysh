import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "../../review/entities/review.entity";
import { User } from "src/user/entities/user.entity";
import { Sight } from "src/sights/entities/sight.entity";
import { BookedTour } from "src/booked-tour/entities/booked-tour.entity";

@Entity('tour')
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  price: number;

  @Column()
  amount: number;

  @Column()
  img: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column({default: false})
  isApprove: boolean;

  // @Column({nullable: true, type: 'float'})
  // average: number

  // relation
  @OneToMany(() => Review, (review) => review.tour, {onDelete: 'CASCADE'})
  review: Review[]

  @ManyToOne(() => User, (user) => user.toures, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User

  @OneToMany(() => Sight, (sight) => sight.tour, {onDelete: 'CASCADE'})
  sights: Sight[]

  @OneToMany(() => BookedTour, (bookedTour) => bookedTour.tour, {onDelete: 'CASCADE'})
  bookedTour: BookedTour[]

}
