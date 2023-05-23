# K6 Testing Repository

This repository contains K6 tests for the DAN API endpoints. The tests cover various functionalities such as listing all accreditations, creating an accreditation, sending a request to the direct harvester using the accreditation, and deleting an accreditation. Additionally, it includes tests for retrieving metadata evidence codes and verifying requirements for making API requests. We are also actively working on adding tests for all plugins.

## Running the Tests Locally
To run the K6 tests locally, follow these steps:

1. Make sure you have the `az cli` installed on your machine.
2. Execute the `runTestLocally.sh` file with the following parameters:
   - `test file`: Specify the name of the test file you want to execute.
   - `use token`: Set this parameter (true/false) to use the authentication token.

For example:
```
./runTestLocally.sh postDeployTests.js true
```

Please ensure that you have the necessary environment configurations set up correctly before running the tests.