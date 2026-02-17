import prisma from "./config/prisma.js";

async function cleanDatabase() {
  try {
    await prisma.board.deleteMany();

    console.log("All boards deleted successfully.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

cleanDatabase();
