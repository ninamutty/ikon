const inquirer = require('inquirer');
const runner = require('./runner');

inquirer
    .prompt([
        {
            name: 'mountain',
            message: 'What mountain do you to reserve?',
            default: 'Crystal Mountain Resort',
            choices: ['Crystal Mountain Resort', 'The Summit at Snoqualmie', 'Mt. Bachelor'],
        },
        {
            name: 'month',
            message: 'What month?',
            default: 'January',
            choices: ['January', 'February', 'March', 'April'],
        },
        {
            name: 'day',
            message: 'What day?',
            default: '1',
            choices: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
                '24',
                '25',
                '26',
                '27',
                '28',
                '29',
                '30',
                '31',
            ],
        },
        {
            name: 'email',
            message: 'What\'s your ikon account email?',
        },
        {
            name: 'password',
            message: 'What\'s your ikon account password?',
        },
    ])
    .then(answers => {
        console.log(answers, 'answers');
        runner(answers.email, answers.password, answers.mountain, answers.month, answers.day, '2021');
    })
    .catch(error => {
        if (error.isTtyError) {
            console.log("Couldn't ask the prompt!");
        } else {
            console.log('Something went wrong, please try again');
        }
    });
