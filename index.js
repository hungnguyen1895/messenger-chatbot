'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAACa81QAxMkBAJK398EVcV5ix296okdoh8lFbgWCga5jJdcySOLCylByKXAef622nxVOVMpK9p03FmB9KcqkvZCwU4Huxwpy3k9SyWP6uaIHSrhrzwmAlsMDds8ndbVH7YqLnmNqECSAPyGyPso0IZBrC0O1Th7170Ii2v7dZAy3UpY7Q51"

let jokes = [
	"I asked God for a bike, but I know God doesn't work that way. So I stole a bike and asked for forgiveness.",
	"I want to die peacefully in my sleep, like my grandfather.. Not screaming and yelling like the passengers in his car.",
	"Do not argue with an idiot. He will drag you down to his level and beat you with experience.",
	"The last thing I want to do is hurt you. But it's still on the list.",
	"If sex is a pain in the ass, then you're doing it wrong...",
	"The early bird might get the worm, but the second mouse gets the cheese.",
	"We live in a society where pizza gets to your house before the police.",
	"Having sex is like playing bridge. If you don't have a good partner, you'd better have a good hand.",
	"Some people are like Slinkies ... not really good for anything, but you can't help smiling when you see one tumble down the stairs.",
	"Politicians and diapers have one thing in common. They should both be changed regularly, and for the same reason.",
	"War does not determine who is right - only who is left.",
	"Women might be able to fake orgasms. But men can fake a whole relationship.",
	"We never really grow up, we only learn how to act in public.",
	"Men have two emotions: Hungry and Horny. If you see him without an erection, make him a sandwich.",
	"Light travels faster than sound. This is why some people appear bright until you hear them speak.",
	"My mother never saw the irony in calling me a son-of-a-bitch.",
	"I thought I wanted a career, turns out I just wanted paychecks.",
	"If you think nobody cares if you're alive, try missing a couple of payments.",
	"Sex is not the answer. Sex is the question. 'Yes' is the answer.",
	"Evening news is where they begin with 'Good evening', and then proceed to tell you why it isn't.",
	"I used to be indecisive. Now I'm not sure.",
	"I don't trust anything that bleeds for five days and doesn't die.",
	"If you keep your feet firmly on the ground, you'll have trouble putting on your pants.",	
	"To be sure of hitting the target, shoot first and call whatever you hit the target.",
	"You are such a good friend that if we were on a sinking ship together and there was only one life jacket... I'd miss you heaps and think of you often.",
	"Going to church doesn't make you a Christian any more than standing in a garage makes you a car.",
	"Change is inevitable, except from a vending machine.",
	"If you are supposed to learn from your mistakes, why do some people have more than one child.",
	"A bus is a vehicle that runs twice as fast when you are after it as when you are in it.",
	"Whoever coined the phrase 'Quiet as a mouse' has never stepped on one.",
	
	

]

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "hunghung") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	//req.body.entry is an array
	//and it will ever only have one message
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]

		//page scoped id : every person has unique psid for a page
		let sender = event.sender.id

		//check if the event contains text
		if (event.message && event.message.text) {
			let text = event.message.text
			
			decideMessage(sender, text)
		}

		if (event.postback) {
			//get message by postback event
			let text = JSON.stringify(event.postback)
			decideMessage(sender, text)
			continue
		}
	}
	//if everything went good, send "200"
	res.sendStatus(200)
})



function decideMessage(sender, text1) {
	//get random index from 0 to 29
	let index = Math.floor(Math.random()*30)
	let text = text1.toLowerCase()
	if (text.includes("yes")) {
		sendText(sender, jokes[index])
		sendButtonMessage(sender, "Ready to laugh ?")
	} else if (text.includes("no")) {
		sendText(sender, "Hmmm, please come back to hear more jokes")
	} else {
		sendText(sender, "I will make your day brighter by telling jokes.")
		sendButtonMessage(sender, "Ready to laugh ?")
	}

}



function sendButtonMessage(sender, text) {
	let messageData = {
		"attachment":{
	      "type":"template",
	      "payload":{
	        "template_type":"button",
	        "text":text,
	        "buttons":[
	          {
	            "type":"postback",
	            //"url":"https://www.messenger.com",
	            "title":"Yes",
	            "payload": "Yes",
	          },
	          {
	          	"type":"postback",
	          	"title":"No",
	          	"payload":"No",
	          }
	        ]
	      }
    	}	
	}
	sendRequest(sender, messageData)
}

function sendRequest(sender, messageData) {
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

function sendText(sender, text) {
	let messageData = {text: text}
	sendRequest(sender, messageData)
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})


