import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { DEFAULT_SERVICES_SECTIONS } from "../src/lib/defaultServices";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI not found in environment!");
  process.exit(1);
}

async function updateServices() {
  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db("tatrapax");

  // Update pages collection for "services"
  const pagesCol = db.collection("pages");
  const result = await pagesCol.updateOne(
    { id: "services" },
    {
      $set: {
        title: "Our Services",
        slug: "/services",
        seo: {
          title: "Career Preparation & Placement Support Services | TantraPex Technologies",
          description: "We offer complete training and placement support to help you build confidence, master technical skills, and clear company interviews across 12 preparation pillars.",
          keywords: "placement services, career training, resume building, mock interviews, aptitude tests, technical training, corporate drives, TantraPex"
        },
        sections: DEFAULT_SERVICES_SECTIONS,
        updatedAt: new Date().toISOString()
      }
    },
    { upsert: true }
  );

  console.log("Pages collection updated for services:", result);
  await client.close();
  console.log("Done updating MongoDB services page data!");
}

updateServices().catch(console.error);
