import { Request, Response } from "express";

/**
 * Login users
 * @param request Http Request
 * @param response Http Response
 */
const login = async (_request: Request, _response: Response) => {};

/**
 * Register users
 * @param request Http Request
 * @param response Http Response
 */
const register = async (_request: Request, _response: Response) => {};

/**
 * refresh access token
 * @param request Http Request
 * @param response Http Response
 */
const refresh = async (_request: Request, _response: Response) => {};

/**
 * Get user profile
 * @param request Http Request
 * @param response Http Response
 */
const profile = async (_request: Request, _response: Response) => {};

/**
 * Update user profile
 * @param request Http Request
 * @param response Http Response
 */
const updateProfile = async (_request: Request, _response: Response) => {};

/**
 * Change user password
 * @param request Http Request
 * @param response Http Response
 */
const changePassword = async (_request: Request, _response: Response) => {};

/**
 * Send forgot password email to user
 * @param request Http Request
 * @param response Http Response
 */
const forgotPassword = async (_request: Request, _response: Response) => {};

/**
 * Reset user password
 * @param request Http Request
 * @param response Http Response
 */
const resetPassword = async (_request: Request, _response: Response) => {};

/**
 * Send user confirmation email
 * @param request Http Request
 * @param response Http Response
 */
const sendConfirmationEmail = async (
  _request: Request,
  _response: Response
) => {};

/**
 * Confirm user email
 * @param request Http Request
 * @param response Http Response
 */
const confirmEmail = async (_request: Request, _response: Response) => {};

export const authController = {
  login,
  register,
  refresh,
  changePassword,
  updateProfile,
  sendConfirmationEmail,
  forgotPassword,
  confirmEmail,
  resetPassword,
  profile,
};
