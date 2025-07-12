import { getAuth } from "@clerk/nextjs/server"; // This works with pages/api
import { db } from "@/lib/prisma";

export default async function handler(req, res) {
  const { userId } = getAuth(req); // ✅ Use getAuth here

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const documents = await db.Document.findMany({
        where: { userId },
        orderBy: { uploadedAt: "desc" },
      });
     return res.status(200).json({ documents });
    } catch (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({ error: "Failed to fetch documents" });
    }
  } else {
    return res.status(405).end("Method not allowed");
  }
}
