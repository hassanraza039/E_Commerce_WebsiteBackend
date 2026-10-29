import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";

// Shop ke purane products (productData.js) ko database mein daalne ki script.
// Script dobara chalane par duplicate nahi banenge (naam ke hisaab se check hota hai).
const products = [
  {
    "name": "T-SHIRT WITH TAPE DETAILS",
    "category": "T-shirts",
    "price": 120,
    "rating": 4.5,
    "image": "/images/p_1.png",
    "stock": 20
  },
  {
    "name": "SKINNY FIT JEANS",
    "category": "Jeans",
    "price": 240,
    "rating": 3.5,
    "image": "/images/p_2.png",
    "stock": 20,
    "cut_price": 260,
    "discount": "-20%"
  },
  {
    "name": "CHECKERED SHIRT",
    "category": "Shirts",
    "price": 180,
    "rating": 4.5,
    "image": "/images/p_3.png",
    "stock": 20
  },
  {
    "name": "SLEEVE STRIPED T-SHIRT",
    "category": "T-shirts",
    "price": 130,
    "rating": 4.5,
    "image": "/images/p_4.png",
    "stock": 20,
    "cut_price": 160,
    "discount": "-30%"
  },
  {
    "name": "VERTICAL STRIPED SHIRT",
    "category": "Shirts",
    "price": 212,
    "rating": 4.0,
    "image": "/images/p_1.png",
    "stock": 20,
    "cut_price": 232,
    "discount": "-20%"
  },
  {
    "name": "COURAGE GRAPHIC T-SHIRT",
    "category": "T-shirts",
    "price": 145,
    "rating": 4.5,
    "image": "/images/p_2.png",
    "stock": 20
  },
  {
    "name": "LOOSE FIT BERMUDA SHORTS",
    "category": "Shorts",
    "price": 80,
    "rating": 3.5,
    "image": "/images/p_3.png",
    "stock": 20,
    "cut_price": 100,
    "discount": "-20%"
  },
  {
    "name": "FADED SKINNY JEANS",
    "category": "Jeans",
    "price": 210,
    "rating": 4.5,
    "image": "/images/p_4.png",
    "stock": 20
  },
  {
    "name": "GRADIENT GRAPHIC T-SHIRT",
    "category": "T-shirts",
    "price": 145,
    "rating": 4.5,
    "image": "/images/p_1.png",
    "stock": 20
  },
  {
    "name": "POLO WITH TIPPING DETAILS",
    "category": "T-shirts",
    "price": 180,
    "rating": 4.5,
    "image": "/images/p_2.png",
    "stock": 20
  },
  {
    "name": "BLACK STRIPED T-SHIRT",
    "category": "T-shirts",
    "price": 120,
    "rating": 4.5,
    "image": "/images/p_3.png",
    "stock": 20,
    "cut_price": 150,
    "discount": "-30%"
  },
  {
    "name": "SLIM FIT SHIRT",
    "category": "Shirts",
    "price": 190,
    "rating": 4.5,
    "image": "/images/p_4.png",
    "stock": 20
  },
  {
    "name": "CASUAL POLO SHIRT",
    "category": "T-shirts",
    "price": 160,
    "rating": 4.0,
    "image": "/images/p_1.png",
    "stock": 20
  },
  {
    "name": "RELAXED JEANS",
    "category": "Jeans",
    "price": 220,
    "rating": 4.5,
    "image": "/images/p_2.png",
    "stock": 20,
    "cut_price": 250,
    "discount": "-15%"
  },
  {
    "name": "CASUAL CHECK SHIRT",
    "category": "Shirts",
    "price": 175,
    "rating": 4.5,
    "image": "/images/p_3.png",
    "stock": 20
  },
  {
    "name": "STRIPED SUMMER TEE",
    "category": "T-shirts",
    "price": 110,
    "rating": 4.0,
    "image": "/images/p_4.png",
    "stock": 20
  },
  {
    "name": "BASIC CASUAL T-SHIRT",
    "category": "T-shirts",
    "price": 100,
    "rating": 4.5,
    "image": "/images/p_1.png",
    "stock": 20
  },
  {
    "name": "WASHED BLUE JEANS",
    "category": "Jeans",
    "price": 230,
    "rating": 4.5,
    "image": "/images/p_2.png",
    "stock": 20,
    "cut_price": 260,
    "discount": "-12%"
  }
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB connected");

    let added = 0;
    for (const p of products) {
      const result = await Product.updateOne(
        { name: p.name },
        { $setOnInsert: p },
        { upsert: true }
      );
      if (result.upsertedCount > 0) added += 1;
    }

    console.log(`Done: ${added} naye products add hue, ${products.length - added} pehle se maujood the.`);
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();