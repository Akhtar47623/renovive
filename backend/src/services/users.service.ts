import { prisma } from "../db/index.js";

export const usersService = {
  async list() {
    return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  },
};

