#!/usr/bin/env node

const hunter = require('commander');
const { prompt } = require('inquirer');
const HunterService = require('./service/hunterService');
// const questions = require('./lib/questions');

let options = {};
hunter.version('0.1.0')
    .option('-t, --tld <tld>', 'Search by TLD')
    .option('-o, --order <order>', 'Order by [bl,dp,aby,sg,co,cpc,dropped]')
    .option('-om, --orderMode <orderMode>', 'Order Mode [asc, desc]')
    .option('-json, --json', 'Print results in json')
    .option('-csv, --csv', 'Print results in CSV')
    .parse(process.argv);


if(hunter.tld) {
    options.tld = hunter.tld;
}

if(hunter.order) {
    options.order = hunter.order;
}

if(hunter.orderMode) {
    options.orderMode = hunter.orderMode;
}

if(hunter.json && !hunter.csv) {
    options.printFormat = 'json';
}

if(!hunter.json && hunter.csv) {
    options.printFormat = 'csv';
}

new HunterService(options).get();
