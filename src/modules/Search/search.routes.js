import express from 'express';
import { SearchControllers } from './search.controllers.js';


const router = express.Router();

// Single image upload
router.get(
  '/ai',
    SearchControllers.getDoctorsAndArticles
)

export const SearchRoutes = router;