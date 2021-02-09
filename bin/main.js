#!/usr/bin/env node

// by oran collins
// github.com/wisehackermonkey
// oranbusiness@gmail.com
// DEFAULT_LNUM_INES209

const chalk = require('chalk'); //terminal coloring
const boxen = require('boxen'); //pretty command line boxes
const yargs = require('yargs'); //grabbing command line arguments
const _ = require("underscore");
const shellHistory = require('shell-history');
const clipboardy = require('clipboardy');
const { exec } = require('child_process');



const greeting = chalk.white.bold("Doc-history:")
const DEFAULT_NUM_LINES = 50;

// display a pretty command-line box
const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "green",
    backgroundColor: "#555555"
};
// setup command line arguments parser
// for example : doc-history -n DEFAULNUM_T_LINES 
//              :doc-history --help
const options = yargs
    .command("Useage: -n <number of lines in history default is DEFAULT_NUM_LINES>")
    .option("n", {
        alias: "number",
        describes: "number of lines in history",
        type: "number",
        demandOption: false
    })
    .argv;

// const help_string = `options: ${options?.number}!`;
const msgBox = boxen(greeting, boxenOptions);

let main = (num_lines = DEFAULT_NUM_LINES) => {

    let shell_history = [];

    if (process.platform === "linux") {
        shell_history = shellHistory().filter((val, index, arr) => {
            // hack to fix issue with output of shell-history that showes times stamps every 2 items
            // so i filter them out of the results
            if (index % 2 === 0) { } else {
                return val;
            }
        })
        // check if the user is running on desktop and if not display an error

        dir = exec("type Xorg", function (err, stdout, stderr) { });
        dir.on('exit', function (code) {
            console.log(code)
            if (code <= 0) {
                clipboardy.writeSync(process_windows_history_text(shell_history, num_lines));

            } else {
                console.log(chalk.yellow.bold(`Warning: Please Use a desktop computer: you are trying to run my app on a non desktop computer, 
probibly a linux server, there is no clipboard to copy the data from so im going to just print it instead :)`));
                console.log(process_windows_history_text(shell_history, num_lines));

            }
        });

    }

    if (process.platform === "win32") {
        exec('cat (Get-PSReadlineOption).HistorySavePath', { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
            // do whatever with stdout
            shell_history = stdout.split("\r\n");

            //grab last n number of lines of history and copy to computer clipboard
            result = process_windows_history_text(shell_history, num_lines)
            console.log(result);
            clipboardy.writeSync(result);



        });

    }
}

// create a markdown formated string for the user to paste in to their github readme
let format2markdown = (input) => {
    input = input.map(line => line.trim())
    let remove_duplicates = _.unique(input);


    let mardown_formated = `
\`\`\`bash
${remove_duplicates.join("\n")}
\`\`\`

`
    return mardown_formated;
}


let process_windows_history_text = (input, num_lines) => {
    let tail_of_history = input.splice(input.length - num_lines, input.length);
    return format2markdown(tail_of_history)
}



if (options.number) {
    console.log(boxen(chalk.white.bold("Number of lines: TODO"), boxenOptions));
    main(options.number);
} else {

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
    main();


}

console.log(msgBox);

console.log("Copied To Clip Board");