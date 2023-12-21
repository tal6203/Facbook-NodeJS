const { Router } = require('express');
const controller = require('../controllers/controller')
const { ToBestFriends, corsServer } = require('../middleware/middleware');




const router = Router();

router.get('/signup', controller.signup_get);
router.post('/signup', controller.signup_post);
router.get('/login', controller.login_get);
router.post('/login', controller.login_post);
router.get('/logout', controller.logout_get);
router.get('/bestfriends', ToBestFriends,corsServer, controller.best_friends_get_page);
router.get('/friends/:userId',corsServer ,controller.best_friends_get_friendlist);
router.get('/friends/:userId/:friendId',corsServer,controller.get_friend_by_id);
router.post('/friends/:userId',corsServer ,controller.add_new_friend);
router.delete('/friends/:userId/:friendId', corsServer,controller.delete_best_friend);
router.put('/friends/:userId/:friendId',corsServer,controller.update_best_friend);

module.exports = router;

