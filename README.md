# File Protocol Templating Engine

A simple templating engine, build for serving SPAs via the file protocol.

Event though it has quite some features, it is by far not comparable with Angular, React, VUE, Handlebars etc. The FPTE is meant for those niche cases, where you really got no chance of serving your app via some kind of webserver and therefore are limited to what you can do.

## Why would you use it?

Isn't the whole point of web apps to be served from a server? It is! But there still are cases where this simply isn't possible or wanted. The reasons for that can vary quite a lot. From not wanting to invest the money, over not having the infrastructure to private use.

If your app is can be stored locally, then it probably doesn't matter too much, if for every page or component you need to reload the whole page. However if it saved on a network drive, things might take a while. Another reason would be, if you want to avoid writing duplicate code or having to update lots of files, in case of a change.

## Status

Stage: Released

Latest Stable Version: 1.0.0.0

## Dependencies to other Devices, Server, Programs, Components

None

## Getting started

### Installation

To install the FPTE, simply download the fpte.js file. Then place it in your project and link to it in your index.html (or whatever starting point you are using). Create a main.js, that will serve as your starting point for the scripts, then add it to your HTML file beneath the FPTE. Be sure to add the defer keyword.

### Preparation

In order to use the engine, you need to make some minimum configurations. As this tool has the ability to dynamically add JavaScript files, you don't need to add all files to your HTML file.

1. In main.js, at the very first line, create a configuration variable.

>     const appConfig = {
>     sources:[]
>     };
>
> You could also make a sperate file, that holds this variable. Just make sure it is loaded first

2. Create a new instance of the File Protocol Templating Enginge and pass the configuration, like so

> const FPTE = new FPTemplatingEngine(appConfig);

3. Now you can add the relative file paths to your templates, to the sources array. The engine will take care of the rest.

### Adding a Page or component

It is recommended, that you store your pages and components in separate folders. Every page and component need at the very least a template. These templates can be stored as a string literal or a function, that return a string. In any case it should always be a string with valid HTML code. Pages can also have titles, that update the window title.

For managing all templates, you can either do it all in the configuration or do everything in the corresponding file. We will focus on the later. I will assume that you have already figured out a folder structure for your project.

#### Steps with a Page as an example

1. Create a new file and give it a name.
2. Add the relative file path to the configuration file
   Example:

>     const appConfig = {
>     sources:[
>     'pages/page1.template.html'
>     ]
>     };
>
> 3. Open the template file and declare a variable or function, that contains your actual template.
> 4. Declare a variable, that holds your page data. This must be an object, with at least the template key.
>    Example:
>    const pageData = { title: 'Page 1', template: page1, };
> 5. Register the page by calling the register method on your FTPE instance. This will be executed automatically, once the file is loaded.
>    Example:
>    FPTE.register('pageOne', pageData, 'page');
>
> The first argument is the key, by which this template will be identified, the second one holds the actual data and the third determines the type.

### Using a template

There are three ways to use a template: Injecting it as child of a div, using an outlet or replacing it by its key.

#### Injecting

To inject a page or component use the corresponding attribute, where the value must be identical to the key.
Example:

> \<div inject-component="header"></div>

This will inject the header component into the div

### Using outlets

To defined an outlet, first create a normal div, then use the inject-outlet attribute and give it a name. Your main outlet should be named "main-content", to register it as the main outlet.
Example:

> \<div inject-outlet="main-content" default-page="home"></div>

By using the default-page attribute, this outlet will load the home page upon first loading.

### Replacing by key

If you don't want to create an additional div, you can also just put the key in two curly parenthesis.
Example:

> {{pageOne}}

This will be replaced with the page one.

## About Configuration Options

The following things can be configured:

| Field          | Description                                                                                                                            | Type     | Default Value     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| openingTag     | The combination, that signifies the opening of an interpolation string                                                                 | string   | '{{'              |
| closingTag     | The combination, that signifies the ending of an interpolation string                                                                  | string   | '}}'              |
| replacingRegex | A function that returns a regex, that checks for interpolation strings. Setting this value will ignore the opening and closing tags    | function | build dynamically |
| autoInit       | Whether or not the Engine should start replacing automatically. Setting this to false will require you to call .init() manually        | boolean  | true              |
| awaitSources   | Determines if .init() will be called right away or will await all sources to have loaded. If autoInit is set to false, this is ignored | boolean  | true              |
| mainOutlet     | The name of the main outlet                                                                                                            | string   | 'main-content'    |

## About Pages

The following things can be configured:

| Field        | Description                                                                                                                                                                                            | Type               | Default Value |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ------------- |
| template     | A string representation of the HTML code or a function that returns a string                                                                                                                           | string \| function | null          |
| title        | A title that can be used for replacing the window title                                                                                                                                                | string             | null          |
| injectMethod | The way that this template will be added when injecting it. Can be 'replace' or 'append'                                                                                                               | string             | 'replace'     |
| functionType | Only if template is a function and needs arguments: Tells the engine if those are bound using .bind() or if they are added in the template. Can be 'function', 'function-bound' or 'function-template' | string             | null          |

## About Components

The following things can be configured:

| Field        | Description                                                                                                                                                                                            | Type               | Default Value |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ------------- |
| template     | A string representation of the HTML code or a function that returns a string                                                                                                                           | string \| function | null          |
| injectMethod | The way that this template will be added when injecting it. Can be 'replace' or 'append'                                                                                                               | string             | 'replace'     |
| functionType | Only if template is a function and needs arguments: Tells the engine if those are bound using .bind() or if they are added in the template. Can be 'function', 'function-bound' or 'function-template' | string             | null          |

## Template Functions with parameters

Functions that depend on parameters to return the correct template can receive them in multiple ways.

1. Use the loadPage method
2. Use the loadToOutlet method
3. Add them separated by = when using interpolation

When adding parameters in a template, they must be written an stringyfied JSON object, as they are parsed as JSON (e.g. {{listComponent=[["List Item 1","List Item 2","List Item 3"]]}}).

## Notes

To trigger the loading of a page, you will still need to call the load methods on your running instance. Check out the examples to see how everything works.

## License

[License Name with link]()
