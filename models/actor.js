module.exports = (Sequelize, sequelize) => {
    return sequelize.define('actors', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.STRING,
        birth: Sequelize.STRING,
        films: Sequelize.INTEGER,
        liked: Sequelize.INTEGER,
        photo: Sequelize.STRING
    });
}