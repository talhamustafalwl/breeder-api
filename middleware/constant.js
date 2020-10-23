class Constant {
    removeQuote(data) {
        return data.replace(/['"]+/g, '');
    }
}

module.exports = new Constant();