require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../src/models/models.products');

(async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/';
        await mongoose.connect(uri);
        console.log('Connected to Mongo for seeding');

        const file = path.join(__dirname, '..', 'src', 'products.txt');
        const txt = fs.readFileSync(file, 'utf8');
        const lines = txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

        for (const line of lines) {
            const parts = line.split(',').map(p => p.trim());
            if (parts.length < 2) continue;
            const name = parts[0];
            const price = Number(parts[1]) || 0;

            // upsert by name
            const existing = await Product.findOne({ name });
            if (existing) {
                existing.price = price;
                await existing.save();
                console.log('Updated product', existing._id.toString(), name);
            } else {
                const p = await Product.create({ name, price });
                console.log('Inserted product', p._id.toString(), name);
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
})();
