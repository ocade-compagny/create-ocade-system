import { exec } from "child_process";

export const execPromise =  (command) => {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        encoding: 'utf8'
      },
      function(error, stdout, stderr) {
        if (error) {
          reject(error);
          return;
        }
        resolve({stdout, stderr})
    });
  })
};

export const existOption = (object, test) => {
  return object.hasOwnProperty(test) && object[test] !== "";
};