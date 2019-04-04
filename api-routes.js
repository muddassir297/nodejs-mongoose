const express = require('express');
const router = express.Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
// Import contact controller
var contactController = require('./controller/contactController');
// Contact routes
router.route('/contacts')
    .get(contactController.index);
router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);
router.route('/register')
    .post(contactController.new);
router.route('/login')
    //.get(contactController.getLogin)
    .post(contactController.postLogin);
router.route('/logout')
    .get(contactController.logout);

// Export API routes
module.exports = router;