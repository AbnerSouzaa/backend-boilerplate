import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 🔥 Habilita CORS para permitir requisições do frontend
    app.enableCors({
        origin: 'http://localhost:3000', // 🔥 Permite apenas o front
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true, // 🔥 Permite envio de cookies e autenticação
    });
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map