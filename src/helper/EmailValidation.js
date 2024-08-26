const blockedEmails = ['a@example.com', 'testing@example.com', 'dummy@gmail.com'];
const blockedDomains = ['example.com', 'yopmail.com', 'test.com'];

const isEmailBlocked = (email) => {
    // Check if the exact email is blocked
    if (blockedEmails.includes(email.toLowerCase())) {
        return true;
    }
    
    // Check if the email contains any of the blocked domains
    const emailDomain = email.split('@')[1].toLowerCase();
    if (blockedDomains.some(domain => emailDomain.includes(domain))) {
        return true;
    }

    // Check if the email has only numbers in any part (before @ or after @)
    const numberOnlyPattern = /^(\d+@\d+\.\S+)|(\S+@\d+\.\S+)$/;
    if (numberOnlyPattern.test(email)) {
        return true;
    }
    
    return false;
};

module.exports = isEmailBlocked;