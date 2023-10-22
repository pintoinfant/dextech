import { db } from "@/utilities/mongo";

export default async function getTraders(req: any, res: any) {
  if (req.method === "GET") {
    const data = await db
      .collection("traders")
      .find(
        {},
        {
          sort: {
            "attributes.changes.percent_1d": "descending",
          },
        }
      )
      .toArray();
    res.status(200).json({ topics: data });
  } else {
    // Handle any other HTTP method
  }
}
