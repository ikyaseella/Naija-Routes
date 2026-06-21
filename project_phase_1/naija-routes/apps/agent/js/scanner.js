/**
 * Agent App — QR Scanner Logic
 * Uses html5-qrcode to read tickets and validate them.
 */

let scanner = null;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('reader')) {
    initScanner();
  }
});

function initScanner() {
  scanner = new Html5QrcodeScanner(
    "reader",
    { 
      fps: 10,
      qrbox: {width: 250, height: 250},
      aspectRatio: 1.0,
      formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
    },
    /* verbose= */ false
  );
  
  scanner.render(onScanSuccess, onScanFailure);
}

function onScanSuccess(decodedText, decodedResult) {
  // Stop scanning immediately to prevent duplicate fires
  scanner.pause(true);
  
  console.log(`Scan result: ${decodedText}`);
  
  // Phase 1 Mock Validation
  // In Phase 2, this calls: POST /api/v1/tickets/:hash/scan
  
  document.getElementById('reader').style.display = 'none';
  const resultCard = document.getElementById('resultCard');
  resultCard.style.display = 'block';
  
  if (decodedText.includes('NR-TICKET')) {
    document.getElementById('statusIcon').textContent = '✅';
    document.getElementById('statusText').textContent = 'VALID TICKET';
    document.getElementById('statusText').className = 'text-green mono';
    
    // Mock data based on the Phase 1 test ticket
    document.getElementById('resName').textContent = 'Emeka Okonkwo';
    document.getElementById('resSeat').textContent = '3C';
  } else {
    document.getElementById('statusIcon').textContent = '❌';
    document.getElementById('statusText').textContent = 'INVALID OR USED';
    document.getElementById('statusText').className = 'mono';
    document.getElementById('statusText').style.color = 'var(--accent-red)';
    
    document.getElementById('resName').textContent = 'Unknown';
    document.getElementById('resSeat').textContent = '--';
  }
}

function onScanFailure(error) {
  // handle scan failure, usually better to ignore and keep scanning.
  // for html5-qrcode this fires constantly when no QR is in view.
}

window.resetScanner = function() {
  document.getElementById('resultCard').style.display = 'none';
  document.getElementById('reader').style.display = 'block';
  if (scanner) {
    scanner.resume();
  }
}
