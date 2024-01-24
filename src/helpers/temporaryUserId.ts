import { Request } from 'express';

// TODO: remove hardcode solution
// @ts-ignore
const temporaryUserId = (req: Request) => req.user._id;

export default temporaryUserId;
