require(`dotenv`).config();

const express = require(`express`);
const mongoose = require(`mongoose`);
const cors = require(`cors`);
const authRoutes = require(`./routes/auth`);


const app = express();

app.use(cors());
app.use(express.json());
app.use(`/api/auth`, authRoutes);


mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log(`MongoDB Connected`))
   .catch((err) => console.error(`MongoDB connection error:`, err));

app.get(`/api/health`, (req, res) => { 
    res.json({status: `ok`});
});

const PORT =process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on portuhhh ${PORT}`);
});
