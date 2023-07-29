# tampermonkey script ChatGPT_OCM

A PoC to add a Button to the BRZ 365 OCM module.
On click the text in the field "Langtext 1" is read out and send to the ChatGPT API as part of a prompt.
The response - a Longtext position description in german - is added back into the field.

## tampermonkey

Is a popular Add-on to most browsers, which allows to modify Webpages by running custom scripts on the DOM.

see: https://www.tampermonkey.net/

## BRZ 365 ERP

Is a cloud based ERP system targeting the cosntruction business market.

see: https://www.brz.eu/

### OCM Module

The offer and contract management module provides the possibility to create a "Leistungsverzeichnis (LV)" with short and long texts, where this script is helping to create these long texts based on a short description.

## ChatGPT

The API is used to create the long text description.
You need to add your own API secret to the script.
Cost per request (using the GPT-3.5 Turbo model) ~0,2 Eurocent.

see: https://openai.com/pricing
see: https://platform.openai.com/
