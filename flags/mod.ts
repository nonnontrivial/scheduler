import { Args, parse } from 'https://deno.land/std@0.165.0/flags/mod.ts';
import { workingDirectoryFlag } from '../const.ts';

type Flags = typeof workingDirectoryFlag;

/**
 * Determines if flags were included when the command was run
 * @param opts command line args
 * @param flags array of allowed command line flags
 * @returns true/false of existence of each flag
 */
const getFlagsExist = (
	opts: Args,
	flags: Flags[],
): boolean[] => flags?.map((f) => f in opts);

interface FlagResult {
	isValid: boolean;
	invalidMessage?: string;
}
export const getFlags = (): FlagResult & { [F in Flags]: string } => {
	const opts = parse(Deno.args);
	const [workingDirectoryFlagIsPresent] = getFlagsExist(opts, [
		workingDirectoryFlag,
	]);
	return {
		isValid: workingDirectoryFlagIsPresent,
		invalidMessage: !workingDirectoryFlagIsPresent
			? `missing --${workingDirectoryFlag}`
			: undefined,
		[workingDirectoryFlag]: String(opts[workingDirectoryFlag]),
	};
};
