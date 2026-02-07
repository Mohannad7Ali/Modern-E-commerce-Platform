import { Request } from 'express';

function test(req: Request) {
  req.user?.id;
}
