import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db('tatrapax');
  const pages = await db.collection('pages').find({}, { projection: { id: 1, title: 1, slug: 1 } }).toArray();
  console.log('Pages in DB:', pages.map(p => ({ id: p.id, title: p.title, slug: p.slug })));
  
  const pricingPage = await db.collection('pages').findOne({ id: 'pricing' });
  console.log('Is pricing page in pages collection?', !!pricingPage);
  if (pricingPage) {
    const plansSec = pricingPage.sections?.find((s: any) => s.type === 'pricing-plans');
    console.log('pricing plansSec content:', JSON.stringify(plansSec?.content, null, 2));
  }
  await client.close();
}

run().catch(console.error);
