import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'your-username',
      password: 'your-password',
      database: 'your-database',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
