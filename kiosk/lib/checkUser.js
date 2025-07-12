import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No user found from Clerk");
    return null;
  }

  console.log("Clerk user fetched:", user); // <-- THIS should log Clerk user info

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      console.log("User exists in DB:", loggedInUser);
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        transactions: {
          create: {
            type: "CREDIT_PURCHASE",
            packageId: "free_user",
            amount: 0,
          },
        },
      },
    });

    console.log("New user created in DB:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error.message);
  }

  console.log("DB URL =", process.env.DATABASE_URL);
};
