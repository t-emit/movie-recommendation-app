// src/api/omdbApi.js

import axios from 'axios';

// BEFORE (Insecure):
// const API_KEY = 'your_omdb_api_key_here';

// AFTER (Correct and Secure Way):
// Create React App makes this variable available on the `process.env` object.
const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

// ... the rest of the file remains the same
export const searchMovies = (query, page = 1) => axios.get(`${BASE_URL}&s=${query}&type=movie&page=${page}`);
export const fetchMovieDetails = (id) => axios.get(`${BASE_URL}&i=${id}&plot=full`);
export const fetchMoviesByIds = (ids) => {
    return Promise.all(ids.map(id => fetchMovieDetails(id)));
};