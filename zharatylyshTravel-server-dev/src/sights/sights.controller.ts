import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SightsService } from './sights.service';
import { CreateSightDto } from './dto/create-sight.dto';
import { UpdateSightDto } from './dto/update-sight.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sight')
@Controller('sights')
export class SightsController {
  constructor(private readonly sightsService: SightsService) {}

  @Post()
  create(@Body() createSightDto: CreateSightDto) {
    return this.sightsService.create(createSightDto);
  }

  @Get()
  findAll() {
    return this.sightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sightsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSightDto: UpdateSightDto) {
    return this.sightsService.update(+id, updateSightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sightsService.remove(+id);
  }
}
