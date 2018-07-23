'use strict';

const request = require('request');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const constants = require('../lib/constants');
const baseconfig = require('../config/config');
const Table = require('cli-table');

class HunterService {

    /**
     * @param config
     */
    constructor(config) {
        this.config = {...baseconfig, ...config};
        this.req = request.defaults({
            jar: true,
            rejectUnauthorized: false,
            followAllRedirects: true
        });
    }

    /**
     * @returns {Promise<void>}
     */
    async get() {
        this.req.post({
            url: `${constants.DOMAIN}/login/`,
            formData: {
                login: this.config.USER,
                password: this.config.PASS,
                redirect_2_url: '/'
            }
        }, async (err, resp, body) => {
            if (err) return console.error(err);

            let [result] = await Promise.all([this.getResults()]);

            this.printResults(result);
        });
    }

    /**
     * @param result
     */
    printResults(result) {
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
                colWidths: [40, 5, 5, 10, 10, 15, 25, 25, 15]
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

            let url = `${constants.DOMAIN}/domains/expired${this.config.tld}/${this.getOrder()}`;

            if(page !== 0){
                url += `&start=${page}`;
            }

            await this.sleep(3000);

            this.req.get({
                'url': url
            }, (err, resp, body) => {
                let $ = cheerio.load(body);
                cheerioTableparser($);

                let data = $(".base1 > tbody").parsetable(true, true, true);

                results = [...results, ...this.parseTable(data)];

                if(results.length === this.config.MAX_RESULTS){
                    resolve(results);
                }else{
                    page +=25;
                    resolve(this.getResults(results, page));
                }
            });
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    /**
     * @returns {string}
     */
    getOrder() {
        let order = '';

        if(typeof this.config.order !== 'undefined') {
            order = `?o=${this.matchOrder(this.config.order)}`;
        }

        if(typeof this.config.orderMode !== 'undefined') {
            order += `&r=${this.matchOrderMode(this.config.orderMode)}`;
        }

        return order;
    }

    /**
     * @param order
     * @returns {string}
     */
    matchOrder(order) {
        switch (order.toLowerCase()) {
            case 'bl': return 'bl';
            case 'dp': return 'domainpop';
            case 'aby': return 'abirth';
            case 'sg': return 'searchesglobal';
            case 'co': return 'competition';
            case 'cpc': return 'acpc';
            case 'dropped': return 'changes';
            default: return 'bl';
        }
    }

    /**
     * @param orderMode
     * @returns {string}
     */
    matchOrderMode(orderMode) {
        switch (orderMode.toLowerCase()) {
            case 'asc': return 'a';
            case 'desc': return 'd';
            default: return 'a';
        }
    }

    /**
     * @param data
     * @returns {Array}
     */
    parseTable(data) {
        let result = [];
        for(let i=0; i<data.length; i++) {
            let domain = data[0][i].substr(0, data[2][i]) + '.' + this.config.tld;
            let condition = 'available' === data[20][i] &&
                (typeof this.config.time !== 'undefined' && (data[19][0].indexOf(this.capitalize(this.config.time)) !== -1));

            if(condition) {
                result.push({
                    domain: domain,
                    bl: this.parseBL(data[3][i]),
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

    /**
     * @param s
     * @returns {*|string}
     */
    capitalize(s) {
        return s && s[0].toUpperCase() + s.slice(1);
    }

    /**
     * @param bl
     * @returns {string}
     */
    parseBL(bl){
        return bl.substr(0, bl.indexOf(constants.BL_STRING));
    }
}

module.exports = HunterService;