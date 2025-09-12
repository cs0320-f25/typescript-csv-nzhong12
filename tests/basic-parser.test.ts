import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const PEOPLENOHEADERCSV_PATH = path.join(__dirname, "../data/peoplenoheader.csv");
const QUOTE_CSV_PATH = path.join(__dirname, "../data/quote.csv");
const TIMNELSON_CSV_PATH = path.join(__dirname, "../data/timnelson.csv");
const DIFFROWS_CSV_PATH = path.join(__dirname, "../data/diffrows.csv");
const FORMATTEDPEOPLE_CSV_PATH = path.join(__dirname, "../data/formattedpeople.csv");
const FORMATTEDPEOPLEHEADER_CSV_PATH = path.join(__dirname, "../data/formattedpeopleheader.csv");


test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }

  const results1 = await parseCSV(QUOTE_CSV_PATH)

  for(const row of results1) {
    expect(Array.isArray(row)).toBe(true);
  }
});

test("parseCSV never yields raw strings", async () => {
    const results = await parseCSV(PEOPLE_CSV_PATH);

    // check that no row is a raw string, and that results is is not string[]
    for (const row of results) {
      expect(Array.isArray(row)).toBe(true);
    }
});

test("parseCSV wraps comma-containing fields in double quotes", async () => {
    const results1 = await parseCSV(QUOTE_CSV_PATH)

    expect(results1).toHaveLength(1); // only header rsow (one row)
    expect(results1[0]).toEqual(["Caesar", "Julius is interesting", "Veni, vidi, vici"]); 
    // FAILS because the comma in the quote is not escaped!
});

test("parseCSV does not return string with commas inside", async () => {
    const results1 = await parseCSV(TIMNELSON_CSV_PATH)

    for (const row of results1) {
      for (const field of row) {
        expect(field.includes(",")).toBe(false); // FAILS because the comma in the quote is not escaped!
      }
    }
});

test("parseCSV does not accept rows of different lengths", async () => {
  // bad CSV should throw an error when parsed
  // FAILS because the parser does not currently check for this
  await expect(parseCSV(DIFFROWS_CSV_PATH)).rejects.toThrow();
});

test("parseCSV preserves leading space(s) and ending space(s) inside quotes", async () => {
  const results1 = await parseCSV(QUOTE_CSV_PATH)

  expect(results1[1][2]).toBe("   a large chicken "); // FAILS because leading spaces are trimmed
});

// testing schema validation and transformation

const PersonRowSchema = z // schema for a person row
    .tuple([z.string(), z.coerce.number()])
    .transform(([name, age]) => ({ name, age }));

test("parseCSV correctly transforms rows to objects when hasHeader is not set (false)", async () => {
  const results = await parseCSV(FORMATTEDPEOPLE_CSV_PATH, PersonRowSchema);
  
  expect(results).toHaveLength(4); // all 4 rows are data rows (no header)
  expect(results[0]).toEqual({ name: "Alice", age: 23 });
  expect(results[1]).toEqual({ name: "Bob", age: 30 });
  expect(results[2]).toEqual({ name: "Charlie", age: 25 });
  expect(results[3]).toEqual({ name: "Nim", age: 22 });
});

test("parseCSV correctly transforms rows to objects when hasHeader is true", async () => {
  const results = await parseCSV(FORMATTEDPEOPLEHEADER_CSV_PATH, PersonRowSchema, { hasHeader: true });
  
  expect(results).toHaveLength(4); // all 4 rows are data rows (not including header - skipped correctly)
  expect(results[0]).toEqual({ name: "Alice", age: 23 });
  expect(results[1]).toEqual({ name: "Bob", age: 30 }); // Bob's age is coerced from "thirty" to 30
  expect(results[2]).toEqual({ name: "Charlie", age: 25 });
  expect(results[3]).toEqual({ name: "Nim", age: 22 });
});

test("parseCSV catches invalid type match to Zod when hasHeader is not set (false)", async () => {
  const PersonRowSchema = z
    .tuple([z.string(), z.coerce.number()])
    .transform(([name, age]) => ({ name, age }));

  await expect(
    parseCSV(FORMATTEDPEOPLEHEADER_CSV_PATH, PersonRowSchema)
  ).rejects.toThrow(/CSV row validation failed/); // fails because Bob's age is "thirty"
  // reports failure on line 2 of actual data
}); 

test("parseCSV catches invalid type match to Zod when hasHeader is true", async () => {
  const PersonRowSchema = z
    .tuple([z.string(), z.coerce.number()])
    .transform(([name, age]) => ({ name, age }));

  await expect( 
    parseCSV(PEOPLE_CSV_PATH, PersonRowSchema, { hasHeader: true })
  ).rejects.toThrow(/CSV row validation failed/); // skips first line header (no error there)
  // still fails - Bob's age is "thirty", reports the error at line 2 of actual data (not including header)
});