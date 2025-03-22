import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { BookEntity } from '../book/book.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'int', width: 1 })
  public rating: number;

  @Column({ type: 'text', nullable: true })
  public comment?: string;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => BookEntity, (book) => book.reviews, { onDelete: 'CASCADE' })
  public book: BookEntity;
  
}
