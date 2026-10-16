import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { DEFAULT_PLACED_STUDENTS_LIST, DEFAULT_PLACED_STUDENTS_SECTIONS } from "../src/lib/defaultPlacedStudents";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI not found in environment!");
  process.exit(1);
}

async function updatePlacedStudents() {
  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db("tatrapax");

  // 1. Update pages collection for "placed-students"
  const pagesCol = db.collection("pages");
  const pageResult = await pagesCol.updateOne(
    { id: "placed-students" },
    {
      $set: {
        title: "Our Placed Students",
        slug: "/placed-students",
        seo: {
          title: "Our Placed Students & Verified Recruitment Outcomes | TantraPex",
          description: "Explore verified student placement records, campus recruitments, package CTCs, and corporate hiring dossiers from engineering colleges across India.",
          keywords: "placed students, campus placement records, student testimonials, salary packages, engineering placement, TantraPex"
        },
        sections: DEFAULT_PLACED_STUDENTS_SECTIONS,
        updatedAt: new Date().toISOString()
      }
    },
    { upsert: true }
  );
  console.log("Pages collection updated for placed-students:", pageResult);

  // 2. Upsert DEFAULT_PLACED_STUDENTS_LIST into placed_students collection
  const studentsCol = db.collection("placed_students");
  for (const student of DEFAULT_PLACED_STUDENTS_LIST) {
    await studentsCol.updateOne(
      { id: student.id },
      { $set: student },
      { upsert: true }
    );
  }
  console.log(`Placed students collection seeded with ${DEFAULT_PLACED_STUDENTS_LIST.length} high-fidelity dossiers.`);

  await client.close();
  console.log("Done updating MongoDB placed-students page and collection data!");
}

updatePlacedStudents().catch(console.error);
