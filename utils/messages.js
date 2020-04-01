var format = require('date-fns/format')

const formatMessage = (username, text) => ({
    username,
    text,
    time: format(new Date(), 'HH:MM a')
})

module.exports = formatMessage