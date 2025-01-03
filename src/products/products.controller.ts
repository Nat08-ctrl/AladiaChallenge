import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Logger,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('api')
@Controller('api/products')
@UseInterceptors(CacheInterceptor)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private readonly productsService: ProductsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    // Invalidate cache when new product is created
    await this.cacheManager.del('all_products');
    return product;
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('all_products')
  @CacheTTL(10000)
  @ApiOperation({ summary: 'Get all products' })
  async findAll() {
    this.logger.debug('Fetching all products - Cache miss');
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @ApiOperation({ summary: 'Get a product by ID' })
  async findOne(@Param('id') id: string) {
    const cacheKey = `product_${id}`;
    let product = await this.cacheManager.get(cacheKey);
    
    if (!product) {
      this.logger.debug(`Cache miss for product ${id}`);
      product = await this.productsService.findOne(id);
      await this.cacheManager.set(cacheKey, product);
    }
    
    return product;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    // Invalidate caches
    await this.cacheManager.del('all_products');
    await this.cacheManager.del(`product_${id}`);
    return product;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  async remove(@Param('id') id: string) {
    const product = await this.productsService.remove(id);
    // Invalidate caches
    await this.cacheManager.del('all_products');
    await this.cacheManager.del(`product_${id}`);
    return product;
  }

  @MessagePattern({ cmd: 'get_products' })
  async getProductsViaMicroservice() {
    this.logger.debug('Getting products via microservice');
    return this.productsService.findAll();
  }

  @MessagePattern({ cmd: 'get_product' })
  async getProductViaMicroservice(id: string) {
    this.logger.debug(`Getting product ${id} via microservice`);
    return this.productsService.findOne(id);
  }
}
