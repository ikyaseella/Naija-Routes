/**
 * Agent App — Walk-Up Sale Logic
 * Handles offline queueing via IndexedDB (Mocked for Phase 1).
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('sellForm');
  const destSelect = document.getElementById('destination');
  const priceDisplay = document.getElementById('priceDisplay');
  
  if (!form) return;

  // Mock Pricing Logic — keys match the option values in sell.html
  const pricing = {
    'Abuja': 15000,
    'Enugu': 12000,
    'PHC': 18000
  };

  destSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (pricing[val]) {
      priceDisplay.textContent = `₦${pricing[val].toLocaleString()}`;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const name = document.getElementById('name').value;
    const dest = destSelect.value;
    
    // 1. In a real app, this is where we save to IndexedDB if offline
    console.log(`Saved offline sale: ${name} to ${dest} for ${pricing[dest]}`);
    
    // 2. Visual confirmation
    const btn = document.getElementById('confirmBtn');
    const originalText = btn.innerHTML;
    
    btn.style.background = 'var(--bg-card)';
    btn.style.color = 'var(--accent-green)';
    btn.innerHTML = '✅ ' + (window.I18N ? I18N.t('agent.ticket_printed') : 'TICKET PRINTED');
    btn.disabled = true;
    
    // 3. Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      priceDisplay.textContent = '₦0';
      btn.style.background = 'var(--accent-green)';
      btn.style.color = 'var(--bg-dark)';
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      // Auto-focus phone for next customer
      document.getElementById('destination').focus();
    }, 2000);
  });
});
