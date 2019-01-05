

# Byteball-RDF-Admin-Bot

This bot follows the [Byteball multilingual bot](https://github.com/n-ric-v/Byteball-RDF-Multilingual-Bot) implementation based on the RDF standard. It adds some interesting features to explore RDF possibilities through an administrative interface. 

## What's new since the Byteball multilingual bot ?

- A minimal administrative set of commands with restricted access
  - Reload RDF file without shutdown the bot
  - Send a message to all users
  - Get statistics
    - Memory usage
    - Total users
    - Total users by languages

## What else ?

As previously :

- [Valid RDF](https://www.w3.org/RDF/Validator/rdfval?URI=https%3A%2F%2Fraw.githubusercontent.com%2Fn-ric-v%2FByteball-RDF-Multilingual-Bot%2Fmaster%2Frdf%2Fbotmessages&PARSE=Parse+URI%3A+&TRIPLES_AND_GRAPH=PRINT_BOTH&FORMAT=PNG_EMBED) bot messages file.
- Basic human-bot interactions.
- Bot sentences in English and French with unicode emojis.
- Backup and reload the language interface preference of users, inclusively administrator with the Byteball database module
- Purely descriptive RDF
- Support of formatted parametric strings with the NodeJS module "util"

## Why this multilingual RDF implementation with an administrative interface

The [RDF standard](https://en.wikipedia.org/wiki/Resource_Description_Framework) offers astonishing possibilities for «smart agents» or autonomous programs ([agent](https://en.wikipedia.org/wiki/Software_agent)). For instance, RDF allows us to feed in continue a bot with data without shutdown it. This basic administrative interface allows us to reload the RDF file after modifying it with any text editor. 

In order to demonstrate this possibility, a descriptive ressource has been included at the end of the RDF file to allow us to write a message in multiple languages. Once the RDF file reloaded from the administrative interface, we can send it to all users. Obviously, you can modify any descriptive resource and reload the RDF file any time you wish. Very useful to correct a misspelling for instance.

As previously, the [Javascript RDF library](https://www.npmjs.com/package/rdflib) for browsers and Node.js is used. It's actively maintained by the [LinkedData team](https://github.com/linkeddata/rdflib.js), [Tim Berner-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee) and other contributors. Unfortunately, this library is still under development and many RDF promises aren't yet kept.

We can sincerly regret that [SparQL](https://en.wikipedia.org/wiki/SPARQL) queries are limited. For, instance FILTERS doesn't work and force us to post-process language selection of resources manualy. There are many javascript SparQL libraries but none of them respect fully the standard whatever their promises. The most advance and most credible implementation of this W3C standard is the RDFLib.JS backed by the LinkedData team and Time Berner-Lee.

[RDF FAQ](https://www.w3.org/RDF/FAQ.html)

## Dependencies

- [rdflib.js](https://www.npmjs.com/package/rdflib)
- [util](https://www.npmjs.com/package/util)

## Install

First, download and install the [Byteball wallet](https://byteball.org/#download).

Then, install all dependencies you may need to generate the js file should be installed automatically with this command.

```bash
$ npm install
```

But you can install them separately.

Install rdflib.js module

```bash
$ npm install rdflib
```

Install "util" module

```bash
$ npm install util
```

## Configure the bot to have access to the administrative interface

If you want to have access to the administrative interface, you have to define temporary environment variables before to start the bot for the first time. If you don't set these environment variables, you'll have access only to the known interactions since the first RDF multilingual implentation. 

Obviously, if you forget to set these variables, you can yet modify the "paired_device_configuration" table into the SQLite database related to the bot.

Type this command line when running the bot for the first time :

```bash
ADMIN_DEVICE_ADDRESS=YOURADMINDEVICEADDRESS ADMIN_DEVICE_LANGUAGE=en nodejs rdfadminbot.js
```
- ADMIN_DEVICE_ADDRESS is your device address. To find this address, open your Byteball wallet and go to the menu > settings > device address
- ADMIN_DEVICE_LANGUAGE is your initial language interface language. You can change it any time from the menu. 

Currently, only one administrator device is allowed and only 2 languages are implemented : french (fr) and english (en). In the example above, we set the user interface in english. Only IETF BCP 47 language identifiers are valid with RDF, so respect standards.
 
## Send a message to all users and reload RDF File

#### [rdf/botmessages](https://github.com/n-ric-v/Byteball-Admin-RDF-Multilingual-Bot/blob/master/rdf/botmessages)

Right now, the bot warns users about a maintenance mode period in its "messageToAll" descriptive resource. You can modify it as you wish. In order to define a new message (you can do it with the bot running), open the 'botmessages' file from the rdf folder and go to the end of file. You should see this descriptive resource below :

```xml
<rdf:Description rdf:ID="messageToAll">
	<rdfs:label xml:lang="en">» Message to all «
I will go into maintenance mode in 15 minutes. I will not answer your requests for an indefinite period of time.

Finish what you do quickly.

I will inform you as soon as I am operational again.

Thank you for the understanding and sorry for this inconvenience.
</rdfs:label>
	<rdfs:label xml:lang="fr">» Message à tous «
Je vais passer en mode maintenance dans 15 minutes. Je ne répondrai pas à vos demandes pour une durée indéterminée.

Terminez ce que vous faites rapidement.

Je vous informerai dès que je serai de nouveau opérationnel.

Merci pour votre compréhension et désolé pour ce désagrément.
</rdfs:label>
</rdf:Description>
```

Once modified, press the "Open administration menu" then "Reload the RDF file" option and confirm that you want to reload the RDF file. Once the file reloaded, press the "Send message to all" and confirm it. The bot will inform you once its task realised.

## I want more

Well, if it's not enough. I recommend you to read the [Byteball developer resources](https://developer.byteball.org/) and to explore [Byteball Github repository](https://github.com/byteball/). There are a lot of bots implementation's examples. You can obviously read the [Byteball white paper](https://byteball.org/Byteball.pdf) and visit the [Byteball website](https://byteball.org).

You can also read (maybe again) my first bot example. The Byteball RDF Multilingual Bot README.md file will teach how to add a new language, add a new phrase or how to format a parametric string. 


## LICENSE
MIT

