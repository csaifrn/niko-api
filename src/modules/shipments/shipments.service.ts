import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { Repository } from 'typeorm';
import { CreateShipmentDTO } from './dto/create-shipment.dto';
import { UpdateShipmentDTO } from './dto/update-shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
  ) {}

  public async create(
    createShipmentDTO: CreateShipmentDTO,
    user_id: string,
  ): Promise<any> {
    const shipment = this.shipmentRepository.create({
      ...createShipmentDTO,
      user_id: user_id,
    });

    const savedShipment = await this.shipmentRepository.save(shipment);

    return {
      id: savedShipment.id,
      title: savedShipment.title,
      description: savedShipment.description,
      count_boxes: savedShipment.count_boxes,
      received_at: savedShipment.received_at,
    };
  }

  public async update(
    shipment_id: string,
    updateShipmentDTO: UpdateShipmentDTO,
  ) {
    const shipment = await this.shipmentRepository.findOne({
      where: {
        id: shipment_id,
      },
    });

    if (!shipment) {
      throw new NotFoundException('Remessa não encontrada.');
    }

    const filteredDTO = Object.fromEntries(
      Object.entries(updateShipmentDTO).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    );

    Object.assign(shipment, filteredDTO);

    const savedShipment = await this.shipmentRepository.save(shipment);

    return {
      id: savedShipment.id,
      title: savedShipment.title,
      description: savedShipment.description,
      count_boxes: savedShipment.count_boxes,
      observation: savedShipment.observation,
      received_at: savedShipment.received_at,
      created_at: savedShipment.created_at,
      updated_at: savedShipment.updated_at,
    };
  }

  public async find() {
    const shipment = await this.shipmentRepository.find();

    return shipment;
  }

  public async findOne(shipment_id: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: {
        id: shipment_id,
      },
      relations: ['user'],
    });

    if (!shipment) {
      throw new NotFoundException('Remessa não encontrada.');
    }

    return {
      id: shipment.id,
      title: shipment.title,
      description: shipment.description,
      count_boxes: shipment.count_boxes,
      observation: shipment.observation,
      received_at: shipment.received_at,
      created_at: shipment.created_at,
      updated_at: shipment.updated_at,
      created_by: {
        user_id: shipment.user_id,
        name: shipment.user.name,
        role: shipment.user.role,
      },
    };
  }

  public async softDeleteShipment(shipment_id: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: {
        id: shipment_id,
      },
      select: ['id'],
    });

    if (!shipment) {
      throw new NotFoundException('Remessa não encontrada.');
    }

    const deletedShipment = await this.shipmentRepository.softRemove(shipment);

    return {
      id: deletedShipment.id,
      deleted_at: deletedShipment.deleted_at,
    };
  }
}
