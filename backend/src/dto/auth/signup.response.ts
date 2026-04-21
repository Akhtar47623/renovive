import type { AuthUserDto } from "./auth-user.dto.js";

export type SignUpTokensDto = {
  accessToken: string;
};

export type SignUpOkResponse = {
  ok: true;
  user: AuthUserDto;
  tokens: SignUpTokensDto;
};

export type SignUpErrorResponse = {
  ok: false;
  error: string;
};

