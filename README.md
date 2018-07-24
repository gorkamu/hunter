# 🤓 🤓 Hunter Expired Domains Finder

![Hunter Expired Domains Finder ](https://i.imgur.com/QFHEk5X.png)

A node cli program to check the latest dropped domains of expireddomains.net



## How to install it
You'll need the last version of node and NPM first. 
Then you can execute the install bash script:
``` bash
$ sudo chmod 775 install.sh 
$ ./install.sh
``` 

This bash script will install the following depedencies:
 - "cheerio": "^1.0.0-rc.2",
 - "cheerio-tableparser": "^1.0.1",
 - "cli-table": "^0.3.1",
 - "colors": "^1.3.0",
 - "commander": "^2.16.0",
 - "inquirer": "^6.0.0",
 - "request": "^2.87.0",
 - "yarn": "^1.7.0"
     
Dev dependencies:
 - nodemon: "^1.17.5"
 - chai: "^3.5.0"
 - mocha: "*"
 
 
And it will create the symbolic link to **/usr/local/bin** to be able to launch the binary globally. 

After that, you can use the program like this
``` bash
$ hunter
``` 

## Execution modes
### Interactive mode with user
``` bash
$ hunter
  ? Enter TLD: es
  ? Order by [bl|dp|aby|sg|co|cpc|dropped] cpc
``` 
![Interactive mode](https://i.imgur.com/85CEZoi.png)

### CLI based arguments mode
``` bash
$ hunter --tld es --order cpc --format csv
``` 
![Arguments mode](https://i.imgur.com/HgW9tG3.png)

##### Arguments for this mode
- **tld**: Specify the top level domain (es, com, de...)
- **order**: Order by one of these fields [bl,dp,aby,sg,co,cpc,dropped] 
- **format**: Print results in json or csv format

The options specified in configuration file will be override by the arguments mode by default
#### Config file options
You should put in the config file (conf/config.js) the user and pass of your expireddomains account
It should looks like this
``` bash
module.exports = {
    USER: 'user',
    PASS: 'user_pass',
    MAX_RESULTS: 15,
    SHOW_LOG: false
}
``` 