const knex = require('knex');
const config = require('config');
const logger = require('../logger/my_logger');


const sslConfig = {
  rejectUnauthorized: false,
};

const connectedKnex = knex({
  client: 'pg',
  connection: {
    connectionString: config.connectionString,
    ssl: sslConfig,
  },
});


// const connectedKnex = knex({
//   client: 'pg',
//   version: config.db.version,
//   connection: {
//     host: config.db.host,
//     user: config.db.user,
//     password: config.db.password,
//     database: config.db.database
//   }
// });

const getFriendsByUserId = async (id) => {
  try {
    const friendlist = await connectedKnex('friendlist')
      .select('*')
      .where('id_user_log', id.replace("$oid:", ""));
    logger.info(`Successfully get all friend in PostgreSQL. User ID: ${id}`);
    return friendlist;
  } catch (error) {
    logger.error(`Error fetching friend list from PostgreSQL. Error: ${error.message}`);

  }
};

const getFriendById = async (userId, friendId) => {
  try {
    const result = await connectedKnex('friendlist')
      .select('*')
      .where('id_user_log', userId.replace("$oid:", ""))
      .where('id', friendId)
    logger.info(`Successfully get friend by id ${friendId} from PostgreSQL. User ID: ${userId}`);
    return result;
  } catch (error) {
    logger.error(`Error get friend from PostgreSQL. Error: ${error.message}`);
  }
};

const addFriend = async (addFriend) => {
  try {
    let result;
    // Manually fetch the current max ID
    const maxIdResult = await connectedKnex('friendlist').max('id');
    const maxId = maxIdResult[0].max || 0;

    // Generate the new ID by incrementing the max ID
    const newId = maxId + 1;

    // Assign the new ID to the addFriend object
    const friendToAdd = { ...addFriend, id: newId, id_user_log: addFriend.id_user_log.replace("$oid:", "") };



    // Perform the insertion
    result = await connectedKnex('friendlist')
      .insert(friendToAdd)
      .returning('id');
    logger.info(`New friend added to PostgreSQL. Friend ID: ${result[0].id}`);
    return result[0];
  } catch (error) {
    // Check for duplicate key violation
    if (error.code === '23505') {
      logger.error(`Duplicate key violation. Error: ${error.detail}`);
    } else {
      logger.error(`Error adding a new friend to PostgreSQL. Error: ${error.message}`);
    }
    throw Error(`${error.message}`);
  }
}

const deleteFriendById = async (userId, friendId) => {
  try {
    const result = await connectedKnex('friendlist')
      .where('id_user_log', userId.replace("$oid:", ""))
      .where('id', friendId)
      .del();
    logger.info(`Successfully deleted friend from PostgreSQL. Friend ID: ${friendId}`);
    return result;
  } catch (error) {
    logger.error(`Error deleting friend from PostgreSQL. Error: ${error.message}`);
  }
};

const updateFriendById = async (userId, friendId, updated_friend) => {
  try {
    let result;

    // Fetch the existing friend's ID before the update
    const existingFriend = await connectedKnex('friendlist')
      .select('id')
      .where('id_user_log', userId.replace("$oid:", ""))
      .where('id', friendId)
      .first();

    if (!existingFriend) {
      logger.error('Friend not found in the friendlist.');
      return null;
    }

    // Perform the update using the existing friend's ID
    result = await connectedKnex('friendlist')
      .where('id', existingFriend.id)
      .update(updated_friend);

    logger.info(`Successfully updated friend in PostgreSQL. Friend ID: ${friendId}`);
    return result;
  } catch (error) {
    logger.error(`Error updating friend in PostgreSQL. Error: ${error.message}`);
    throw Error(`${error.message}`);
  }
};

module.exports = {
  getFriendsByUserId,
  getFriendById,
  addFriend,
  deleteFriendById,
  updateFriendById
};