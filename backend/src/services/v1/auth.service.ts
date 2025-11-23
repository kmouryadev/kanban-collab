import User from "../../models/User.model";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken";
import { MESSAGES } from "../../constants/messages";
import { HTTP } from "../../constants/httpCodes";

interface LoginServiceResponse {
  status: number;
  message?: string;
  error?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existing = await User.findOne({ email });
  if (existing) {
    return {
      status: HTTP.BAD_REQUEST,
      error: MESSAGES.USER.EMAIL_EXISTS,
    };
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });

  return {
    status: HTTP.CREATED,
    message: MESSAGES.USER.REGISTER_SUCCESS,
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginServiceResponse> => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      status: HTTP.BAD_REQUEST,
      error: MESSAGES.USER.INVALID_CREDENTIALS,
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      status: HTTP.BAD_REQUEST,
      error: MESSAGES.USER.INVALID_CREDENTIALS,
    };
  }

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  return {
    status: HTTP.OK,
    message: MESSAGES.USER.LOGIN_SUCCESS,
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  };
};
