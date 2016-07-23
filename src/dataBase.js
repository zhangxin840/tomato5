import firebase from 'firebase';

let database = null;

const init = function init() {
  database = firebase.database();
};

const get = function get(path, defaultData, validator) {
  const promise = new Promise((resolve, reject) => {
    // console.log("Checking remote");
    database.ref(path).once('value', (snapshot) => {
      const data = snapshot.val();

      console.log('Reveived Data');
      if ((validator && validator(data)) || (!validator && data)) {
        console.log('Valid Data');
        resolve(data);
      } else {
        console.log('No valid Data');
        // ref.set(defaultData).then(function(){
        //   console.log("Default setted");
        //   resolve(defaultData);
        // });
        resolve(defaultData);
      }
    }, () => {
      reject();
    });
  });

  return promise;
};

const save = function save(path, data) {
  const parsedData = JSON.parse(JSON.stringify(data));
  return database.ref(path).set(parsedData).then(() => {
    console.log('Saved');
  });
};

export default { init, get, save };
