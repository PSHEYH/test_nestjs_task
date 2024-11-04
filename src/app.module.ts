import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StaffModule } from './staff/staff.module';
import { StaffSubordinatesModule } from './subordinates/staff_subordinates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: 'postgres',
      retryAttempts: 5,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    StaffModule,
    StaffSubordinatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
