const CITIES = ['Lagos', 'Abuja', 'Port Harcourt', 'Onitsha', 'Enugu', 'Ibadan', 'Kano'];
const OPERATORS = ['ABC Transport', 'GUO Transport', 'Peace Mass Transit', 'Chisco Transport'];

export class UssdService {
  static sessions = {};

  static handleRequest({ sessionId, msisdn, input }) {
    let session = this.sessions[sessionId];

    if (!session) {
      session = { sessionId, msisdn, level: 'main', data: {} };
      if (input && input !== '') {
        session.level = 'main';
      }
      this.sessions[sessionId] = session;
    }

    const handler = this.handlers[session.level] || this.handlers.main;
    const result = handler(session, input);
    session.level = result.nextLevel || session.level;
    return result;
  }

  static handlers = {
    main: (session, input) => {
      if (input === '0') {
        delete UssdService.sessions[session.sessionId];
        return { text: 'Thank you for using Naija Routes. Goodbye!', release: true };
      }
      return {
        text: `Naija Routes\n1. Book Ticket\n2. Track Booking\n3. Check Routes\n4. Wallet Balance\n5. Language (English/Yoruba/Hausa)\n0. Exit`,
        nextLevel: 'main_choice',
        release: false,
      };
    },

    main_choice: (session, input) => {
      switch (input) {
        case '1': session.data = {}; return { text: 'Select origin:', nextLevel: 'book_origin', release: false, list: CITIES };
        case '2': return { text: 'Enter booking reference:', nextLevel: 'track_input', release: false };
        case '3': return { text: 'Enter origin city:', nextLevel: 'route_origin', release: false };
        case '4': return { text: `Your wallet balance: ₦${(session.data.walletBalance || 250000) / 100}`, nextLevel: 'wallet', release: false };
        case '5': return { text: 'Select language:\n1. English\n2. Yoruba\n3. Hausa\n4. Igbo\n5. Pidgin\n0. Back', nextLevel: 'lang_choice', release: false };
        default: return { text: 'Invalid. Try again:', nextLevel: 'main_choice', release: false };
      }
    },

    book_origin: (session, input) => {
      if (input === '0') return { text: 'Back to main menu:', nextLevel: 'main', release: false };
      const idx = parseInt(input) - 1;
      if (idx < 0 || idx >= CITIES.length) return { text: 'Invalid. Select origin:', nextLevel: 'book_origin', release: false, list: CITIES };
      session.data.origin = CITIES[idx];
      const destinations = CITIES.filter(c => c !== session.data.origin);
      return { text: `From ${session.data.origin}. Select destination:`, nextLevel: 'book_dest', release: false, list: destinations };
    },

    book_dest: (session, input) => {
      if (input === '0') return { text: 'Select origin:', nextLevel: 'book_origin', release: false, list: CITIES };
      const destinations = CITIES.filter(c => c !== session.data.origin);
      const idx = parseInt(input) - 1;
      if (idx < 0 || idx >= destinations.length) return { text: 'Invalid. Select destination:', nextLevel: 'book_dest', release: false, list: destinations };
      session.data.destination = destinations[idx];
      return { text: `${session.data.origin} → ${session.data.destination}. Select operator:`, nextLevel: 'book_operator', release: false, list: OPERATORS };
    },

    book_operator: (session, input) => {
      if (input === '0') return { text: 'Select destination:', nextLevel: 'book_dest', release: false, list: CITIES.filter(c => c !== session.data.origin) };
      const idx = parseInt(input) - 1;
      if (idx < 0 || idx >= OPERATORS.length) return { text: 'Invalid. Select operator:', nextLevel: 'book_operator', release: false, list: OPERATORS };
      session.data.operator = OPERATORS[idx];
      return { text: `Operator: ${session.data.operator}. Enter number of seats (1-5):`, nextLevel: 'book_seats', release: false };
    },

    book_seats: (session, input) => {
      if (input === '0') return { text: 'Select operator:', nextLevel: 'book_operator', release: false, list: OPERATORS };
      const seats = parseInt(input);
      if (isNaN(seats) || seats < 1 || seats > 5) return { text: 'Enter 1 to 5 seats:', nextLevel: 'book_seats', release: false };
      session.data.seats = seats;
      session.data.amountKobo = seats * 950000;
      return {
        text: `Confirm booking:\n${session.data.origin} → ${session.data.destination}\n${session.data.operator}\n${seats} seat(s)\n₦${(session.data.amountKobo / 100).toLocaleString()}\n1. Confirm\n2. Cancel\n0. Back`,
        nextLevel: 'book_confirm',
        release: false,
      };
    },

    book_confirm: (session, input) => {
      if (input === '0') return { text: 'Enter number of seats:', nextLevel: 'book_seats', release: false };
      if (input === '2') return { text: 'Booking cancelled. Back to main menu:', nextLevel: 'main', release: false };
      if (input === '1') {
        const ref = `NR-USSD-${Date.now().toString(36).toUpperCase()}`;
        delete UssdService.sessions[session.sessionId];
        return { text: `Booking confirmed!\nRef: ${ref}\n${session.data.origin} → ${session.data.destination}\n${session.data.seats} seat(s)\n₦${(session.data.amountKobo / 100).toLocaleString()}\nShow this ref at the park. Thank you!`, release: true };
      }
      return { text: 'Press 1 to confirm or 2 to cancel:', nextLevel: 'book_confirm', release: false };
    },

    track_input: (session, input) => {
      if (input === '0') return { text: 'Back to main menu:', nextLevel: 'main', release: false };
      const booking = UssdService.mockBookingLookup(input);
      if (!booking) return { text: 'Booking not found. Enter a valid reference or 0 to go back:', nextLevel: 'track_input', release: false };
      delete UssdService.sessions[session.sessionId];
      return { text: `Booking: ${booking.ref}\nRoute: ${booking.route}\nDate: ${booking.date}\nSeat: ${booking.seat}\nStatus: ${booking.status}`, release: true };
    },

    route_origin: (session, input) => {
      if (input === '0') return { text: 'Back to main menu:', nextLevel: 'main', release: false };
      session.data.routeOrigin = input;
      return { text: `From ${input}. Enter destination city:`, nextLevel: 'route_dest', release: false };
    },

    route_dest: (session, input) => {
      if (input === '0') return { text: 'Enter origin city:', nextLevel: 'route_origin', release: false };
      const origin = session.data.routeOrigin;
      const dest = input;
      const price = 9500 + Math.floor(Math.random() * 5000);
      const duration = `${[10, 8, 6, 12, 4][Math.floor(Math.random() * 5)]}h`;
      delete UssdService.sessions[session.sessionId];
      return { text: `Routes: ${origin} → ${dest}\nFrom ₦${(price * 100).toLocaleString()}\n~${duration}\nAvailable operators: ABC, GUO, Peace Mass\nDial *347# to book.`, release: true };
    },

    wallet: (session, input) => {
      if (input === '0' || input === '') {
        delete UssdService.sessions[session.sessionId];
        return { text: 'Thank you for using Naija Routes.', release: true };
      }
      return { text: 'Press 0 to exit', nextLevel: 'wallet', release: false };
    },

    lang_choice: (session, input) => {
      const langs = { '1': 'English', '2': 'Yoruba', '3': 'Hausa', '4': 'Igbo', '5': 'Pidgin' };
      if (input === '0') return { text: 'Back to main menu:', nextLevel: 'main', release: false };
      if (langs[input]) {
        session.data.language = langs[input];
        delete UssdService.sessions[session.sessionId];
        return { text: `Language set to ${langs[input]}. Next dial will use this language.`, release: true };
      }
      return { text: 'Select:\n1. English\n2. Yoruba\n3. Hausa\n4. Igbo\n5. Pidgin\n0. Back', nextLevel: 'lang_choice', release: false };
    },
  };

  static mockBookingLookup(ref) {
    const mock = {
      'NR-TEST01': { ref: 'NR-TEST01', route: 'Lagos → Abuja', date: '2026-06-28', seat: '3C', status: 'Confirmed' },
      'NR-TEST02': { ref: 'NR-TEST02', route: 'Abuja → Kano', date: '2026-06-30', seat: '1A', status: 'Pending' },
    };
    return mock[ref.toUpperCase()] || null;
  }
}
