const inquirer = require('inquirer');
const fs = require('fs');
const Discord = require('dc-api');

/*
    Simple Mass Join / Leave Server Discord SelfBot
    Created by viloid ( github.com/vsec7 )
    Date : 14/03/2022
    NOTE : USE AT YOUR OWN RISK!
*/

inquirer.prompt([
	{
		type: "input",
		name: "list",
		message: "Token List File ?"
	},
	{
		type: "list",
		name: "opt",
		message: "Mode ?",
		choices: [ "Mass Join", "Mass Leave" ]
	},
	{
		type: "input",
		name: "link",
		message: "Invite Link ?",
		when: (a) => a.opt === "Mass Join"
	},
	{
		type: "input",
		name: "gid",
		message: "Server ID ?",
		when: (a) => a.opt === "Mass Leave"
	}
]).then( r => {
	
	if (!fs.existsSync(r.list)){
		throw new Error("Token List File: "+r.list+" Not Exist!");
	}
	let l = fs.readFileSync(r.list, 'utf-8').replace(/\r|\"/gi, '').split("\n")
	
	switch(r.opt) {
		case "Mass Join":
			l.forEach(t => {
				const bot = new Discord(t);

				bot.GetMe().then(m => {
					const me = m.username + '#' + m.discriminator
					const ic = r.link.split("/")[3]
					bot.JoinGuild(ic).then(res => {
						console.log("[Success] %s | Join %s (%s) | Inviter: %s", me, res.guild.name, res.guild.id, res.inviter.username + '#' + res.inviter.discriminator)
					}).catch(e => {
						console.log("[Failed] %s | %s ", me, ic)
					})
				}).catch(e => {
					console.log("[ErrorToken] %s", t)
				})
			})

			break;
		case "Mass Leave":
			l.forEach(t => {
				const bot = new Discord(t);

				bot.GetMe().then(m => {
					const me = m.username + '#' + m.discriminator
					bot.LeaveGuild(r.gid).then(res => {
						console.log("[Success] %s | Leave %s ", me, r.gid)
					}).catch(e => {
						console.log("[Failed] %s | %s", me, r.gid)
					})
				}).catch(e => {
					console.log("[ErrorToken] %s", t)
				})
			})
			break;
	}
})