import * as fs from "fs";
import * as readline from "readline";
import { z } from "zod";

/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when 
 * mousing over this function name. Try it in run-parser.ts!
 * 
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this 
 * in class. For now, just leave the "async" and "await" where they are. 
 * You shouldn't need to alter them.
 * 
 * 
 * @param path The path to the file being loaded.
 * @returns a "promise" to produce a 2-d array of cell values
 * @returns promise that produces a 2-d array of strings, 
 or array of transformed objects if schema is provided, or throws an error if validation fails during transformations
 */

// overloading for all three function signature types
export async function parseCSV(path: string): Promise<string[][]>;
export async function parseCSV<T>(path: string, schema: z.ZodType<T>): Promise<T[]>;
export async function parseCSV<T>(
  path: string,
  schema: z.ZodType<T>,
  options: { hasHeader?: boolean }
): Promise<T[]>;
export async function parseCSV<T>( // take in parameters 
  path: string, 
  schema?: z.ZodType<T>, // optional schema parameter, now generic function
  options?: { hasHeader?: boolean } // account for first row being header, allow user to specifiy
): Promise<T[] | string[][]> {
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });
  
  let firstRow = true;
  if (!schema) { // no schema provided
    let result: string[][] = []
    
    // default behavior: just return 2-d array of strings
    for await (const line of rl) {
      const values = line.split(",").map((v) => v.trim());

      if (options?.hasHeader && firstRow) {
        firstRow = false;
        continue; // skip the header row if so desired by user
      }
      result.push(values)
    }
    return result
  }
  
  // schema is provided, fully validate and transform each row if possible
  let result: T[] = []
  
  let lineNum = 0;
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());

    if (options?.hasHeader && firstRow) {
        firstRow = false;
        continue; // skip the header row if so desired by user
    } 
    
    lineNum++; // increment line number only for non-header rows
    try {
      // validate the row using the provided schema
      const validatedRow = schema.parse(values);
      result.push(validatedRow)
    } catch (error) {
      // if validation fails, communicate the failure back to the caller
      if (error instanceof z.ZodError) {
        throw new Error(
        `CSV row validation failed at line ${lineNum}: ${error.message} (row: [${values.join(", ")}])`
        // report line number and the row that caused the error to the caller
      );
      }
      throw error;
    }
  }
  return result
}