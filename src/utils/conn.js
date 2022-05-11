const util = require( 'util' );
const mysql = require( 'mysql' );
module.exports.conn = function conn(  ) {
   const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      };
  const connection = mysql.createPool( config );
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}