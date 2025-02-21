import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { isUserAuthenticated } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

class AuthController {
  public register = async (req: Request, res: Response): Promise<void> => {
    if (isUserAuthenticated(req)) {
      res.status(400).json({
        message:
          "You are already authenticated, logout first to register a new user.",
      });
      return;
    }
    try {
      const { username, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isAdmin: false,
      });

      await newUser.save();
      //Return a user without the password and the _id, as it's saved in the token.
      const returnedUser = {
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        color: newUser.color,
      };
      this.setTokenInCookies(newUser._id as ObjectId, res);

      res.status(201).json({
        message: "User registered successfully",
        user: returnedUser,
      });
    } catch (error) {
      console.error("Can't register user", error);
      res.status(500).json({ message: "Une erreur est survenue lors de la création de ton compte", error });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      if (isUserAuthenticated(req)) {
        res.status(200).json({
          message:
            "You are already authenticated, logout first to login to another account",
        });
        return;
      }

      const { email, password } = req.body;

      const matchingUser = await User.findOne({ email }).select("+password");
      if (!matchingUser) {
        res.status(401).json({ message: "Le mot de passe ou l'email n'est pas correct" });
        return;
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        matchingUser.password
      );
      if (!isPasswordValid) {
        res.status(401).json({ message: "Le mot de passe ou l'email n'est pas correct" });
        return;
      }
      const returnedUser = {
        username: matchingUser.username,
        email: matchingUser.email,
        isAdmin: matchingUser.isAdmin,
        color: matchingUser.color,
      };

      this.setTokenInCookies(matchingUser._id as ObjectId, res);

      res
        .status(200)
        .json({ message: "User logged in successfully", user: returnedUser });
    } catch (error) {
      res
        .status(401)
        .json({ message: "Unexepected error when logging in : ", error });
      return;
    }
  };

  public logout = (req: Request, res: Response) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0)
    });
    res.status(200).json({ message: "Déconnexion réussie !" });
  }

  private setTokenInCookies(_id: ObjectId, res: Response) {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET!, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
  }
}

export default new AuthController();
