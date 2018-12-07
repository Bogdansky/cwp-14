module.exports = (Sequelize, sequelize, actor, film) => {
    return sequelize.define('cast', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        },
        filmId: {
            type: Sequelize.INTEGER,
            references: {
                model: film,
                key: 'id'
            }
        },
        actorId: {
            type: Sequelize.INTEGER,
            references: {
                model: actor,
                key: 'id'
            }
        }
    })
}