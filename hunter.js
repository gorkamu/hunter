#!/usr/bin/env node

const hunter = require('commander');
const { prompt } = require('inquirer');
const HunterService = require('./service/hunterService');
const questions = require('./lib/questions');

let options = {};
hunter.version('0.1.0')
    .option('-t, --tld <tld>', 'Search by TLD')
    .option('-o, --order <order>', 'Order by [bl,dp,aby,sg,co,cpc,dropped]')
    .option('-f, --format <format>', 'Print results in the specific format [json|csv]')
    .option('-to, --today', 'Print results for today')
    .parse(process.argv);

if(hunter.tld || hunter.order || hunter.orderMode || hunter.format || hunter.time) {
    if(hunter.tld) options.tld = hunter.tld;
    if(hunter.order) options.order = hunter.order;
    if(hunter.format) options.printFormat = hunter.format.toLowerCase();
    if(hunter.today) options.today = hunter.today;

    new HunterService(options).get().catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
}else{
    prompt(questions).then(answers => {
        new HunterService(answers).get();
    }).catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
}
