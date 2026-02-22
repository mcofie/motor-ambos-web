import { listFuelLogs } from './src/lib/supaFetch';

async function run() {
    try {
        const logs = await listFuelLogs('a6380d2c-dac3-40ed-a625-feded29a95c5');
        console.log("Logs:", logs);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
