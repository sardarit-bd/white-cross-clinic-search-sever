import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Medical synonyms and related terms
const MEDICAL_SYNONYMS = {
  'heart': ['cardiac', 'cardiovascular', 'cardio', 'heart disease', 'heart attack'],
  'brain': ['neurological', 'neuro', 'cerebral', 'mental', 'cognitive'],
  'child': ['pediatric', 'kids', 'children', 'baby', 'infant'],
  'skin': ['dermatology', 'dermal', 'cutaneous', 'rash', 'acne'],
  'bone': ['orthopedic', 'skeletal', 'fracture', 'joint'],
  'cancer': ['oncology', 'tumor', 'malignant', 'chemotherapy'],
  'diabetes': ['blood sugar', 'insulin', 'diabetic'],
  'pain': ['ache', 'discomfort', 'sore', 'hurt'],
  'surgery': ['operation', 'procedure', 'surgical'],
  'medicine': ['drug', 'medication', 'prescription', 'treatment']
};

function loadJSON(filename) {
  try {
    const filepath = path.join(__dirname, "data", filename);
    const data = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error);
    return [];
  }
}

// Fuzzy matching with Levenshtein distance
function fuzzyMatch(text, query, maxDistance = 2) {
  if (text.includes(query)) return true;
  
  const words = text.split(/\s+/);
  for (const word of words) {
    if (calculateDistance(word, query) <= maxDistance) {
      return true;
    }
  }
  return false;
}

// Simple Levenshtein distance calculation
function calculateDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Expand query with synonyms
function expandQuery(query) {
  const terms = query.toLowerCase().split(/\s+/);
  const expanded = new Set(terms);
  
  terms.forEach(term => {
    if (MEDICAL_SYNONYMS[term]) {
      MEDICAL_SYNONYMS[term].forEach(synonym => expanded.add(synonym));
    }
  });
  
  return Array.from(expanded);
}

// Calculate relevance score
function calculateScore(text, query, queryTerms) {
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Exact match bonus
  if (lowerText.includes(query.toLowerCase())) {
    score += 0.5;
  }
  
  // Individual term matches
  queryTerms.forEach(term => {
    if (lowerText.includes(term)) {
      score += 0.3;
    }
    
    // Fuzzy match bonus (smaller)
    const words = lowerText.split(/\s+/);
    for (const word of words) {
      if (calculateDistance(word, term) <= 2) {
        score += 0.1;
        break;
      }
    }
  });
  
  // Position bonus - matches in title are better
  return Math.min(score, 1.0);
}

export function searchAI(query) {
  if (!query || query.trim() === "") {
    return [];
  }

  const originalQuery = query.trim();
  query = originalQuery.toLowerCase();
  console.log(`🔍 Enhanced searching for: "${originalQuery}"`);

  const doctors = loadJSON("doctors.json");
  const articles = loadJSON("articles.json");
  const queryTerms = expandQuery(query);

  console.log(`📝 Expanded search terms:`, queryTerms);

  const results = [];

  // ---- ENHANCED DOCTOR SEARCH ----
  doctors.forEach((doc) => {
    const searchText = `${doc.name} ${doc.department} ${doc.specialization}`.toLowerCase();
    let score = 0;
    
    // Check each query term
    queryTerms.forEach(term => {
      if (fuzzyMatch(searchText, term)) {
        score += calculateScore(searchText, term, queryTerms);
      }
    });
    
    // Bonus for exact department/specialization matches
    if (fuzzyMatch(doc.department.toLowerCase(), query) || 
        fuzzyMatch(doc.specialization.toLowerCase(), query)) {
      score += 0.4;
    }
    
    if (score > 0.1) { // Threshold to include results
      results.push({
        title: doc.name,
        type: "doctor",
        department: doc.department,
        specialization: doc.specialization,
        score: Math.min(score + Math.random() * 0.1, 1.0), // Add small random variation
        matchType: score > 0.5 ? "strong" : "partial"
      });
    }
  });

  // ---- ENHANCED ARTICLE SEARCH ----
  articles.forEach((art) => {
    const searchText = `${art.title} ${art.content} ${art.tags || ''}`.toLowerCase();
    let score = 0;
    
    queryTerms.forEach(term => {
      if (fuzzyMatch(searchText, term)) {
        const termScore = calculateScore(searchText, term, queryTerms);
        
        // Title matches are more valuable
        if (art.title.toLowerCase().includes(term)) {
          score += termScore + 0.2;
        } else {
          score += termScore;
        }
      }
    });
    
    if (score > 0.1) {
      results.push({
        title: art.title,
        type: "article",
        excerpt: art.content.slice(0, 120) + "...",
        content: art.content,
        tags: art.tags || [],
        score: Math.min(score + Math.random() * 0.1, 1.0),
        matchType: score > 0.5 ? "strong" : "partial"
      });
    }
  });

  // Sort by relevance score
  results.sort((a, b) => b.score - a.score);
  
  console.log(`✅ Found ${results.length} results for "${originalQuery}"`);
  
  // Log search insights
  if (results.length > 0) {
    console.log(`📊 Top result score: ${results[0].score.toFixed(2)}`);
    console.log(`🎯 Strong matches: ${results.filter(r => r.matchType === 'strong').length}`);
  }
  
  return results;
}

// Additional utility function for spell-check suggestions
export function getSearchSuggestions(query) {
  const allDoctors = loadJSON("doctors.json");
  const allArticles = loadJSON("articles.json");
  
  const allTerms = new Set();
  
  // Collect all unique terms from data
  allDoctors.forEach(doc => {
    `${doc.department} ${doc.specialization}`.toLowerCase().split(/\s+/).forEach(term => {
      if (term.length > 3) allTerms.add(term);
    });
  });
  
  allArticles.forEach(art => {
    `${art.title} ${art.tags || ''}`.toLowerCase().split(/\s+/).forEach(term => {
      if (term.length > 3) allTerms.add(term);
    });
  });
  
  // Find similar terms
  const suggestions = [];
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  queryTerms.forEach(term => {
    if (term.length < 3) return;
    
    allTerms.forEach(dataTerm => {
      const distance = calculateDistance(term, dataTerm);
      if (distance <= 2 && distance > 0) {
        suggestions.push(dataTerm);
      }
    });
  });
  
  return Array.from(new Set(suggestions)).slice(0, 5);
}