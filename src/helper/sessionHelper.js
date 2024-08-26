const manageSession = (req) => {
    // Generate session ID if it does not exist
    let session_id = req.session.session_id;
    if (!session_id) {
        session_id = req.sessionID;
        req.session.session_id = session_id;
    }
    return session_id;
};

module.exports = { manageSession };