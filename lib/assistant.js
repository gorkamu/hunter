'use strict';

const constants = require('../lib/constants');

class Assistant {

    setConfig(config = {}) {
        this.config = config;
    }

    /**
     * @param ms
     * @returns {Promise<any>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    /**
     * @returns {string}
     */
    getOrder() {
        let order = '';

        if(typeof this.config.order !== 'undefined') {
            order = `?o=${this.matchOrder(this.config.order)}&r=d`;
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
}

module.exports = Assistant;