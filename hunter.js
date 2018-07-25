#!/usr/bin/env node

'use strict';

const hunter = require('commander');
const { prompt } = require('inquirer');
const HunterService = require('./service/hunterService');
const questions = require('./lib/questions');

let options = {};
hunter.version('0.1.0')
    .option('-t, --tld <tld>', 'Search by TLD')
    .option('-o, --order <order>', 'Order by [bl,dp,aby,sg,co,cpc,dropped]')
    .option('-f, --format <format>', 'Print results in the specific format [json|csv]')
    .option('-m, --mail', 'Send mail with results of a preconfigured search')
    .parse(process.argv);

if(hunter.tld || hunter.order || hunter.orderMode || hunter.format || hunter.time) {
    if(hunter.tld) options.tld = hunter.tld;
    if(hunter.order) options.order = hunter.order;
    if(hunter.format) options.format = hunter.format.toLowerCase();

    new HunterService(options).get().catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
}else if(hunter.mail){
    new HunterService({
        tld: 'es',
        order: 'cpc'
    }).mail().catch((err) => {
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



// 1- Peticion post a https://member.expireddomains.net/domains/expiredes/
//  2- FormData:
// fbl: 500     -- Backlinks minimos
// fblm: 5500   -- Backlinks maximos