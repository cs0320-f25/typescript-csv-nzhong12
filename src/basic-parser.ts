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
export async function parseCSV<T>( // take in parameters 
  path: string, 
  schema?: z.ZodSchema<T> // optional schema parameter, now generic function
): Promise<T[] | string[][]> {
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });
  
  if (!schema) { // no schema provided
    let result: string[][] = []
  
    // default behavior: just return 2-d array of strings
    for await (const line of rl) {
      const values = line.split(",").map((v) => v.trim());
      result.push(values)
    }
    return result
  }
  
  // schema is provided, fully validate and transform each row if possible
  let result: T[] = []
  
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());
    
    try {
      // validate the row using the provided schema
      const validatedRow = schema.parse(values);
      result.push(validatedRow)
    } catch (error) {
      // if validation fails, communicate the failure back to the caller
      if (error instanceof z.ZodError) {
        throw new Error(`CSV row validation failed: ${error.message} for row: [${values.join(', ')}]`);
      }
      throw error;
    }
  }
  return result
}