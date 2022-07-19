# Depoly instructions

After loggin in through SSH create the user `bot` with the command 
`useradd -m bot` and make it use your favourite shell `usermod --shell /bin/bash bot`

Then install `git` with `apt-get install git`

Change to user bot `su - bot`

Download and install nvm
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

Install the latest version of node `nvm install node` and activate it `nvm use node`

Install pm2 `npm install pm2@latest -g`

Clone the bot from git `git clone https://github.com/barba-anto/NodeBot.git node-bot`

Move into the bot folder `cd node-bot` and install the required packages `npm i`

Start the bot `pm2 start index.js` and setup the start ad boot `pm2 startup`

Copy the command that `pm2 startup` will output and run it as root

Done

