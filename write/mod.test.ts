import { assert } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import {
  getFilePath,
  getSubdirectoryPath,
  writeUpcomingSchedule,
} from "./mod.ts";

Deno.test("relevant subdirectory and file exist", async () => {
  const td = await Deno.makeTempDir();
  await writeUpcomingSchedule(td);
  const subdir = await getSubdirectoryPath(td);
  const { isDirectory } = await Deno.stat(subdir);
  assert(isDirectory);
  const file = await getFilePath(subdir);
  const { isFile } = await Deno.stat(file);
  assert(isFile);
});

Deno.test("overwrites existing file", async () => {
  const preexisting = "!";
  const setup = async (): Promise<[string, string]> => {
    const td = await Deno.makeTempDir();
    const subdir = await getSubdirectoryPath(td);
    await Deno.mkdir(subdir);
    await Deno.writeTextFile(await getFilePath(subdir), preexisting);
    return [td, subdir];
  };
  const [td, subdir] = await setup();
  const { size } = await writeUpcomingSchedule(td);
  assert((size ?? 0) > 0);
  const filepath = await getFilePath(subdir);
  const decoder = new TextDecoder("utf-8");
  const filecontents = decoder.decode(await Deno.readFile(filepath));
  assert(!filecontents.includes(preexisting));
});
