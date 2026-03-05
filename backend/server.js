import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import https from "https";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const httpsAgent = new https.Agent({
  keepAlive: true,
  family: 4,
});

app.post("/mood-match", async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ error: "Please enter your mood" });
    }

    let movieTitle;

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
      });

      const result = await model.generateContent(
        `Based on this mood: "${mood}", suggest ONLY one movie title. No explanation.`
      );

      movieTitle = result.response.text().trim();
      movieTitle = movieTitle.replace(/["']/g, "");

    } catch (aiError) {
      console.log("AI Error Full:", error);
    return null;
    }

    let movie;

    try {
      const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${movieTitle}`);

      movie = tmdbResponse.data.results[0];

    } catch (tmdbError) {
      console.log("TMDB Connection Failed:", tmdbError.code);
      return res.status(500).json({
        error: "Unable to connect to movie database. Try again."
      });
    }

    if (!movie) {
      return res.status(404).json({ error: "Movie not found in TMDB" });
    }

    res.json({
      aiSuggestedTitle: movieTitle,
      movie,
    });

  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});