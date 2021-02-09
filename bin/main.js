#!/usr/bin/env node

// by oran collins
// github.com/wisehackermonkey
// oranbusiness@gmail.com
// 20210209

const chalk = require('chalk'); //terminal coloring
const boxen = require('boxen'); //pretty command line boxes
const yargs = require('yargs'); //grabbing command line arguments
const _ = require("underscore");
const shellHistory = require('shell-history');
const clipboardy = require('clipboardy');
const { exec } = require('child_process');



const greeting = chalk.white.bold("Doc-history:")


// display a pretty command-line box
const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    backgroundColor: "#555555"
};
// setup command line arguments parser
// for example : doc-history -n 10 
//              :doc-history --help
const options = yargs
    .command("Useage: -n <number of lines in history>")
    .option("n", {
        alias: "number",
        describes: "number of lines in history",
        type: "number",
        demandOption: false
    })
    .argv;

if (options.number) {
    console.log(boxen(chalk.white.bold("Number of lines: TODO"), boxenOptions));
} else {
    // console.log(chalk.white.bold((shellHistory()).join("\n")));

    let shell_history = [];

    if (process.platfrom === "linux"){
        shell_history = shellHistory().filter((val, index, arr) => {
            // hack to fix issue with output of shell-history that showes times stamps every 2 items
            // so i filter them out of the results
            if (index % 2 === 0) { } else {
                return val;
            }
        })
        console.log(shell_history);
        console.log(format2markdown(shell_history))
    
        clipboardy.writeSync(format2markdown(shell_history));
    }

    if (process.platform === "win32") {
        exec('cat (Get-PSReadlineOption).HistorySavePath', { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
            // do whatever with stdout

            let shell_hist_windows = stdout.split("\r\n");
            spliced = shell_hist_windows.splice(shell_hist_windows.length - 10, shell_hist_windows.length);
        
            let result  = format2markdown(shell_history); 
            console.log(result)
        
            clipboardy.writeSync(format2markdown(shell_history));
        }
    }
    // remove duplicate commands from command history ex: 
    // ---------
    // ls
    // npm install bad_monkey
    // ls
    // ---------
    //becomes
    // ---------
    // ls
    // npm install bad_monkey
    // ---------



}

const help_string = `options: ${options?.number}!`;
const msgBox = boxen(greeting, boxenOptions);


// create a markdown formated string for the user to paste in to their github readme
function format2markdown(input) {
    let remove_duplicates = _.unique(input);


    let mardown_formated = `\`\`\`bash
${remove_duplicates.join("\n")}
\`\`\``
}
console.log(msgBox);
console.log(help_string);
console.log("Copied To Clip Board");