# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.

- #### Step 2: Use an LLM to help expand your perspective.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

    1. User Story 1: Configurable Delimiters (Extensibility - LLM, Me)
    “As a user using the parser, I want to specify different delimiters (like semicolons, tabs, or pipes) so that I can reuse the same parser for .csv, .tsv, and other delimited text formats.”

    Acceptance Criteria:
    
    Default delimiter: comma.
    Option delimiter: "\t" → correctly parse tab-separated files.
    Option delimiter: ";" → correctly parse semicolon-separated files.
    All existing CSV features (quotes, empty values, etc.) still work.


    2. User Story 2: Schema validation with Zod (Extensibility - LLM) 
    “As a user using the parser, I want to pass in schema that defines the structure of each row, so that types that do not match the corresponding specified types are caught immediately.”

    Acceptance Criteria:
    
    Example: if schema is [string, number], then "ABC, 2" should succeed while "ABC, two" should throw an appropriate error
    All existing CSV features (quotes, empty values, etc.) still work.

    
    3. User Story 3: Reject row lengths of different size (Functionality - Me)
    "As a user using the parser, I want the parser to throw error if there are rows with different lengths so that only data with constant number of columns are processed”

    Acceptance Criteria:
    Unable to enter data with different number of elements in each row
    The row and column counts are immediately updated upon entry of data


    4. User Story 4: Streaming Support for large files (Extensibility - LLM)

    User Story:
    “As a user entering in large datasets, I want the parser to support streaming/async iteration of rows, so that I can process huge CSV files without running out of memory.”

    Acceptance Criteria:

    Parser can be called in a loop like for await (const row of parseCSVStream(file)).
    Rows are yielded one at a time instead of loading the entire file into memory.
    Behavior is consistent with normal parsing for smaller files.


    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

    My initial ideas were to make sure the data entered must be formatted in a rectangular fashion or else be rejected since that is what I was able to test in my code in Part I. Then I realized that delimiters are not limited to commas and data can be seperated by a specified delimiter instead. Then I asked the LLM to generate more ideas and it actually produced the same idea of using a specified delimiter as inputted in by the user, which resonated with me. The LLM also added cool user stories of supporting large files inputted by the user and adding in the feature of schema validation to ensure only specific types of data were to be operated on. It seemed that the prompts did not change the results since it stood firm on its user story suggestions.


### Design Choices

### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project:
#### Link to GitHub Repo:  
