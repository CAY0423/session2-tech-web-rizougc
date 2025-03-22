import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { AuthorEntity } from '../author/author.entity';
import { ReviewEntity } from '../review/review.entity';
import { OneToMany } from 'typeorm';

@Entity('books')
export class BookEntity {
  @PrimaryColumn({ type: 'text' })
  public id: string;

  @Column({ type: 'text' })
  public title: string;

  @Column({ type: 'int' })
  public publicationYear: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  public price?: number;

  @ManyToOne(() => AuthorEntity, (author) => author.books, { eager: true })
  public author: AuthorEntity;

  @OneToMany(() => ReviewEntity, (review) => review.book, { cascade: true, onDelete: 'CASCADE' })
  public reviews: ReviewEntity[];

  @BeforeInsert()
  public setId(): void {
    this.id = `${this.title.toLowerCase().replace(/\s+/g, '-')}-by-${this.author.id.toLowerCase().replace(/\s+/g, '-')}`;
  }
}
