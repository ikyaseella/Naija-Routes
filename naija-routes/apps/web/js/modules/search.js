import { apiClient } from '../core/api.js';

/**
 * Search Module Logic
 * Handles reading URL parameters, fetching results, and rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Only run on the search page
  if (!document.getElementById('resultsContainer')) return;

  const params = new URLSearchParams(window.location.search);
  const origin = params.get('origin');
  const destination = params.get('destination');
  const date = params.get('date');

  if (origin && destination && date) {
    fetchRoutes(origin, destination, date);
  } else {
    // If accessed directly without params, redirect home
    window.location.href = 'index.html';
  }
});

async function fetchRoutes(origin, destination, date) {
  try {
    // Show loading state (placeholder for Phase 1)
    console.log(`Fetching routes: ${origin} to ${destination} on ${date}`);
    
    // In a real environment:
    // const results = await apiClient.get(`/routes/search?origin=${origin}&destination=${destination}&date=${date}`);
    // renderResults(results.data);

    // For the UI mockup, results are hardcoded in the HTML
  } catch (error) {
    alert('Failed to load routes. Please check your connection.');
  }
}

function renderResults(routes) {
  const container = document.getElementById('resultsContainer');
  container.innerHTML = `<h3>${routes.length} departures found</h3>`;

  routes.forEach(route => {
    // Construct the operator card HTML here...
    // (This maps to the HTML structure built in search.html)
  });
}
