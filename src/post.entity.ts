import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  comments: number;
}
