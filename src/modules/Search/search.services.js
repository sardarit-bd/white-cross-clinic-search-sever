import { TavilyClient } from "tavily";
import { GoogleGenAI } from "@google/genai";
import { Doctor } from "../auth/auth.model.js";
import { News } from "../news/news.model.js";

const tavily = new TavilyClient({
  apiKey: process.env.TAVILY_API_KEY,
});

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

async function searchDoctorsAndArticles(query, isAI) {
  try {
    console.log(query)
    const regex = new RegExp(query, "i");

    // 🔎 MongoDB Search (local)
    const doctors = await Doctor.aggregate([
      {
        $lookup: {
          from: "users",            // collection name in MongoDB
          localField: "user",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      { $unwind: "$doctorInfo" },

      {
        $match: {
          $or: [
            { "doctorInfo.name": regex },
            { designation: regex },
            { intro: regex }
          ]
        }
      },

      {
        $project: {
          _id: 1,
          designation: 1,
          intro: 1,
          "doctorInfo.name": 1,
          "doctorInfo.email": 1,
          "doctorInfo._id" : 1
        }
      },
      { $limit: 5 }
    ]);

    const news = await News.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).limit(5);


    if (isAI === 'false') {
      console.log("in not ai")
      return {
        localSearch: {
          doctors: doctors,
          articles: news
        }
      }
    }

    // 🔎 STEP 1 — Real web search

    const search = await tavily.search(`article and doctors informatio related ${query}`, {
      max_results: 5,
    });
  
    console.log(search)
    // const context = search.results
    //   .map(
    //     r =>
    //       `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
    //   )
    //   .join("\n\n");

//     const prompt = `
// Using ONLY the information below, extract doctors and medical articles.

// ${context}

// Return ONLY JSON:

// {
//   "doctors": [
//     { "name": "", "specialization": "", "department": "", "link": "" }
//   ],
//   "articles": [
//     { "title": "", "link": "", "excerpt": "" }
//   ]
// }
// `;


    // const response = await ai.models.generateContent({
    //   model: "gemini-3-flash-preview",
    //   contents: prompt,
    // });

    // console.log(response)
    // const text = response.text;
    // const jsonMatch = text.match(/\{[\s\S]*\}/);

    // const webSearch = jsonMatch
    //   ? JSON.parse(jsonMatch[0])
    //   : { doctors: [], articles: [] };

    return {
      localSearch: {
        doctors: doctors,
        articles: news
      },
      webSearch: search?.results
    }


  } catch (error) {
    console.log(error)
    const regex = new RegExp(query, "i");
    const doctors = await Doctor.aggregate([
      {
        $lookup: {
          from: "users",            // collection name in MongoDB
          localField: "user",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      { $unwind: "$doctorInfo" },

      {
        $match: {
          $or: [
            { "doctorInfo.name": regex },
            { designation: regex },
            { intro: regex }
          ]
        }
      },

      {
        $project: {
          _id: 1,
          designation: 1,
          intro: 1,
          "doctorInfo.name": 1,
          "doctorInfo.email": 1,
          "doctorInfo._id" : 1
        }
      },
      { $limit: 5 }
    ]);

    const news = await News.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).limit(5);


    return {
      localSearch: {
        doctors: doctors,
        articles: news
      }
    }
  }
}

export const SearchService = {
  searchDoctorsAndArticles,
};