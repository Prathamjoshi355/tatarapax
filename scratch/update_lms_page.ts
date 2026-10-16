import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { DEFAULT_LMS_SECTIONS } from "../src/lib/defaultLms";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI not found in environment!");
  process.exit(1);
}

async function updateLms() {
  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db("tatrapax");

  // Update pages collection for "lms"
  const pagesCol = db.collection("pages");
  const result = await pagesCol.updateOne(
    { id: "lms" },
    {
      $set: {
        title: "LMS & Learning Resources",
        slug: "/lms",
        seo: {
          title: "LMS & Placement Readiness Resources | TantraPex × UG Skill",
          description: "Curated academic syllabus, real-time code execution sandbox, quantitative aptitude question bank, and comprehensive placement interview frameworks.",
          keywords: "LMS, UG Skill, placement preparation, code sandbox, aptitude mock test, technical interview prep, TantraPex"
        },
        sections: DEFAULT_LMS_SECTIONS,
        updatedAt: new Date().toISOString()
      }
    },
    { upsert: true }
  );

  console.log("Pages collection updated for lms:", result);
  await client.close();
  console.log("Done updating MongoDB lms page data!");
}

updateLms().catch(console.error);
