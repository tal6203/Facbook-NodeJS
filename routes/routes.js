const { Router } = require('express');
const controller = require('../controllers/controller')
const { ToBestFriends } = require('../middleware/middleware');




const router = Router();

router.get('/signup', controller.signup_get);
router.post('/signup', controller.signup_post);
router.get('/login', controller.login_get);
router.post('/login', controller.login_post);
router.get('/logout', controller.logout_get);
router.get('/bestfriends', ToBestFriends, controller.best_friends_get_page);
router.get('/friends/:userId', controller.best_friends_get_friendlist);
router.get('/friends/:userId/:friendId',controller.get_friend_by_id);
router.post('/friends/:userId', controller.add_new_friend);
router.delete('/friends/:userId/:friendId', controller.delete_best_friend);
router.put('/friends/:userId/:friendId',controller.update_best_friend);

module.exports = router;

