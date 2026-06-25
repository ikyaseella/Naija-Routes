export class ReviewService {

  static async createReview({ userId, bookingId, operatorId, ratings, body }) {
    console.log(`[ReviewService] Creating review for booking ${bookingId}`);

    const review = {
      id: `rev-${Date.now()}`,
      userId,
      bookingId,
      operatorId,
      operatorRating: ratings.operator,
      driverRating: ratings.driver || null,
      vehicleRating: ratings.vehicle || null,
      punctualityRating: ratings.punctuality || null,
      body: body || null,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return review;
  }

  static async getOperatorReviews(operatorId) {
    return [
      {
        id: 'rev-001',
        userId: 'usr-emeka',
        passengerName: 'Emeka Okonkwo',
        operatorRating: 5,
        driverRating: 4,
        vehicleRating: 5,
        punctualityRating: 4,
        body: 'Very comfortable bus. AC was working perfectly and we arrived on time.',
        createdAt: '2025-12-20T10:30:00Z'
      },
      {
        id: 'rev-002',
        userId: 'usr-fatima',
        passengerName: 'Fatima Bello',
        operatorRating: 4,
        driverRating: 5,
        vehicleRating: 4,
        punctualityRating: 3,
        body: 'Driver was excellent but we left 30 minutes late.',
        createdAt: '2025-12-19T14:20:00Z'
      },
      {
        id: 'rev-003',
        userId: 'usr-chisom',
        passengerName: 'Chisom Eze',
        operatorRating: 5,
        driverRating: 5,
        vehicleRating: 5,
        punctualityRating: 5,
        body: 'Best transport experience I have had in Nigeria. Will definitely use again.',
        createdAt: '2025-12-18T08:15:00Z'
      }
    ];
  }

  static async getOperatorAverageRating(operatorId) {
    return {
      overall: 4.7,
      operator: 4.7,
      driver: 4.6,
      vehicle: 4.8,
      punctuality: 4.2,
      totalReviews: 128
    };
  }
}
