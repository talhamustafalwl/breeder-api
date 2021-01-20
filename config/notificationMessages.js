module.exports = {
    employeeLogin: () => {
        return {
            title: 'New Employee has been Logged In By Breeder',
            description: 'Description of employee logged in by breeder',
            type: 'employeeLogin'
        }
    },
    formPublish: (isPublish) => {
        if(isPublish) {
            return {
                title: 'Form Published',
                description: 'Description of employee logged in by breeder',
                type: 'formPublish'
            }
        } else {
            return {
                title: 'Form Unpublished',
                description: 'Description of employee logged in by breeder',
                type: 'formPublish'
            }
        }
    },
    employeeRegister: () => {
        return {
            title: 'New Employee has been Logged In By Breeder',
            description: 'Description of employee logged in by breeder',
            type: 'employeeRegister'
        }
    },
    breederRegister: () => {
        return {
            title: 'New Employee has been Logged In By Breeder',
            description: 'Description of employee logged in by breeder',
            type: 'breederRegister'
        }
    },
    changeSubscription: () => {
        return {
            title: 'Subscription Changed',
            description: 'Description of employee logged in by breeder',
            type: 'changeSubscription'
        }
    }
}
