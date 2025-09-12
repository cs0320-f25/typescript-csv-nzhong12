**Supplemental Challenge:**

My favorite data structure is a stack. In JSON, a stack could be represented an object with array of elements, 
such as 

{
    "scores": [100, 99, 23, 50]
}

To implement this with Zod Schema, we could use z.object to create an array of "scores", and we could use z.infer
to find the type used for the stack in TypeScript. 

**Reflection:** 

1. Correctness

A CSV parser is correct if upon caller use, it always transforms raw CSV text into either specified or default representation, maybe including general functionality for other user-specified properties like ignoring header or specifying delimiter type. A must-have property is splitting each row of data number of fields and not losing any data. 

Some general functionalities: 
- parser throws error when row sizes differ
- parser either transforms data to match schema specified or throws error
- empty field are represented instead of skipped

2. Random, On-Demand Generation

If I had a random CSV generator, I would generate completely random data, such as quotes and commas placed completely randomly. After defining some general rules, I would keep running the generator to try and break the rules, or randomly mutate real CSVs that fail to see if the results still indicate failure with the correct output to the caller. This way it ensures that the parser works for all data as messy as possible, not just structured data. 

3. Overall Experience, Bugs Encountered and Resolved

This sprint felt similar to fixing some features at my summer internship at Raytheon to allow users to log in with appropriate errors thrown, but the actual technical features were different. The overall iterative process of reflecting on possible general rules and improving based off them is very familiar to be due to that experience. The Zod integration was new to me though, as I’m used to validation being part of business logic, not the parsing step. I ran into small bugs mostly around TypeScript typing and overloads. For example, at first my tests failed when I called parseCSV with three arguments of path, schema, options because I hadn’t defined that overload. I also hit a typing issue where the results were seen as unknown, so I had to either add casts in my tests or fix the overloads. Fixing these forced me to slow down and understand how TypeScript’s overload system and Zod’s coercion work, which was actually useful. 