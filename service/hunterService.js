'use strict';

const request = require('request');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const baseconfig = require('../config/config');
const Table = require('cli-table');
const Assistant = require('../lib/assistant');

class HunterService {

    /**
     * @param config
     */
    constructor(config) {
        this.config = {...baseconfig, ...config};

        this.sanitizeConfig();

        this.assistant = new Assistant();
        this.assistant.setConfig(this.config);

        this.req = request.defaults({
            jar: true,
            rejectUnauthorized: false,
            followAllRedirects: true
        });

        this.DOMAIN = 'https://member.expireddomains.net';
    }

    sanitizeConfig(){
        if(typeof this.config.tld === 'undefined' || this.config.tld === '') {
            throw new Error('No TLD provded');
        }

        if(typeof this.config.MAX_RESULTS === 'undefined' || this.config.MAX_RESULTS === '') {
            this.config.MAX_RESULTS = 20;
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async get() {
        if(this.config.SHOW_LOG){
            console.log(`   \u221A Logging in ${this.DOMAIN}/login/ with U: ${this.config.USER} - P: ${this.config.PASS}`);
        }

        this.req.post({
            url: `${this.DOMAIN}/login/`,
            formData: {
                login: this.config.USER,
                password: this.config.PASS,
                redirect_2_url: '/'
            }
        }, async (err) => {
            if (err) return console.error(err);

            let [result] = await Promise.all([this.getResults()]);

            result = this.prettifyResults(result);
            this.printResults(result);
        });
    }

    /**
     * @param results
     * @returns {Array|*}
     */
    prettifyResults(results) {
        results = this._limitResults(results);

        return results;
    }

    /**
     * @param results
     * @returns {Array}
     * @private
     */
    _limitResults(results) {
        let _array = [];
        if(results.length > this.config.MAX_RESULTS) {
            for(let i=0; i<results.length; i++) {
                if(i >= this.config.MAX_RESULTS) {
                    break;
                }

                _array.push(results[i]);
            }
        }else{
            _array = results;
        }

        return _array;
    }


    /**
     * @param result
     */
    printResults(result) {

        console.log(this.config.format, "---> FORMAT");

        if(this.config.format === 'json') {
            console.log(result);
        }else if(this.config.format === 'csv') {
            for(let i=0; i<result.length; i++) {
                let item = result[i];
                console.log(`${item.domain},${item.bl},${item.dp},${item.aby},${item.sg},${item.co},${item.cpc},${item.dropped},${item.status}`);
            }
        }else{
            const table = new Table({
                head: ['Domain', 'BL', 'DP', 'ABY', 'SG', 'CO', 'CPC', 'Dropped', 'Status'],
                colWidths: [40, 10, 5, 10, 10, 15, 25, 25, 15]
            });

            for(let i=0; i<result.length; i++) {
                let item = result[i];
                table.push([item.domain,item.bl,item.dp,item.aby,item.sg,item.co,item.cpc,item.dropped,item.status]);
            }

            console.log(table.toString());
        }
    }

    /**
     * @param results
     * @param page
     * @returns {Promise<any>}
     */
    async getResults(results = [], page = 0) {
        return new Promise(async (resolve, reject) => {

            let url = `${this.DOMAIN}/domains/expired${this.config.tld}/${this.assistant.getOrder()}`;

            if(page !== 0){
                url += `&start=${page}`;
            }

            if(this.config.SHOW_LOG){
                console.log(`   \u221A Getting ${url}`);
            }

            await this.assistant.sleep(3000);

            this.req.get({
                'url': url
            }, (err, resp, body) => {
                let $ = cheerio.load(body);
                cheerioTableparser($);

                let data = $(".base1 > tbody").parsetable(true, true, true);

                results = [...results, ...this.parseTable(data)];

                if(results.length >= this.config.MAX_RESULTS){
                    resolve(results);
                }else{
                    page +=25;
                    resolve(this.getResults(results, page));
                }
            });
        });
    }

    /**
     * @param data
     * @returns {Array}
     */
    parseTable(data) {
        let result = [];
        for(let i=0; i<data.length; i++) {
            let domain = data[0][i].substr(0, data[2][i]) + '.' + this.config.tld;

            if('available' === data[20][i]) {
                result.push({
                    domain: domain,
                    bl: this.assistant.parseBL(data[3][i]),
                    dp: data[4][i],
                    aby: data[6][i],
                    sg: data[16][i],
                    co: data[17][i],
                    cpc: data[18][i],
                    dropped: data[19][i],
                    status: data[20][i],
                });
            }
        }

        return result;
    }

}

module.exports = HunterService;