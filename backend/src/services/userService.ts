import User from "../models/User.js";

/**
 * Check if the requested user exists in the database
 */
export const doesUserExists = async (email: string): Promise<boolean> => {
  if (!email) {
    return false;
  }
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return true;
  }
  return false;
};

export const doesUserExistsFromId = async (id: string): Promise<boolean> => {
  if (!id) {
    return false;
  }
  const existingUser = await User.findOne({ _id: id });
  if (existingUser) {
    return true;
  }
  return false;
};
