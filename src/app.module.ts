import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevelopersModule } from './developers/developers.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [DevelopersModule, ProfilesModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
