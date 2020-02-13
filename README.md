# homey-web-basic
Very basic and small Homey-web-app-implementation
Based on https://github.com/athombv/homey.ink

## Getting a Magic token
Credits to RobertKlep on community.athom.com: https://community.athom.com/t/homey-ink-an-e-ink-homey-dashboard/12367/8  
(Using Google Chrome):  
Go to https://homey.ink/  
Press f12 - developer tools should open  
Go to tab 'Console'  
On the web-page, scroll down to 'step 1 Log in with your Athom account.'  
Click on 'Log in' button  
Log in @ Homey  
Once you've logged in, the login-screen closes and you are back at the 'homey.ink' page  
Look in your Developer tools - console, you will see:  
`Web URL: https://app.homey.ink/?theme=web&token=eyJf[...]iIn0%3D`  
There is your magic token!

## Using the magic token

Make sure you are serving this html/project from a webserver.  
For example: http://localhost/
Replace 'https://app.homey.ink' from the web-url with the location of your project - in this example it will be  
`http://localhost/?theme=web&token=eyJf[...]iIn0%3D`  
An URL starting with `file://` will not work!!!

## Serving from localhost
If you don't know how to serve this from a webserver and/or on localhost, maybe developing a javascript app is not for you...  
But I will try to help you with the following steps (copy/paste and small modification from https://raw.githubusercontent.com/athombv/homey.ink/master/README.md )  

To run this locally (You have to have NPM installed locally and cloned this project locally):  
```
Open bash/cmd
npm i -g serve
Navigate in to the root of this project.
serve -p 5000 html
```
Then visit `http://localhost:5000/?token=<TOKEN>`.