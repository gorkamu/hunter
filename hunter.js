#!/usr/bin/env node

const hunter = require('commander');
const { prompt } = require('inquirer');
const HunterService = require('./service/hunterService');
const questions = require('./lib/questions');

let options = {};
hunter.version('0.1.0')
    .option('-t, --tld <tld>', 'Search by TLD')
    .option('-o, --order <order>', 'Order by [bl,dp,aby,sg,co,cpc,dropped]')
    .option('-om, --orderMode <orderMode>', 'Order Mode [asc, desc]')
    .option('-f, --format <format>', 'Print results in the specific format [json|csv]')
    .option('-ti, --time <time>', 'Print dropped results [today|yesterday]')
    .parse(process.argv);

if(hunter.tld || hunter.order || hunter.orderMode || hunter.format || hunter.time) {
    if(hunter.tld) options.tld = hunter.tld;
    if(hunter.order) options.order = hunter.order;
    if(hunter.orderMode) options.orderMode = hunter.orderMode;
    if(hunter.format) options.printFormat = hunter.format.toLowerCase();
    if(hunter.time) options.time = hunter.time.toLowerCase();

    new HunterService(options).get();
}else{
    prompt(questions).then(answers => {
        new HunterService(answers).get();
    })
}
