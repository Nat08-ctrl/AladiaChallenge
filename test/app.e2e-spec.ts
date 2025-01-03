import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateProductDto } from '../src/products/dto/create-product.dto';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST)', () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
    };

    return request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', createProductDto.name);
        expect(res.body).toHaveProperty(
          'description',
          createProductDto.description,
        );
        expect(res.body).toHaveProperty('price', createProductDto.price);
      });
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
