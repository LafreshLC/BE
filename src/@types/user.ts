import { Request } from "express";

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    address: string;
  };
}

export interface UserType extends Request {
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
    role: string;
  };
}

export interface verifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}
