#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import axios from 'axios';
import 'dotenv/config';

let amount;
let to;
let from;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    
    console.log(`\nConvertisseur de moula\nAuteur: Oscar Bréhier\nGithub: https://github.com/OscarBrehier\n`);
    await sleep();

}

async function checkAnswers() {

    const spinner = createSpinner('Vérification de la réponse...').start();
    await sleep();

    if(from !== to) {

        await convert(spinner);

    } else {

        spinner.error({
            text: `La devise de départ et la devise d'arrivée ne peuvent être les mêmes`
        });
        await askTo();

    }

}

async function askAmount() {

    const answers = await inquirer.prompt({
        name: "amount",
        type: "input",
        message: "Montant:",
        default() {
            return '1';
        },
    });

    amount = answers.amount;

}

async function askFrom() {

    const answers = await inquirer.prompt({
        name: "from",
        type: "list",
        message: `Choisissez la devise de départ\n`,
        choices: [
            "EUR - Euro",
            "USD - United-States Dollards",
            "TRY - Turkish Lira"
        ],
    });

    from = answers.from;

}

async function askTo() {

    const answers = await inquirer.prompt({
        name: "to",
        type: "list",
        message: "Choisissez la devise d'arrivée\n",
        choices: [
            "EUR - Euro",
            "USD - United-States Dollards",
            "TRY - Turkish Lira"
        ],
    });
    
    to = answers.to;
    return checkAnswers();

}

async function convert(spinner) {

    to = to.substring(0, 3);
    from = from.substring(0, 3);
    let text = (a) => `${amount} ${from} est égale à ${a} ${to}`; 

    const url = `https://freecurrencyapi.net/api/v2/latest?apikey=1776ff70-7596-11ec-a0f1-f7d071866177&base_currency=${from}`;
    axios.get(url)
        .then(async function(response) {

            switch(to) {

                case 'EUR':

                    text = text(response.data.data.EUR * amount);
                    break;

                case 'USD':

                    text = text(response.data.data.USD * amount);
                    break;

                case 'TRY':

                    text = text(response.data.data.TRY * amount);
                    break;

            }

            await spinner.success({ text: text })

        })
        .catch(function(err) { console.log(err); })

}

console.clear();
await welcome();
await askAmount();
await askFrom();
await askTo();