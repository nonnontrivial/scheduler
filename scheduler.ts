import { getFlags } from './flags/mod.ts';
import { writeUpcomingSchedule } from './write/mod.ts';

const flags = getFlags();
if (!flags.isValid) {
	console.error(flags.invalidMessage);
	Deno.exit(1);
}

try {
	await writeUpcomingSchedule(flags.workingDirectory);
	Deno.exit(0);
} catch (err) {
	console.error(err);
	Deno.exit(1);
}
