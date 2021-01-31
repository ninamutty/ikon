# Ikon Reservations
In order to never miss a pow day (the travesty!), I built this tool to help reserve ski days through the [ikon pass website](https://www.ikonpass.com/) - especially when those coveted pow days happen to booked full..


## How it Works
When you start the tool, it'll prompt you for some basic information, including your email and password (this data won't be saved) and your desired mountain and date to reserve. Then it will start running in the background, logging in to your ikon pass and checking for availability every 5 minutes until it either successfully reserves your day or exhausts attempts (there's a default max of 60 retries).



## Limitations
This project is still a work in progress! As such, there are a few limitations that you should be aware of before using it..

* The mountain you wish to reserve needs to be in your list of favorite mountains
* You may only reserve one day at a time
* Use the default input values when able, we don't support custom values today



## Setup
### Prereqs
* Open the terminal app on your computer (run the below commands in terminal)
* Install node via [download](https://nodejs.org/en/download/) or on mac running `brew install node` in your terminal
  * Verify node is installed by running `node -v`
  * Verify npm is installed by running `npm -v`
* Install Git - [see detailed instructions here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) by device
* Clone this repository: `git clone https://github.com/ninamutty/ikon.git`
* Enter the project folder: `cd ikon`
* Install dependencies: `npm ci`
* You're ready to go! Pick a date to reserve and run the tool!


### Running the Tool
* In your terminal, while in the project directory, run `node ./reserve.js`
* Answer the prompts 
* The tool update you on it's status in the terminal as it runs



## Want to Contribute?
I'm open to help and suggestions to make this tool better! Submit a PR or email me at ninamutty@gmail.com to help out

### Future Plans
* Multi-day select
* Search for a mountain
* More mountain support
