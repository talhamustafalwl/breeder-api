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
    getMonths() {
        return {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'};
    }
}

module.exports = new Constant();