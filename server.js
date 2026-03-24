const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// خدمة Firebase
const serviceAccount = require('./firebase-key.json'); // ضع ملف JSON هنا

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// API لجلب الحجوزات
app.get('/api/reservations/:service', async (req, res) => {
    const servicePath = req.params.service;
    
    try {
        const serviceRef = db
            .collection('Al-Jawhara Bank')
            .doc('Al-Jawhara Bank DATABASE')
            .collection('Reservations')
            .doc(servicePath);
        
        const collections = await serviceRef.listCollections();
        const allReservations = [];
        
        for (const userColl of collections) {
            const snapshot = await userColl.get();
            snapshot.forEach(doc => {
                allReservations.push({
                    id: doc.id,
                    username: userColl.id,
                    ...doc.data()
                });
            });
        }
        
        res.json({ success: true, reservations: allReservations });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));