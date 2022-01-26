var generator = require("generate-password");
module.exports = {
  generate(length) {
    return generator.generate({
      length,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      strict: true,
    });
  },
};
