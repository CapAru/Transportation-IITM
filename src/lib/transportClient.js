import { PrismaClient } from ".prisma/client-transport";

const transportDb = new PrismaClient();
export default transportDb;
