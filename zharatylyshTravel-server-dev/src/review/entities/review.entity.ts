import { Tour } from "src/tour/entities/tour.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('review')
export class Review {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createDate: Date

    @Column()
    rating: number
    
    @Column({nullable: true})
    comment: string

    @Column({nullable: true})
    img: string

    // realtion

    @ManyToOne(() => Tour, (tour) => tour.review, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'tour_id'})
    tour: Tour

    @ManyToOne(() => User, (user) => user.reviews, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User
}
