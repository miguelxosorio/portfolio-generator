const { prompt } = require('inquirer');
const inquirer = require('inquirer');
const { writeFile, copyFile } = require('./utils/generate-site.js');
const generatePage = require('./src/page-template');

// const pageHTML = generatePage(name, github);

// fs.writeFile('./index.html', pageHTML, err => {
//   if (err) throw err;

//   console.log('Portfolio complete! Check out index.html to see the output!');
// });

// console.log(inquirer);

// We ask the user for their information with inquirer prompts, this returns all of the data as an object in Promise
const promptUser = () => {
return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your name?',
            validate: nameInput => {
                if(nameInput) {
                    return true;
                } else {
                    console.log('Please enter your name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'github',
            message: 'Enter your Github Username',
            validate: userName => {
                if(userName) {
                    return true;
                } else {
                    console.log('Please enter your GitHub Username');
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmAbout',
            message: 'Would you like to enter some information about yourself for an "About" section?',
            default: true
        },
        {
            type: 'input',
            name: 'about',
            message: 'Provide some information about yourself:',
            when: ({ confirmAbout }) => {
                if(confirmAbout) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]);
};

// this function captures the returning data from promptUser() *we can call recursively based on how many projects we want to include*
// each project will be pushed into a projects array in the collection of portfolio information, and when we're done, the final set of data is returned to the next .then()
// The finished portfolio data object is returned as porfolioData and sent into the generatePage() function, which will return the finised HTML template code into pageHTML
// We pass pageHTML into the newly created writeFile() function, which returns a Promise. This is why we use return here, so the promise is returned into the next .then() method
// upon a successful file creation, we take the writeFileResponse object provided by the writeFile() function's resolve() execution to log it, and then we return copyFile()
// The Promise returned by copyFile() then lets us know if the CSS file was copied correctly
const promptProject = portfolioData => {
    
    console.log(`
    =================
    Add a New Project
    =================
    `);
    // If there's no 'projects' array property, create one
    if (!portfolioData.projects) {
    portfolioData.projects = [];
    }
      return inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of your project?',
          validate: projectName => {
              if(projectName) {
                  return true;
              } else {
                  console.log('Please enter your project name');
              } return false;
          }
        },
        {
          type: 'input',
          name: 'description',
          message: 'Provide a description of the project (Required)',
          validate: projectDescription => {
              if(projectDescription) {
                  return true;
              } else {
                  console.log('Please write a description of your project');
              } return false;
          }
        },
        {
          type: 'checkbox',
          name: 'languages',
          message: 'What did you build this project with? (Check all that apply)',
          choices: ['JavaScript', 'HTML', 'CSS', 'ES6', 'jQuery', 'Bootstrap', 'Node']
        },
        {
          type: 'input',
          name: 'link',
          message: 'Enter the GitHub link to your project. (Required)',
          validate: gitHubLink => {
              if(gitHubLink) {
                  return true;
              } else {
                  console.log('Please provide a link for your GitHub');
              } return false;
          }
        },
        {
          type: 'confirm',
          name: 'feature',
          message: 'Would you like to feature this project?',
          default: false
        },
        {
          type: 'confirm',
          name: 'confirmAddProject',
          message: 'Would you like to enter another project?',
          default: false
        }
    ])
    .then(projectData => {
        portfolioData.projects.push(projectData);
        if(projectData.confirmAddProject) {
            return promptProject(portfolioData);
        } else {
            return portfolioData;
        }
    });
};

promptUser()
    .then(promptProject)
    .then(portfolioData => {
        return generatePage(portfolioData);
    })
    .then(pageHTML => {
        return writeFile(pageHTML);
    })
    .then(writeFileResponse => {
        console.log(writeFileResponse);
        return copyFile();
    })
    .then(copyFileResponse =>{
        console.log(copyFileResponse);
    })
    .catch(err => {
    console.log(err);
});
    
