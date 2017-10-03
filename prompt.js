const prompt = require('prompt');

prompt.start();

prompt.message = "";
prompt.delimeter = "";

const booleanChooser = (value) => {
  value = value.toLowerCase();

  if (value === "yes" || value === "y") {
    value = true;
  } else if (value === "no" || value === "n") {
    value = false;
  }

  return value;
};

const formatToken = (value) => {
  return JSON.parse(value);
};

const schema = {
  properties: {
    token: {
      description: 'What is your token?',
      require: true,
      before(value) {
        return formatToken(value);
      },
    },
    recipient: {
      description: 'Receiving Channel ID',
      required: true,
    },
    save: {
      description: 'Save these settings? Yes or No',
      message: 'Must be yes (y) or no (n)',
      required: false,
      before(value) {
        return booleanChooser(value);
      },
    }
  }
};

module.exports = () => {
  return new Promise((resolve, reject) => {
    prompt.get(schema, (err, result) => {
      if (result.recipient && result.token) {
        resolve(result);
      }
    });
  });
};
