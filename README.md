# Batches Backoffice


## Description

The main functionality of this project consists of scheduling, configuring and monitoring batches.  

The user can schedule one or more multiple batches using Cron.  
The user also has additional options for subsequent batches in case of multiple, such as: independancy, meaning choosing if the batch can run if the previous batch threw an error, and previous batch input, meaning reading the output of the execution of the past batch. The latter can allow passing data between separate data and can be used as means of communication between batches.  
The user can additionally add a batch to run after an existing batch, this also allows all the aforementioned additional options of the subsequent batches.  
The user can also download the logs of a batch's executions by providing the id of the execution.  
The user can furthermore disable or enable a batch. Disabling removes the job running the batch from the scheduler but keeps its data in case the user wants to re-enable the batch.  

The following are functionalities we have yet to implement: Monitor a batch's execution progress, real-time monitoring of the output of the batch and allow adding another batch that runs in case of an error.

## Installation

1. [Download and install Node.js](https://nodejs.org/en/)
2. To download and install npm packages, use the following npm CLI command:
```
npm install
```
3. Use one of the following commands to run the aplication locally:

```
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```
