# 🤓 🤓 Hunter Expired Domains Finder

![Serpaso SERP Rank Checker](https://i.imgur.com/p6gBWBE.jpg)

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
 
 
And it will create the symbolic link to **/usr/local/bin**to can launch the binary globally. 

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
  ? Order mode [asc|desc] desc
  ? Filter by time [today|yesterday] today
``` 
![Interactive mode](https://i.imgur.com/8yP4wt7.jpg)

### CLI based arguments mode
``` bash
$ hunter --tld es --order cpc --orderMode desc --format json --time today
``` 
![Arguments mode](https://i.imgur.com/y3O469H.jpg)
![Arguments mode CSV output](https://i.imgur.com/94ABzAg.jpg)



The options specified in configuration file will be override by the arguments mode by default
#### Config file options
- **tld**: Specify the top level domain
- **order**: Order by one of these fields [bl,dp,aby,sg,co,cpc,dropped] 
- **orderMode**: Descending or Ascending ordenation mode
- **format**: Print results in json or csv format
- **time**: Get the dropped domains (today or yesterday)
