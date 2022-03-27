import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '../../lib/prisma';
import { User } from '../../types/user';

interface SignUpReqBody {
  email: string;
  password: string;
}

async function httpSignUp(
  req: Request<unknown, unknown, SignUpReqBody>,
  res: Response,
): Promise<void> {
  const salt = bcrypt.genSaltSync();
  const { email, password } = req.body;

  let user: User;

  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(401).json(`An error occurred with user sign up.`);
    return;
  }

  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    'hello secret',
    {
      expiresIn: '8h',
    },
  );

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('ACCESS_TOKEN', token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }),
  );

  res.status(200).json(user);
}

export { httpSignUp };
