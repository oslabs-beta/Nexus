<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
<a href="https://github.com/github_username/repo_name">
</a>
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/oslabs-beta/Nexus">
  	<img src="nexus/media/logo.png" alt="NexusLogo" width="100%">
  </a>
<!-- HEADING AREA -->
<h1 align="center">Nexus</h1>

  <p align="center">
    A component tree extension for NextJS
    <br />
    <br />
    <a href="https://github.com/oslabs-beta/Nexus/issues">Report Bugs</a>
    ·
    <a href="https://github.com/oslabs-beta/Nexus/issues">Request Features</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#installation">Installation</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li>
      <a href="#contributing">Steps to Contribute</a>
      <ul>
        <li><a href ="#making-changes">Making Changes</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#NexusTeam">The Nexus Team</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Nexus is a VSCode Extension created for NextJS developers! As codebases scale in size and complexity, developers may feel overwhelmed as they keep track of tens of components and hundreds of props elements per file. Nexus aims to help developers overcome unnecessary mental strain through 3 main methods:

1. Displaying file-specific component hierarchy in your VSCode sidebar
2. Including component-specific state and props objects for parent and child components
3. Differentiating between server-side rendered and static-site generated components

We at Team Nexus hope that you enjoy our extension, taking advantage of a time-tested component tree model that integrates the unique features of NextJS!  

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- BUILT WITH -->
### Built With

* <img style="height: 1em;" src="nexus/media/next-js.png"> [Next.js](https://nextjs.org/)
* <img style="height: 1em;" src="nexus/media/react-brands.png"> [React.js](https://reactjs.org/)
* <img style="height: 1em;" src="nexus/media/typescript.png"> [Typescript](https://www.typescriptlang.org/)
* <img style="height: 1em;" src="nexus/media/vscode.png">  [VSCode Extension API](https://code.visualstudio.com/api)
* <img style="height: 1em;" src="nexus/media/webpack.png">  [Webpack](https://webpack.js.org/)
* [Acorn Parser](https://www.npmjs.com/package/acorn)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- INSTALLATION -->
## Installation

1. Install the Nexus extension in the VSCode Marketplace

2. A node tree icon should appear on your sidebar. You've now installed Nexus! Woot Woot! Now on to the "Getting Started" section below.

Note: If contributing, see the "Installation for Contributors" section below! 

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Congrats on installing Nexus! Now let's get it started.


### Prerequisites

Nexus supports OSX, Windows, and WSL

<!-- USAGE EXAMPLES -->
## Usage

1. Click the node tree icon on your sidebar. An "Input File Here" button should appear on your side panel!
  <img src="nexus/media/gif1.gif">

2. Click the button and your file explorer window will open. Select a file and press "Ok".
  <img src="nexus/media/gif2.gif">

3. Your side panel should now render a component tree that displays SSG or SSR status! Clicking on components will render child components if they exist and hovering over components will display their props objects. Enjoy!
  <img src="nexus/media/gif3.gif">

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Creating a webview to look deeper into structure of individual components
- [ ] Making the parser more dynamic and flexible
- [ ] Handling Link Components
- [ ] Error checking in the frontend to ensure that uploaded files are either NextJS or React
- [ ] Add status bar item for Nexus
- [ ] Store component tree memory in VSCode

See the [open issues](https://github.com/oslabs-beta/Nexus/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- STEPS TO CONTRIBUTE -->
## Steps to Contribute

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork & Clone Nexus
2. Create your Feature Branch (`git checkout -b <github_username>/<YourAmazingFeature>`)
3. Make your Changes (See **Making Changes** below)
4. Commit your Changes (`git commit -m '<Your Commit Message>'`)
5. Push to the Branch (`git push origin <github_username>/<YourAmazingFeature>`)
6. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MAKING CHANGES -->
### Making Changes

1. Make your changes!
2. Open /nexus/src/extension.ts and save any changes you made
3. Re-compile and re-build your extension using the command line: `npm run compile` & `npm run build`
4. Press F5. A new VSCode window should open. This is your debugging environment!
5. Repeat step 3 and refresh your debugging environment to test further changes

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- THE NEXUS TEAM -->
## The Nexus Team

* Mike Hong [LinkedIn](https://www.linkedin.com/in/mykongee/) | [Github](https://github.com/mykongee)
* Brian Chiang [LinkedIn](https://www.linkedin.com/in/brian-chiang-849a181a7/) | [Github](https://github.com/BChiang4)
* David Lee [LinkedIn](https://www.linkedin.com/in/david-lee-39541411a/) | [Github](https://github.com/dplee123)
* Nico Flores [LinkedIn](https://www.linkedin.com/in/nicolasaflores/) | [Github](https://github.com/nicoflrs)
* Alex Hersler [LinkedIn](https://www.linkedin.com/in/alex-hersler/) | [Github](https://github.com/FoxEight)

<!-- CONTACT US -->
## Contact Us
Email: nexusjsadm@gmail.com

Twitter: [@teamnexus_js](https://twitter.com/teamnexus_js) 

Website: [https://nexus-js.com/](https://nexus-js.com/)

<p align="right">(<a href="#top">back to top</a>)</p>