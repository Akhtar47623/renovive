import type { AuthUserDto } from "./auth-user.dto.js";

export type LoginTokensDto = {
  accessToken: string;
};

export type LoginOkResponse = {
  ok: true;
  user: AuthUserDto;
  tokens: LoginTokensDto;
};

export type LoginErrorResponse = {
  ok: false;
  error: string;
};

