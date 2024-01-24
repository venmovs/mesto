import { NextFunction, Request, Response } from 'express';

const temporaryUser = (req: Request, res: Response, next: NextFunction) => {
  // TODO: remove hardcode solution
  // @ts-ignore
  req.user = {
    _id: '65adab6bedc63f08b72c4d28',
  };

  next();
};

export default temporaryUser;
