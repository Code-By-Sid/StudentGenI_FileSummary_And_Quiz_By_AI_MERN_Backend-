import express from 'express';
import connectDB from '../config/db.js';
import authRoutes from '../routes/auth.routes.js';
import fileRoutes from '../routes/file.routes.js';
import aiRoutes from '../routes/ai.routes.js';

const app = express();

app.use(express.json());

connectDB();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('StudyGeni AI enabled e-learning API is running...');
});

app.use("/auth", authRoutes);
app.use("/file",fileRoutes,aiRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

