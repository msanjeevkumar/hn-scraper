import { Entity, Column, PrimaryColumn } from 'typeorm';

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

  @Column({
    type: 'timestamp',
    name: 'last_updated_on',
    transformer: {
      to: (value: Date) => value, // Custom transformation logic when saving to the database
      from: (value: string) => new Date(value), // Custom transformation logic when retrieving from the database
    },
  })
  lastUpdatedOn: string;
}
