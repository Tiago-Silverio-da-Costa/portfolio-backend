import { Request, Response } from 'express';
import db from '../models';
import config from '../config/auth.config';
import { Op } from 'sequelize';
import zod from 'zod';
import { isStrongPassword, isEmail } from 'validator';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const { User, Role, RefreshToken } = db;

export const LoginSchema = zod.object({
  username: zod.string(),
  email: zod.string().refine(isEmail, { message: "Invalid email" }),
  password: zod.string().refine(isStrongPassword, { message: "Password is too weak" }),
  roles: zod.string(),
});
export type Tlogin = zod.infer<typeof LoginSchema>;


export const signup = async (req: Request, res: Response) => {
  const { username, email, password, roles } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create User
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Assign roles if provided
    if (roles && roles.length > 0) {
      const userRoles = await Role.findAll({
        where: {
          name: roles,
        },
      });

      await newUser.set('roles', userRoles);
    } else {
      const defaultRole = await Role.findOne({ where: { name: 'user' } }); 
      if (defaultRole) {
        await newUser.set('roles', [defaultRole]);
      }
    }

    res.status(201).json({ message: "User was registered successfully!" });

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message || "Some error occurred while signing up." });
  }
};





export const signin = async (req: Request, res: Response) => {
  const { username, password }: Tlogin = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      include: Role,
    });

    if (!user) {
      return res.status(404).json({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    const authorities = user.roles?.map(role => `ROLE_${role.name.toUpperCase()}`) || [];

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message || "Some error occurred while signing in." });
  }
};



export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    // Find refresh token in database
    const refreshTokenInstance = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshTokenInstance) {
      return res.status(403).json({ message: "Refresh token is not valid or expired!" });
    }

    // Verify if the refresh token is expired
    if (RefreshToken.isTokenExpired(refreshTokenInstance)) {
      await refreshTokenInstance.destroy();
      return res.status(403).json({ message: "Refresh token is expired. Please make a new signin request." });
    }

    // Find user associated with the refresh token
    const user = await User.findByPk(refreshTokenInstance.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate new access token
    const accessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    // Respond with new access token and existing refresh token
    res.status(200).json({ accessToken, refreshToken: refreshTokenInstance.token });

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message || "Some error occurred while refreshing token." });
  }
};
