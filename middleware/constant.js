class Constant {
    removeQuote(data) {
        return data.replace(/['"]+/g, '');
    }
    getDiffDate(date1, date2) {
        console.log(date2 - date1)
        const diffTime = Math.abs(date2 - date1);
        console.log(diffTime);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    }
}

module.exports = new Constant();