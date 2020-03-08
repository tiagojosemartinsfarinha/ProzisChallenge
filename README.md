# Prozis Challenge - Bounce Ball

A simple screen where are possible create balls. A nice lock screen.

## Description
At every click, a ball its created at click position. The ball has random colour, size and direction.
Click at "P" key will trigger a event that change movement type for the defined (at this version, some rule its wrong and the ball disappear). The default movement type its the simple ball movement. 
Click at "Delete" key will delete all balls. 

We decided to bound max/min velocity to be visible and don´t be messy. 

## Getting Started

### Sources
* "Challenge" folder have all sourceCode project
* "tsconfig" have all ts configuration include files paths.  
* "./src/" directory have all code sources. 

### Compilation

* Due to ts compilation problems, JS´s was generated outside of this project.
* Any modifications at TS´s files need to be generated ouside

### Executing program

* Click at shortcut "ProzisChallenge" to initialize the environment. 


## Who its works? 

This simple screen its loaded from HTML. 
HTML its loaded and after loads all scripts using requirejs. 
All of dynamic process start at initialize of "index.ts" where its load all main events and objects. 

## Authors

Tiago Farinha
