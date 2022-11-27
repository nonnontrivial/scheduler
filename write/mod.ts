import { weekOfYear } from "https://deno.land/std@0.165.0/datetime/mod.ts";
import { SEP } from "https://deno.land/std@0.165.0/path/mod.ts";

/**
 * @param path path to the toplevel schedule
 */
const createIfNotExists = async (path: string) => {
  try {
    await Deno.mkdir(path);
  } catch {
    // noop
  }
};

/**
 * @param path
 * @returns path to the (annual) subdirectory
 */
const getSubdirectoryPath = async (path: string) => {
  await createIfNotExists(path);
  const rp = await Deno.realPath(path);
  const sn = String(new Date().getFullYear());
  return [rp, sn]?.join(SEP);
};

/**
 * @param subdirectoryPath path to the (annual) subdirectory
 * @returns path to the (weekly) file
 */
const getFilePath = async (subdirectoryPath: string) => {
  const week = String(weekOfYear(new Date()));
  const filename = `week${week}.md`;
  const path = `${subdirectoryPath}${SEP}${filename}`;
  const { rid } = await Deno.create(path);
  Deno.close(rid);
  return await Deno.realPath(path);
};

const dirname = new URL(".", import.meta.url).pathname;

/**
 * Writes the schedule template in the appropriate filepath
 * @param path path to the schedule
 * @returns info pertaining to the file write
 */
const writeUpcomingSchedule = async (
  path: string,
): Promise<Partial<Deno.FileInfo>> => {
  const subdirectoryPath = await getSubdirectoryPath(path);
  await Deno.mkdir(subdirectoryPath, { recursive: true });
  const templatePath = await Deno.realPath(
    `${dirname}template.md`,
  );
  const filePath = await getFilePath(subdirectoryPath);
  await Deno.copyFile(templatePath, filePath);
  const { size } = await Deno.stat(filePath);
  return {
    size,
  };
};

export { getFilePath, getSubdirectoryPath, writeUpcomingSchedule };
