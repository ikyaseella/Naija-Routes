import { supabaseAdmin } from '../config/supabase.js';

export class CorporateService {
  static async listCorporates() {
    const { data, error } = await supabaseAdmin
      .from('corporates')
      .select('*')
      .is('deleted_at', null)
      .order('name');

    if (error) throw new Error(error.message);
    return data;
  }

  static async getCorporate(id) {
    const { data, error } = await supabaseAdmin
      .from('corporates')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !data) throw new Error('Corporate account not found');

    const { data: departments } = await supabaseAdmin
      .from('corporate_departments')
      .select('*')
      .eq('corporate_id', id)
      .is('deleted_at', null);

    const { count: employeeCount } = await supabaseAdmin
      .from('corporate_employees')
      .select('*', { count: 'exact', head: true })
      .eq('corporate_id', id)
      .is('deleted_at', null);

    const { data: policy } = await supabaseAdmin
      .from('corporate_travel_policies')
      .select('*')
      .eq('corporate_id', id)
      .eq('is_active', true)
      .is('deleted_at', null)
      .limit(1)
      .single();

    return { ...data, departments: departments || [], employeeCount: employeeCount || 0, policy: policy || null };
  }

  static async getDepartments(corporateId) {
    const { data: corp } = await supabaseAdmin
      .from('corporates')
      .select('id')
      .eq('id', corporateId)
      .is('deleted_at', null)
      .single();

    if (!corp) throw new Error('Corporate account not found');

    const { data, error } = await supabaseAdmin
      .from('corporate_departments')
      .select('*')
      .eq('corporate_id', corporateId)
      .is('deleted_at', null)
      .order('name');

    if (error) throw new Error(error.message);
    return data;
  }

  static async getEmployees(corporateId, departmentId) {
    const { data: corp } = await supabaseAdmin
      .from('corporates')
      .select('id')
      .eq('id', corporateId)
      .is('deleted_at', null)
      .single();

    if (!corp) throw new Error('Corporate account not found');

    let query = supabaseAdmin
      .from('corporate_employees')
      .select('*, corporate_departments(name)')
      .eq('corporate_id', corporateId)
      .is('deleted_at', null);

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    const { data, error } = await query.order('created_at');
    if (error) throw new Error(error.message);
    return data;
  }

  static async getPolicy(corporateId) {
    const { data: corp } = await supabaseAdmin
      .from('corporates')
      .select('id')
      .eq('id', corporateId)
      .is('deleted_at', null)
      .single();

    if (!corp) throw new Error('Corporate account not found');

    const { data, error } = await supabaseAdmin
      .from('corporate_travel_policies')
      .select('*')
      .eq('corporate_id', corporateId)
      .eq('is_active', true)
      .is('deleted_at', null)
      .limit(1)
      .single();

    if (error || !data) return null;
    return data;
  }

  static async bulkBook({ corporateId, departmentId, employeeId, scheduleId, route, operator, seats, travelDate, passengerNames }) {
    const { data: corp } = await supabaseAdmin
      .from('corporates')
      .select('*')
      .eq('id', corporateId)
      .is('deleted_at', null)
      .single();

    if (!corp) throw new Error('Corporate account not found');

    const { data: policy } = await supabaseAdmin
      .from('corporate_travel_policies')
      .select('*')
      .eq('corporate_id', corporateId)
      .eq('is_active', true)
      .is('deleted_at', null)
      .limit(1)
      .single();

    if (!policy) throw new Error('No travel policy found for this corporate account');

    const pricePerSeatKobo = 950000;
    const totalKobo = seats.length * pricePerSeatKobo;

    if (policy.max_price_per_booking_kobo > 0 && totalKobo > policy.max_price_per_booking_kobo) {
      throw new Error(`Total exceeds policy limit of ₦${(policy.max_price_per_booking_kobo / 100).toLocaleString()}`);
    }

    const status = totalKobo > policy.requires_approval_above_kobo ? 'pending_approval' : 'booked';

    const { data, error } = await supabaseAdmin
      .from('corporate_bookings')
      .insert({
        corporate_id: corporateId,
        department_id: departmentId,
        employee_id: employeeId,
        schedule_id: scheduleId,
        seats,
        route,
        operator,
        total_kobo: totalKobo,
        status,
        travel_date: travelDate,
        passenger_names: passengerNames || [],
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async approveBooking(bookingId) {
    const { data: booking } = await supabaseAdmin
      .from('corporate_bookings')
      .select('status')
      .eq('id', bookingId)
      .is('deleted_at', null)
      .single();

    if (!booking) throw new Error('Booking not found');
    if (booking.status !== 'pending_approval') throw new Error(`Booking is ${booking.status}, not pending approval`);

    const { data, error } = await supabaseAdmin
      .from('corporate_bookings')
      .update({ status: 'booked', approved_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async cancelBooking(bookingId) {
    const { data: booking } = await supabaseAdmin
      .from('corporate_bookings')
      .select('status')
      .eq('id', bookingId)
      .is('deleted_at', null)
      .single();

    if (!booking) throw new Error('Booking not found');
    if (booking.status === 'cancelled') throw new Error('Booking already cancelled');

    const { data, error } = await supabaseAdmin
      .from('corporate_bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getBookings(corporateId, status) {
    const { data: corp } = await supabaseAdmin
      .from('corporates')
      .select('id')
      .eq('id', corporateId)
      .is('deleted_at', null)
      .single();

    if (!corp) throw new Error('Corporate account not found');

    let query = supabaseAdmin
      .from('corporate_bookings')
      .select('*')
      .eq('corporate_id', corporateId)
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('booked_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  static async getInvoices(corporateId) {
    const { data: corp } = await supabaseAdmin
      .from('corporates')
      .select('id')
      .eq('id', corporateId)
      .is('deleted_at', null)
      .single();

    if (!corp) throw new Error('Corporate account not found');

    const { data, error } = await supabaseAdmin
      .from('corporate_invoices')
      .select('*, corporate_invoice_line_items(*)')
      .eq('corporate_id', corporateId)
      .is('deleted_at', null)
      .order('month', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  static async getInvoice(invoiceId) {
    const { data, error } = await supabaseAdmin
      .from('corporate_invoices')
      .select('*, corporate_invoice_line_items(*)')
      .eq('id', invoiceId)
      .is('deleted_at', null)
      .single();

    if (error || !data) throw new Error('Invoice not found');
    return data;
  }

  static async getCorporateDashboard(corporateId) {
    const corp = await this.getCorporate(corporateId);

    const { data: bookings } = await supabaseAdmin
      .from('corporate_bookings')
      .select('*')
      .eq('corporate_id', corporateId)
      .is('deleted_at', null);

    const allBookings = bookings || [];
    const activeBookings = allBookings.filter(b => b.status === 'booked' || b.status === 'approved');
    const pendingApprovals = allBookings.filter(b => b.status === 'pending_approval');
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled');
    const totalSpendKobo = allBookings.reduce((s, b) => s + (b.status !== 'cancelled' ? b.total_kobo : 0), 0);

    const { data: unpaidInvoice } = await supabaseAdmin
      .from('corporate_invoices')
      .select('*')
      .eq('corporate_id', corporateId)
      .neq('status', 'paid')
      .is('deleted_at', null)
      .limit(1)
      .single();

    return {
      corporate: corp,
      summary: {
        totalBookings: allBookings.length,
        activeBookings: activeBookings.length,
        pendingApprovals: pendingApprovals.length,
        cancelledBookings: cancelledBookings.length,
        totalSpendKobo,
        monthlySpendKobo: corp.current_month_spend_kobo,
        monthlyLimitKobo: corp.monthly_limit_kobo,
        budgetUsedPercent: corp.monthly_limit_kobo > 0 ? Math.round((corp.current_month_spend_kobo / corp.monthly_limit_kobo) * 100) : 0,
      },
      recentBookings: activeBookings.slice(0, 5),
      invoice: unpaidInvoice || null,
    };
  }
}
