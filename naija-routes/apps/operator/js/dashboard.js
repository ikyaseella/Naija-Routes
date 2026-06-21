/**
 * Operator Portal — Dashboard Logic
 * Handles real-time KPI updates and chart interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // In Phase 2, this will establish a WebSocket connection or poll the API
  // for real-time dashboard data.
  
  console.log('Operator dashboard initialized.');
  
  // Example of how we might update the donut chart dynamically
  // updateOccupancyChart(85);
});

function updateOccupancyChart(percentage) {
  const chart = document.querySelector('.donut-chart');
  const label = document.querySelector('.donut-percentage');
  
  if (chart && label) {
    chart.style.background = `conic-gradient(var(--op-primary) 0% ${percentage}%, var(--op-border) ${percentage}% 100%)`;
    label.textContent = `${percentage}%`;
  }
}
