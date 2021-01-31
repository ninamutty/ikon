const inquirer = require("inquirer");
const runner = require("./runner");

inquirer
  .prompt([
    {
      name: "email",
      message: "What's your ikon account email?",
      default: "",
    },
    {
      name: "password",
      message: "What's your ikon account password?",
      default: "",
    },
    {
      name: "mountain",
      message:
        "What mountain do you to reserve? (Note - please make sure you have it starred as a favorite!)",
      default: "Crystal Mountain Resort",
      choices: [
        "Crystal Mountain Resort",
        "The Summit at Snoqualmie",
        "Mt. Bachelor",
      ],
    },
    {
      name: "month",
      message: "What month?",
      default: "January",
      choices: ["January", "February", "March", "April", "May"],
    },
    {
      name: "day",
      message: "What day?",
      default: "1",
      choices: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ],
    },
    {
      name: "buddy",
      message: "Are you bringing a friend? (yes or no)",
      default: "no",
      choices: ["yes", "no"],
    },
    {
      name: "retries",
      message: "Max retries?",
      default: "60",
    },
    {
        name: "background",
        message: "Run in background? (You won't be able to see the website)",
        default: "yes",
      },
  ])
  .then((answers) => {
    const logInInfo = {
      email: answers.email,
      password: answers.password,
    };

    const date = {
      month: answers.month,
      day: answers.day,
      year: "2021",
    };

    const headless = answers.background === 'yes';

    const parsed = parseInt(answers.retries);
    const retries = (isNaN(parsed)) ? 60 : parsed;

    runner(logInInfo, answers.mountain, date, answers.buddy, retries, headless);
  })
  .catch((error) => {
    console.log(error);
    if (error.isTtyError) {
      console.log("Couldn't ask the prompt!");
    } else {
      console.log("Something went wrong, please try again");
    }
  });
