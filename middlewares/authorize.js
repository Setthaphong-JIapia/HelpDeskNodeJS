module.exports = function (requiredPermission) {
    return (req, res, next) => {
        if (!req.session.permissions || !req.session.permissions.includes(requiredPermission)) {
            return res.status(403).send('Permission denied: You are not authorized to perform this action.');
        }
        next();
    };
};