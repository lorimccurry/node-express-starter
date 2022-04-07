import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '../../utils/prisma';
import { User } from '../../types/user';
import { jwtSecret } from '../../envs';
import { AUTH } from '../../constants/messages';

export interface SignUpReqBody {
  email: string;
  password: string;
  name?: string;
}

interface SignInReqBody {
  email: string;
  password: string;
}

async function httpSignUp(
  req: Request<unknown, unknown, SignUpReqBody>,
  res: Response,
): Promise<void> {
  const salt = bcrypt.genSaltSync();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ error: AUTH.ERROR.SIGN_UP_REQUIREMENTS });
    return;
  }

  let user: User;

  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
      },
      // TODO: return user w/o password
    });
  } catch (e) {
    res.status(401).json({ error: AUTH.ERROR.SIGN_UP });
    return;
  }

  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    jwtSecret,
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

  delete user.password;
  res.status(201).json(user);
}

async function httpSignIn(
  req: Request<unknown, unknown, SignInReqBody>,
  res: Response,
) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        time: Date.now(),
      },
      jwtSecret,
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

    delete user.password;
    res.status(200).json(user);
  } else {
    res.status(401).json({ error: AUTH.ERROR.SIGN_IN });
  }
}

export { httpSignUp, httpSignIn };
