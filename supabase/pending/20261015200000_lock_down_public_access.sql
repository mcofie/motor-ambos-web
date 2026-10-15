-- Close the public key's access to private data.
--
-- Before this, anyone holding the public (anon) key, which ships in every browser, could read and change
-- members, vehicles, service history, fuel logs, requests, trips and OTP codes. After it:
--   * anonymous visitors can only read the provider directory, services and plans, and create a request;
--   * a signed-in user sees and changes only their own rows;
--   * staff (motorambos.is_admin(), driven by motorambos.admin_emails) can do everything;
--   * the website's server routes keep working through the service role.
--
-- DO NOT APPLY until the Android app signs drivers in with Supabase Auth instead of the anon key.
-- Every staff email in NEXT_PUBLIC_ADMIN_EMAILS must also be in motorambos.admin_emails first.

-- ── Members ─────────────────────────────────────────────
drop policy if exists "Allow anon members access" on motorambos.members;
drop policy if exists "Allow anon to insert members" on motorambos.members;
drop policy if exists "Allow anon to select members" on motorambos.members;
drop policy if exists "Allow anon to update members" on motorambos.members;
drop policy if exists "dev_open_members" on motorambos.members;
revoke all on motorambos.members from anon;
grant select, update on motorambos.members to authenticated;

create policy "members read own" on motorambos.members for select to authenticated
    using (auth_user_id = auth.uid() or motorambos.is_admin());
create policy "members update own" on motorambos.members for update to authenticated
    using (auth_user_id = auth.uid() or motorambos.is_admin())
    with check (auth_user_id = auth.uid() or motorambos.is_admin());

-- ── Vehicles (own-row policies already exist) ───────────
drop policy if exists "Allow anon vehicles access" on motorambos.vehicles;
drop policy if exists "Public access to vehicles" on motorambos.vehicles;
revoke all on motorambos.vehicles from anon;
create policy "vehicles staff" on motorambos.vehicles for all to authenticated
    using (motorambos.is_admin()) with check (motorambos.is_admin());

-- ── Service history: through vehicle ownership ──────────
drop policy if exists "Allow anon service_history access" on motorambos.service_history;
revoke all on motorambos.service_history from anon;
grant select, insert, update, delete on motorambos.service_history to authenticated;
create policy "service history own" on motorambos.service_history for all to authenticated
    using (motorambos.is_admin() or vehicle_id in (select id from motorambos.vehicles where user_id = auth.uid()))
    with check (motorambos.is_admin() or vehicle_id in (select id from motorambos.vehicles where user_id = auth.uid()));

-- ── Fuel logs (own-row policies already exist) ──────────
drop policy if exists "Allow anon fuel_logs access" on motorambos.fuel_logs;
revoke all on motorambos.fuel_logs from anon;
grant select, insert, update, delete on motorambos.fuel_logs to authenticated;
create policy "fuel logs staff" on motorambos.fuel_logs for select to authenticated using (motorambos.is_admin());

-- ── Roadside requests: anyone can ask for help, only the asker and staff can read ──
drop policy if exists "Authenticated can read all requests" on motorambos.requests;
drop policy if exists "requests select (anon)" on motorambos.requests;
revoke select, update, delete on motorambos.requests from anon;
create policy "requests insert signed in" on motorambos.requests for insert to authenticated
    with check (created_by is null or created_by = auth.uid());
create policy "requests read own" on motorambos.requests for select to authenticated
    using (created_by = auth.uid() or motorambos.is_admin());
create policy "requests staff" on motorambos.requests for update to authenticated
    using (motorambos.is_admin()) with check (motorambos.is_admin());
revoke all on motorambos.request_review_context from anon;

-- ── Providers: public directory stays; staff can edit any provider ──
drop policy if exists "dev_open_provider_rates" on motorambos.provider_rates;
drop policy if exists "dev_open_provider_services" on motorambos.provider_services;
create policy "providers staff" on motorambos.providers for all to authenticated
    using (motorambos.is_admin()) with check (motorambos.is_admin());

-- ── Trips and telemetry: own only ───────────────────────
drop policy if exists "Enable insert for all users" on motorambos.driving_trips;
drop policy if exists "Enable select for all users" on motorambos.driving_trips;
drop policy if exists "Enable update for all users" on motorambos.driving_trips;
revoke all on motorambos.driving_trips from anon;
grant select, insert, update on motorambos.driving_trips to authenticated;
create policy "trips own" on motorambos.driving_trips for all to authenticated
    using (user_id = auth.uid() or motorambos.is_admin()) with check (user_id = auth.uid());

drop policy if exists "Enable insert for all events" on motorambos.telemetry_events;
drop policy if exists "Enable select for all events" on motorambos.telemetry_events;
revoke all on motorambos.telemetry_events from anon;
grant select, insert on motorambos.telemetry_events to authenticated;
create policy "telemetry own" on motorambos.telemetry_events for all to authenticated
    using (trip_id in (select id from motorambos.driving_trips where user_id = auth.uid()) or motorambos.is_admin())
    with check (trip_id in (select id from motorambos.driving_trips where user_id = auth.uid()));

-- ── Member-owned lists ──────────────────────────────────
drop policy if exists "Allow anon favorites access" on motorambos.favorite_providers;
revoke all on motorambos.favorite_providers from anon;
grant select, insert, delete on motorambos.favorite_providers to authenticated;
create policy "favourites own" on motorambos.favorite_providers for all to authenticated
    using (member_id in (select id from motorambos.members where auth_user_id = auth.uid()))
    with check (member_id in (select id from motorambos.members where auth_user_id = auth.uid()));

drop policy if exists "Allow anon deletion access" on motorambos.deletion_requests;
revoke all on motorambos.deletion_requests from anon;
grant select, insert on motorambos.deletion_requests to authenticated;
create policy "deletion requests own" on motorambos.deletion_requests for all to authenticated
    using (member_id in (select id from motorambos.members where auth_user_id = auth.uid()) or motorambos.is_admin())
    with check (member_id in (select id from motorambos.members where auth_user_id = auth.uid()));

drop policy if exists "Allow anon nfc_requests access" on motorambos.nfc_requests;
drop policy if exists "Allow insertion of NFC requests" on motorambos.nfc_requests;
drop policy if exists "Allow selection of NFC requests" on motorambos.nfc_requests;
revoke all on motorambos.nfc_requests from anon;

drop policy if exists "Public access to profiles" on motorambos.profiles;
revoke all on motorambos.profiles from anon;

-- ── One-time codes are for the server only ──────────────
drop policy if exists "Enable all operations for anon" on motorambos.otp_codes;
drop policy if exists "Public access to otp_codes" on motorambos.otp_codes;
revoke all on motorambos.otp_codes from anon, authenticated;
