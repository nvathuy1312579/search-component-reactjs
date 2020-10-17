import axios from 'axios';

export const searchApi = (keyword) => {
  const apiURL = `https://hn.algolia.com/api/v1/search?query=${keyword}`;
  return new Promise((resolve, reject) => {
    axios
      .get(apiURL)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(`error: ${err}`);
        reject(err);
      });
  });
};
