import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { BookEntity } from '../book/book.entity';

@Entity('authors')
export class AuthorEntity {
  @PrimaryColumn({ type: 'text' })
  public id: string;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public bio?: string;

  @Column({ type: 'text', nullable: true })
  public photo?: string;

  @OneToMany(() => BookEntity, (book) => book.author)
  public books: BookEntity[];

  @BeforeInsert()
  public setId(): void {
    this.id = `${this.name.toLowerCase().replace(/\s+/g, '-')}`;
  }
}
