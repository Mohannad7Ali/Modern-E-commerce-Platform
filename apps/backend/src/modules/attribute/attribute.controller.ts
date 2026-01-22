import { AttributeService } from './attribute.service';
import sendResponse from '@/shared/utils/sendResponse';
import asyncHandler from '@/shared/utils/asyncHandler';
import { Request, Response } from 'express';
import { CheckParamsType } from '@/shared/utils/checkType';
import { makeLogsService } from '../logs/logs.factory';
export default class AttributeController {
  private logsService = makeLogsService();
  constructor(private readonly attrService: AttributeService) {}
  createAttribute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    const attribute = await this.attrService.createAttribute(name);
    sendResponse(res, 201, { data: { attribute }, message: 'Attribute created successfully' });
    this.logsService.info('Attribute created', {
      userId: req.user?.id,
      sessionId: req.session.id
    });
  });
  createAttributeValue = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { attributeId, value } = req.body;
    const attributeValue = await this.attrService.CreateAttributeValue({
      attributeId,
      value
    });
    sendResponse(res, 201, {
      data: { attributeValue },
      message: 'Attribute value created successfully'
    });
    this.logsService.info('Attribute value created', {
      userId: req.user?.id,
      sessionId: req.session.id
    });
  });
  assignAttributeToCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { categoryId, attributeId, isRequired } = req.body;
    const result = await this.attrService.assignAttributeToCategory({
      categoryId,
      attributeId,
      isRequired
    });
    sendResponse(res, 201, {
      data: { result },
      message: 'Attribute assigned to category successfully'
    });
    this.logsService.info('Attribute assigned to category', {
      userId: req.user?.id,
      sessionId: req.session.id
    });
  });
  getAllAttributes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const attributes = await this.attrService.findManyAttributes(req.query);
    sendResponse(res, 200, {
      data: { attributes },
      message: 'Attributes fetched successfully'
    });
  });

  getAttribute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = CheckParamsType(req.params.id);
    const attribute = await this.attrService.getAttribute(id);
    sendResponse(res, 200, {
      data: { attribute },
      message: 'Attribute fetched successfully'
    });
  });

  deleteAttribute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = CheckParamsType(req.params.id);
    console.log('icoming id => ', id);
    await this.attrService.deleteAttribute(id);
    sendResponse(res, 200, { message: 'Attribute deleted successfully' });
    this.logsService.info('Attribute deleted', {
      userId: req.user?.id,
      sessionId: req.session.id
    });
  });

  deleteAttributeValue = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = CheckParamsType(req.params.id);
    console.log('Incoming attribute value id => ', id);
    await this.attrService.deleteAttributeValue(id);
    sendResponse(res, 200, {
      message: 'Attribute value deleted successfully'
    });
    this.logsService.info('Attribute value deleted', {
      userId: req.user?.id,
      sessionId: req.session.id
    });
  });
}
