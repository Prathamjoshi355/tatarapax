import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { DEFAULT_COLLEGES_SECTIONS } from "../src/lib/defaultColleges";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI not found in environment!");
  process.exit(1);
}

async function updateColleges() {
  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db("tatrapax");

  // Update pages collection for "college-partnership"
  const pagesCol = db.collection("pages");
  const result = await pagesCol.updateOne(
    { id: "college-partnership" },
    {
      $set: {
        title: "College Partnerships & Institutional Relations",
        slug: "/college-partnership",
        seo: {
          title: "College Partnerships & Campus Recruitment Infrastructure | TantraPex",
          description: "Partner with TantraPex to empower engineering students with CRT, proctored diagnostics, and exclusive pooled corporate campus placement drives with zero platform fees.",
          keywords: "college partnership, campus recruitment training, TPO portal, engineering placement drives, pooled campus drives, TantraPex"
        },
        sections: DEFAULT_COLLEGES_SECTIONS,
        updatedAt: new Date().toISOString()
      }
    },
    { upsert: true }
  );

  console.log("Pages collection updated for college-partnership:", result);
  await client.close();
  console.log("Done updating MongoDB college-partnership page data!");
}

updateColleges().catch(console.error);
