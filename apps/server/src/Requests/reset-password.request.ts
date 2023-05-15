const authorize = () => {};

const validate = () => {};

export interface ResetPasswordRequest extends Request {}

const resetPasswordRequest = {
  validate,
  authorize,
};

export default resetPasswordRequest;
