/** One-time, cautious cleanup of historical phone values in Supabase. */
import { readFileSync, writeFileSync, chmodSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { normalizePhone } from "../src/lib/phone.ts";

const apply = process.argv.includes("--apply");
const env = Object.fromEntries(readFileSync(".env.local", "utf8").split(/\r?\n/)
    .filter((line) => line && !line.trimStart().startsWith("#") && line.includes("="))
    .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "")];
    }));
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase configuration is missing");

const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "motorambos" },
});
const tables = [
    { name: "members", column: "phone", uniqueIdentity: true },
    { name: "providers", column: "phone_business", uniqueIdentity: false },
    { name: "requests", column: "driver_phone", uniqueIdentity: false },
    { name: "service_portal_otps", column: "phone_number", uniqueIdentity: false },
];

async function readRows(table, column) {
    const rows = [];
    for (let from = 0; ; from += 1000) {
        const { data, error } = await client.from(table).select(`id,${column}`).range(from, from + 999);
        if (error) throw new Error(`Could not read ${table}: ${error.code || error.message}`);
        rows.push(...data);
        if (data.length < 1000) return rows;
    }
}

const snapshots = [];
const changes = [];
const summary = [];
for (const table of tables) {
    const rows = await readRows(table.name, table.column);
    const canonicalCounts = new Map();
    for (const row of rows) {
        const canonical = normalizePhone(row[table.column]);
        if (canonical) canonicalCounts.set(canonical, (canonicalCounts.get(canonical) || 0) + 1);
    }
    const report = { table: table.name, total: rows.length, toNormalize: 0, ambiguous: 0, invalid: 0 };
    for (const row of rows) {
        const before = row[table.column];
        if (!before) continue;
        const after = normalizePhone(before);
        if (!after) { report.invalid++; continue; }
        if (after === before) continue;
        if (table.uniqueIdentity && canonicalCounts.get(after) > 1) { report.ambiguous++; continue; }
        report.toNormalize++;
        snapshots.push({ table: table.name, column: table.column, id: row.id, before, after });
        changes.push({ table: table.name, column: table.column, id: row.id, before, after });
    }
    summary.push(report);
}
console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", summary }));
if (!apply) process.exit(0);

const backupDirectory = mkdtempSync(join(tmpdir(), "motor-ambos-phones-"));
const backupPath = join(backupDirectory, "before-and-after.json");
writeFileSync(backupPath, JSON.stringify({ createdAt: new Date().toISOString(), changes: snapshots }, null, 2), { mode: 0o600 });
chmodSync(backupPath, 0o600);
console.log(JSON.stringify({ backupPath, plannedUpdates: changes.length }));

const results = { updated: 0, skippedChanged: 0, failed: 0 };
for (const change of changes) {
    const { data, error } = await client.from(change.table)
        .update({ [change.column]: change.after })
        .eq("id", change.id)
        .eq(change.column, change.before)
        .select("id")
        .maybeSingle();
    if (error) { results.failed++; console.error(JSON.stringify({ table: change.table, id: change.id, code: error.code || "unknown" })); }
    else if (data) results.updated++;
    else results.skippedChanged++;
}
console.log(JSON.stringify({ results }));
if (results.failed || results.skippedChanged) process.exitCode = 1;
