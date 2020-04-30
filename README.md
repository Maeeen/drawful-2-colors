_This has been updated to work with the lastest version (29/04/2020) !_

# Drawful 2 Cheat

* The default two colors of Drawful 2 are annoying ?
* You're an artist but you're limited to theses ?

## Features aka nice things

* Custom colors
* Custom thickness
* Clear the last line you've drawn
* ~~Better re-drawing of the canvas~~
* Ez win (if ur good)
* Don't say a thing about optimization etc... It's just a little script done in 10 minutes.

# How to..

## ..inject ?

To inject the script, before joining the game (= in the jackbox.tv main menu):
* open Developer Tools with F12 or CTRL+SHIFT+I
* go to Console
* paste the content of `cheat.user.js` inside the console
* press enter
* join the game

## ..use it as a userscript ?

To don't open the console every time you want to play, you can use the [TamperMonkey extension](https://www.tampermonkey.net/) and install the cheat.user.js script as an userscript !
(open cheat.user.js and click `Raw`, or [open this](https://raw.githubusercontent.com/Maeeen/drawful-2-colors/master/cheat.user.js)

## ..win ?

-> Win !

# How does it work ?

It works by hooking various functions, but for those who doesn't know :

## What is a hook ?

Simply, a way to intercept data in a code environment. Let's say a function `foo(argument)` is called, and we want to get the content of `argument`. We can do this :

```js
// we save the original function somewhere...
let oldFoo = foo
// because we are rewriting it !
foo = function (argument) {
  // we stole `argument` by rewriting the function
  // and we call again back the function to make it seem like nothing has happened
  // we can edit `argument` or not even call back the function
  oldFoo.apply(this, arguments) // we don't forget the context `this` and we pass ALL arguments
}
```

The “hook” term comes from the low-level programming stuff, used a lot (see detours or minhook libs in C++ for curious ones)

## `webpackJsonp` hooking

The first goal of this script is to hook the object responsible for drawing and storing lines (that are going to be sent later to the server). To achieve this complicated task, first, the `webpackJson#push` method is hooked. It's responsible for importing new modules (see Webpack for more details about how modules works, if you are familiar with NodeJS modules, it's the same thing but for the browser basically).

When you join a Drawful 2 room, it will load the module for the game (because Jackbox have a ton of games).

By hooking the `webpackJson#push` method, we can modify any imported module, more importantly the game module (not the login module for example.)

## Hooking the module

Once we detect the Drawful 2 module (see line 26 of `cheat.user.js` and how Webpack stores modules in .js files; the wanted module having the id 44), we modify it using the `drawful2appExport` function. We hook (again) an important function of the module, because it's pretty apparent that this is the whole app. We see that an `f` object is created then returned, from a weird `n(410).a.extend`. What do we do ? We hook it (again.....). And we notice that this `f` object is the game !

The functions in the `f` object are called, but the `currentCanvas` property isn't updated ! It means that the `f` object is used as a mold for the "real" object, using it as a prototype. We notice also that the `f` methods are called with a different `this` context. What do we do ? You guessed it : we hook it again...... (this is really repetitive..) : we hook any method from the object, I decided to hook `startDrawingInterface` (because seems logical for a cheat that is supposed to modify the drawing interface by adding more options).

And then, we finally have the final object containing the app, and also `currentCanvas`, the object storing the drawing and preferences (color, thickness, ...).

We can also trigger a lot of other methods (or hook them), but I'm a bit lazy and I did it because someone asked me by mail !

Anything else is just purely & merely logic of JS and its DOM APIs.

## How was the older version working ?

The older version was working merely the same but by hooking console.log and Function.prototype.apply too, and using an ugly setInterval function.

I'm ashamed of my code (that I wrote 2 years ago when my JS knowledge was not at its best)

So I preferred rewriting it, except for the re-drawing of the canvas when the last line is removed !

## You could modify the `data-color` attributes of the buttons

I noticed this, only when finishing the code... Let's say that this one permits thickness and clearing the last line too, and this is why it is so useful ?
