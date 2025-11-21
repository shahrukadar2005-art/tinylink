import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index
} from 'typeorm';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 8, unique: true })
  @Index()
  code!: string;

  @Column({ type: 'text', name: 'target_url' })
  targetUrl!: string;

  @Column({ type: 'integer', default: 0, name: 'total_clicks' })
  totalClicks!: number;

  @Column({ type: 'timestamp', nullable: true, name: 'last_clicked_at' })
  lastClickedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}