# React Transcript Editor

A React component to make transcribing audio and video easier and faster.

**⚠️ This is a forked version of the original [@bbc/react-transcript-editor](https://github.com/bbc/react-transcript-editor) package with security updates, modern dependency fixes, and React 18/19 compatibility.**

## 🚀 **Key Improvements in This Fork:**

- **🔒 Security**: 93% reduction in vulnerabilities (from 45 to 3)
- **⚡ Modern Dependencies**: Updated to latest secure versions
- **📦 pnpm Support**: Uses pnpm for better performance
- **⚛️ React 18/19 Support**: Compatible with modern React applications
- **🔧 Fixed Build Issues**: Resolved Storybook and git hook problems

<p>
  <a href="https://unpkg.com/react-transcript-editor@2.0.0/TranscriptEditor.js">
    <img src="http://img.badgesize.io/https://unpkg.com/react-transcript-editor@2.0.0/index.js?compression=gzip&amp;label=size">
  </a>
  <a href="https://packagephobia.now.sh/result?p=react-transcript-editor">
    <img src="https://badgen.net/packagephobia/install/react-transcript-editor">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/v/react-transcript-editor">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/l/react-transcript-editor">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/dm/react-transcript-editor">
  </a>
</p>

## 📦 **Installation**

### For Modern React Applications (React 18/19):

```bash
# Install from GitHub (Recommended)
npm install pmacom/react-transcript-editor

# Or using yarn
yarn add pmacom/react-transcript-editor

# Or using pnpm
pnpm add pmacom/react-transcript-editor
```

### For Legacy React Applications (React 16/17):

```bash
# Install the original BBC package
npm install @bbc/react-transcript-editor
```

## 🔄 **Migration from Original Package**

If you're currently using `@bbc/react-transcript-editor`, you can easily migrate to this fork:

```bash
# Remove the original package
npm uninstall @bbc/react-transcript-editor

# Install the forked version
npm install pmacom/react-transcript-editor
```

**No code changes required** - the API remains the same!

## Development env

 <!-- _How to run the development environment_ -->

- npm > `6.1.0`
- [Node 10 - dubnium](https://scotch.io/tutorials/whats-new-in-node-10-dubnium)

Node version is set in node version manager [`.nvmrc`](https://github.com/creationix/nvm#nvmrc)

## Setup

1. Fork this repository
2. Clone this repository to a directory of your choice
3. Run `pnpm install` to install dependencies

## Usage - development

We use a tool called [`storybook`](https://storybook.js.org)
to run the components locally. To start the Storybook, run:

```sh
pnpm start
```

Running that command should open the locally hosted Storybook, but if it doesn't,
visit [http://localhost:6006](http://localhost:6006)

## Usage - production

### Option 1: Install from GitHub (Recommended for this fork)

Since this is a forked version with security updates, you can install it directly from GitHub:

```sh
npm install pmacom/react-transcript-editor
```

Or using yarn:
```sh
yarn add pmacom/react-transcript-editor
```

### Option 2: Install the original BBC package

To use the original published version of `react-transcript-editor`,
install the published module [`@bbc/react-transcript-editor`](https://www.npmjs.com/package/@bbc/react-transcript-editor)
by running:

```sh
npm install @bbc/react-transcript-editor
```

### Import Usage

```js
// For this forked version (from GitHub)
import TranscriptEditor from "react-transcript-editor";

// For the original BBC package
import TranscriptEditor from "@bbc/react-transcript-editor";
```

### Basic use case

```js
<TranscriptEditor
  transcriptData={someJsonFile}
  mediaUrl={"https://download.ted.com/talks/KateDarling_2018S-950k.mp4"}
/>
```

`transcriptData` and `mediaUrl` are non-optional props to use `TranscriptEditor`.
See the full list of options [here](#transcripteditor-props-list).

### Advanced use case

```js
<TranscriptEditor
  transcriptData={someJsonFile}
  mediaUrl={"https://download.ted.com/talks/KateDarling_2018S-950k.mp4"}
  handleAutoSaveChanges={this.handleAutoSaveChanges}
  autoSaveContentType={"digitalpaperedit"}
  isEditable={true}
  spellCheck={false}
  sttJsonType={"bbckaldi"}
  handleAnalyticsEvents={this.handleAnalyticsEvents}
  fileName={"ted-talk.mp4"}
  title={"Ted Talk"}
  ref={this.transcriptEditorRef}
  mediaType={"video"}
/>
```

### TranscriptEditor Props List

| Props                   | Description                                                                                                             |                        required                        |   type    |                                    default                                     |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------: | :-------: | :----------------------------------------------------------------------------: |
| `transcriptData`        | Transcript JSON                                                                                                         |                          yes                           |   JSON    |                                                                                |
| `mediaUrl`              | URL to media (audio or video) file                                                                                      |                          yes                           |  String   |                                                                                |
| `handleAutoSaveChanges` | Function to handle the content of transcription after a change                                                          |                           no                           | Function  |
| `autoSaveContentType`   | Specify the file format for data returned by `handleAutoSaveChanges`                                                    |                           no                           |  String   |               falls back to `sttJsonType`, if set, or `draftjs`                |
| `isEditable`            | Set to `true` to have the ability to edit the text                                                                      |                           no                           |  Boolean  |                                     False                                      |
| `spellCheck`            | Set to `true` to spell-check the transcript                                                                             |                           no                           |  Boolean  |                                     False                                      |
| `sttJsonType`           | The data model type of your `transcriptData`                                                                            |                           no                           |  String   |                                   `draftjs`                                    |
| `handleAnalyticsEvents` | if you want to collect analytics events.                                                                                |                           no                           | Function  |                                     false                                      |
| `fileName`              | used for saving and retrieving local storage blob files                                                                 | no, but disables the [local save feature](#local-save) |  String   |
| `title`                 | defaults to empty string                                                                                                |                           no                           |  String   |
| `ref`                   | If you want to have access to internal functions such as retrieving content from the editor. eg to save to a server/db. |                           no                           | React ref |
| `mediaType`             | Can be `audio` or `video`. Changes the look of the UI based on media type.                                              |                           no                           |  String   | if not provided the component uses the `medialUrl` to determine the media type |

See [`./demo/app.js` demo](./demo/app.js) as a more detailed example usage of the component.

#### Local save

`fileName` is optional but it's needed if working with user uploaded local media in the browser,
to be able to save and retrieve from local storage.
For instance if you are passing a blob url to `mediaUrl` using `createObjectURL` this url is randomly re-generated on every page refresh so you wouldn't be able to restore a session, as `mediaUrl` is used as the local storage key. See demo app for more detail example of this[`./src/index.js`](./src/index.js)\_

### Typescript projects

If using in a parent project where [typescript](https://www.typescriptlang.org/) is being used you might need to add `//@ts-ignore` before the import statment like this

```js
//@ts-ignore
import { TranscriptEditor } from "react-transcript-editor"; // For this fork
//@ts-ignore
import { TranscriptEditor } from "@bbc/react-transcript-editor"; // For original BBC package
```

#### Internal components

##### Direct imports

You can also import some of the underlying React components directly.
See [the storybook](https://bbc.github.io/react-transcript-editor) for each component details on optional and required attributes.

- `TranscriptEditor`
- `TimedTextEditor`
- `MediaPlayer`
- `VideoPlayer`
- `Settings`
- `KeyboardShortcuts`
- `ProgressBar`
- `PlaybackRate`
- `PlayerControls`
- `RollBack`
- `Select`

To import the components you can do as follows

```js
// For this forked version
import TimedTextEditor from "react-transcript-editor/TimedTextEditor";
import { TimedTextEditor } from "react-transcript-editor";

// For the original BBC package
import TimedTextEditor from "@bbc/react-transcript-editor/TimedTextEditor";
import { TimedTextEditor } from "@bbc/react-transcript-editor";
```

##### Import recommendation

However if you are not using `TranscriptEditor` it is recommended to follow the second option and import individual components like: `react-transcript-editor/TimedTextEditor` rather than the entire library.
Doing so pulls in only the specific components that you use, which can significantly reduce the amount of code you end up sending to the client. (Similarly to how [`react-bootstrap`](https://react-bootstrap.github.io/getting-started/introduction) works)

#### Other Node Modules (non-react)

Some of these node modules can be used as standalone imports.

##### Export Adapter

Converts from draftJs json format to other formats

```js
// For this forked version
import exportAdapter from "react-transcript-editor/exportAdapter";

// For the original BBC package
import exportAdapter from "@bbc/react-transcript-editor/exportAdapter";
```

##### STT JSON Adapter

Converts various stt json formats to draftJs

```js
// For this forked version
import sttJsonAdapter from "react-transcript-editor/sttJsonAdapter";

// For the original BBC package
import sttJsonAdapter from "@bbc/react-transcript-editor/sttJsonAdapter";
```

##### Conversion modules to/from Timecodes

Some modules to convert to and from timecodes

```js
// For this forked version
import {
  secondsToTimecode,
  timecodeToSeconds,
  shortTimecode,
} from "react-transcript-editor/timecodeConverter";

// For the original BBC package
import {
  secondsToTimecode,
  timecodeToSeconds,
  shortTimecode,
} from "@bbc/react-transcript-editor/timecodeConverter";
```

## System Architecture

- Uses [`storybook`](https://storybook.js.org) with the setup as [explained in their docs](https://storybook.js.org/docs/guides/guide-react/) to develop this React.
- This uses [CSS Modules](https://github.com/css-modules/css-modules) to contain the scope of the css for this component.
- [`.storybook/webpack.config.js](./.storybook/webpack.config.js) enables the storybook webpack config to add support for css modules.
- The parts of the component are inside [`./packages`](./packages)
- [babel.config.js](./babel.config.js) provides root level system config for [babel 7](https://babeljs.io/docs/en/next/config-files#project-wide-configuration).

## Documentation

There's a [docs](./docs) folder in this repository, which contains subdirectories to keep:

- [notes](./docs/notes): dev notes on various aspects of the project.
- [adr](./docs/adr): [Architecture Decision Record](https://github.com/joelparkerhenderson/architecture_decision_record).

### ADR

> An architectural decision record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

We are using [this template for ADR](https://gist.github.com/iaincollins/92923cc2c309c2751aea6f1b34b31d95)

### QA

[There also QA testing docs](./docs/qa/README.md) to manual test the component before a major release, (QA testing does not require any technical knowledge).

## Build

> To transpile `./packages` and create a build in the `./dist` folder, run:

```sh
pnpm run build:component
```

To understand the build process, have a read through [this](./docs/guides/storybook-npm-setup.md).

## Demo & storybook

- **Storybook** can be viewed at [https://bbc.github.io/react-transcript-editor/](https://bbc.github.io/react-transcript-editor/)
- **Demo** can be viewed at [https://bbc.github.io/react-transcript-editor/iframe.html?id=demo--default](https://bbc.github.io/react-transcript-editor/iframe.html?id=demo--default)

To run locally, see [setup](#usage---development).

### Build - storybook

To build the storybook as a static site, run:

```sh
pnpm run build:storybook
```

This will produce a `build` folder containing the static site of the demo.
To serve the `build` folder locally, run:

```sh
pnpm run build:storybook:serve
```

#### Publishing to a web page

##### Github Pages

We use [github pages](https://pages.github.com/) to host the storybook and the [demo](https://help.github.com/articles/user-organization-and-project-pages/#project-pages-sites) of the component.
Make sure to add your changes to git, and push to `origin master` to ensure the code in `master` is reflective of what's online on `Github Pages`.
When you are ready, re-publish the Storybook by running:

```sh
pnpm run deploy:ghpages
```

## Tests

We are using [`jest`](https://jestjs.io/) for the testing framework.
To run tests, run:

```sh
pnpm test
```

For convenience, during development you can use:

```sh
pnpm run test:watch
```

and watch the test be re-run at every save.

## Travis CI

On commit this repo uses the [.travis.yml](./.travis.yml) config to run the automated test on [travis CI](https://travis-ci.org/bbc/react-transcript-editor).

## Publish to NPM

To publish to [npm - `@bbc/react-transcript-editor`](https://www.npmjs.com/package/@bbc/react-transcript-editor) run:

```sh
pnpm run publish:public
```

This runs `pnpm run build:component` and `npm publish --access public` under the hood, building the component and publishing to NPM.

> Note that only `README.md` and the `dist` folders are published to npm.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) guidelines.

## Licence

<!-- mention MIT Licence -->

See [LICENCE](./LICENCE.md)

## Legal Disclaimer

_Despite using React and DraftJs, the BBC is not promoting any Facebook products or other commercial interest._

## Original Package

This is a fork of the original [@bbc/react-transcript-editor](https://github.com/bbc/react-transcript-editor) package by BBC News Labs. The original package can be found at:

- **GitHub**: [https://github.com/bbc/react-transcript-editor](https://github.com/bbc/react-transcript-editor)
- **NPM**: [https://www.npmjs.com/package/@bbc/react-transcript-editor](https://www.npmjs.com/package/@bbc/react-transcript-editor)
- **Demo**: [https://bbc.github.io/react-transcript-editor/](https://bbc.github.io/react-transcript-editor/)
