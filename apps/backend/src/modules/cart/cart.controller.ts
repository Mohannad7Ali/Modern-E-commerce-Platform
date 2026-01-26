import { Request, Response } from 'express';
import asyncHandler from '@/shared/utils/asyncHandler';
import sendResponse from '@/shared/utils/sendResponse';
import { CartService } from './cart.service';
import { makeLogsService } from '../logs/logs.factory';
import { CheckParamsType } from '@/shared/utils/checkType';

export class CartController {
  private logsService = makeLogsService();
  constructor(private cartService: CartService) {}

  getCart = asyncHandler(async (req: Request, res: Response) => {
    console.log('🔍 [CART CONTROLLER] getCart called');
    console.log('🔍 [CART CONTROLLER] Request user:', req.user);
    console.log('🔍 [CART CONTROLLER] Request session:', req.session);
    console.log('🔍 [CART CONTROLLER] Session ID:', req.session?.id);

    const userId = req.user?.id;
    const sessionId = req.session.id;

    console.log('🔍 [CART CONTROLLER] Extracted userId:', userId);
    console.log('🔍 [CART CONTROLLER] Extracted sessionId:', sessionId);

    const cart = await this.cartService.getOrCreateCart(userId, sessionId);

    console.log('🔍 [CART CONTROLLER] Cart returned from service:', cart);
    console.log('🔍 [CART CONTROLLER] Cart ID:', cart?.id);
    console.log('🔍 [CART CONTROLLER] Cart items count:', cart?.cartItems?.length);
    console.log('🔍 [CART CONTROLLER] Cart items:', cart?.cartItems);

    sendResponse(res, 200, {
      data: { cart },
      message: 'Cart fetched successfully'
    });

    this.logsService.info('Cart fetched', {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now()
    });
  });

  getCartCount = asyncHandler(async (req: Request, res: Response) => {
    console.log('🔍 [CART CONTROLLER] getCartCount called');
    console.log('🔍 [CART CONTROLLER] Request user:', req.user);
    console.log('🔍 [CART CONTROLLER] Request session:', req.session);

    const userId = req.user?.id;
    const sessionId = req.session.id;

    console.log('🔍 [CART CONTROLLER] Extracted userId:', userId);
    console.log('🔍 [CART CONTROLLER] Extracted sessionId:', sessionId);

    const cartCount = await this.cartService.getCartCount(userId, sessionId);

    console.log('🔍 [CART CONTROLLER] Cart count returned:', cartCount);

    sendResponse(res, 200, {
      data: { cartCount },
      message: 'Cart count fetched successfully'
    });
  });

  addToCart = asyncHandler(async (req: Request, res: Response) => {
    console.log('🔍 [CART CONTROLLER] addToCart called');
    console.log('🔍 [CART CONTROLLER] Request body:', req.body);
    console.log('🔍 [CART CONTROLLER] Request user:', req.user);
    console.log('🔍 [CART CONTROLLER] Request session:', req.session);

    const userId = req.user?.id;
    const sessionId = req.session.id;
    const { variantId, quantity } = req.body;

    console.log('🔍 [CART CONTROLLER] Extracted userId:', userId);
    console.log('🔍 [CART CONTROLLER] Extracted sessionId:', sessionId);
    console.log('🔍 [CART CONTROLLER] Extracted variantId:', variantId);
    console.log('🔍 [CART CONTROLLER] Extracted quantity:', quantity);

    const item = await this.cartService.addToCart(variantId, quantity, userId, sessionId);

    console.log('🔍 [CART CONTROLLER] Item returned from service:', item);
    console.log('🔍 [CART CONTROLLER] Item ID:', item?.id);
    console.log('🔍 [CART CONTROLLER] Item cartId:', item?.cartId);

    sendResponse(res, 200, {
      data: { item },
      message: 'Item added to cart successfully'
    });

    this.logsService.info('Item added to cart', {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now()
    });
  });

  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    console.log('🔍 [CART CONTROLLER] updateCartItem called');
    console.log('🔍 [CART CONTROLLER] Request params:', req.params);
    console.log('🔍 [CART CONTROLLER] Request body:', req.body);

    const itemId = CheckParamsType(req.params.itemId);
    const { quantity } = req.body;

    console.log('🔍 [CART CONTROLLER] Extracted itemId:', itemId);
    console.log('🔍 [CART CONTROLLER] Extracted quantity:', quantity);

    const updatedItem = await this.cartService.updateCartItemQuantity(itemId, quantity);

    console.log('🔍 [CART CONTROLLER] Updated item returned:', updatedItem);

    sendResponse(res, 200, {
      data: { item: updatedItem },
      message: 'Item quantity updated successfully'
    });

    this.logsService.info('Item quantity updated', {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now()
    });
  });

  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    console.log('🔍 [CART CONTROLLER] removeFromCart called');
    console.log('🔍 [CART CONTROLLER] Request params:', req.params);

    const itemId = CheckParamsType(req.params.itemId);
    console.log('🔍 [CART CONTROLLER] Extracted itemId:', itemId);

    const result = await this.cartService.removeFromCart(itemId);

    console.log('🔍 [CART CONTROLLER] Remove result:', result);

    sendResponse(res, 200, {
      message: 'Item removed from cart successfully'
    });

    this.logsService.info('Item removed from cart', {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now()
    });
  });

  mergeCarts = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.session.id;
    const userId = req.user?.id;
    await this.cartService.mergeCartsOnLogin(sessionId, userId);

    sendResponse(res, 200, { message: 'Carts merged successfully' });

    this.logsService.info('Carts merged', {
      userId: req.user?.id,
      sessionId: req.session.id,
      timePeriod: Date.now() - Date.now()
    });
  });
}
