import { supabaseAdmin } from '../config/supabase.js';

export class InsuranceService {
  static async getPlans(providerId) {
    let query = supabaseAdmin
      .from('insurance_plans')
      .select('*, insurance_providers(id, name, logo_url, rating, description)')
      .eq('is_active', true);

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    const { data, error } = await query.order('price_kobo');
    if (error) throw new Error(error.message);
    return data;
  }

  static async getPlan(planId) {
    const { data, error } = await supabaseAdmin
      .from('insurance_plans')
      .select('*, insurance_providers(id, name, logo_url, rating, description, contact_phone, claims_email)')
      .eq('id', planId)
      .single();

    if (error || !data) throw new Error('Insurance plan not found');
    return data;
  }

  static async getProviders() {
    const { data: providers, error: pErr } = await supabaseAdmin
      .from('insurance_providers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (pErr) throw new Error(pErr.message);

    const result = await Promise.all(providers.map(async (p) => {
      const { data: plans } = await supabaseAdmin
        .from('insurance_plans')
        .select('*')
        .eq('provider_id', p.id)
        .eq('is_active', true)
        .order('price_kobo');

      return { ...p, plans: plans || [] };
    }));

    return result;
  }

  static async purchaseInsurance({ userId, bookingId, planId, passengerName, travelDate, route }) {
    const { data: plan, error: planErr } = await supabaseAdmin
      .from('insurance_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planErr || !plan) throw new Error('Invalid insurance plan');

    const { data, error } = await supabaseAdmin
      .from('insurance_purchases')
      .insert({
        user_id: userId,
        booking_id: bookingId,
        plan_id: planId,
        provider_id: plan.provider_id,
        price_kobo: plan.price_kobo,
        status: 'active',
        passenger_name: passengerName || 'Unknown',
        travel_date: travelDate || new Date().toISOString().split('T')[0],
        route: route || '—',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getPurchases(userId) {
    let query = supabaseAdmin
      .from('insurance_purchases')
      .select('*, insurance_plans(*)')
      .order('purchased_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  static async getPurchaseByBooking(bookingId) {
    const { data, error } = await supabaseAdmin
      .from('insurance_purchases')
      .select('*, insurance_plans(*)')
      .eq('booking_id', bookingId)
      .limit(1)
      .single();

    if (error || !data) return null;
    return data;
  }

  static async fileClaim({ purchaseId, userId, type, description, amountKobo }) {
    const { data: purchase } = await supabaseAdmin
      .from('insurance_purchases')
      .select('user_id')
      .eq('id', purchaseId)
      .single();

    if (!purchase) throw new Error('Insurance purchase not found');
    if (purchase.user_id !== userId) throw new Error('Claim must be filed by policy owner');

    const { data, error } = await supabaseAdmin
      .from('insurance_claims')
      .insert({
        purchase_id: purchaseId,
        user_id: userId,
        type: type || 'other',
        description: description || '',
        amount_kobo: amountKobo,
        status: 'pending',
        documents: [],
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getClaims(userId) {
    let query = supabaseAdmin
      .from('insurance_claims')
      .select('*, insurance_purchases(*)')
      .order('filed_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  static async getClaim(claimId) {
    const { data, error } = await supabaseAdmin
      .from('insurance_claims')
      .select('*, insurance_purchases(*)')
      .eq('id', claimId)
      .single();

    if (error || !data) throw new Error('Claim not found');
    return data;
  }

  static async updateClaimStatus(claimId, status, resolution) {
    if (!['approved', 'rejected', 'under_review'].includes(status)) {
      throw new Error('Invalid status. Use: approved, rejected, under_review');
    }

    const { data: claim } = await supabaseAdmin
      .from('insurance_claims')
      .select('id')
      .eq('id', claimId)
      .single();

    if (!claim) throw new Error('Claim not found');

    const update = { status };
    if (status === 'approved' || status === 'rejected') {
      update.resolved_at = new Date().toISOString();
    }
    if (resolution) {
      update.resolution = resolution;
    }

    const { data, error } = await supabaseAdmin
      .from('insurance_claims')
      .update(update)
      .eq('id', claimId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
