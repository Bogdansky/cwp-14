module.exports = (Sequelize, sequelize) => {
    let date = new Date();
    return sequelize.define('films', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: Sequelize.STRING,
        rating: {
            type: Sequelize.STRING,
            validate: {
                is: ["^[0-9]*[.,]?[0-9]+$"]
            }
        },
        year: {
            type: Sequelize.INTEGER,
            validate: {
                min: 1895, 
                max: date.getFullYear(),
                isInt: true
            }
        },
        budget: {
            type: Sequelize.INTEGER,
            validate: {
                min: 1, 
            }
        },
        gross: Sequelize.INTEGER,
        poster: Sequelize.STRING,
        position: Sequelize.INTEGER
    }, {
		scopes: {
			new: {
				where: {
					year: {
						[Sequelize.Op.gte]: 2007
					}
				}
			}
		}
	});
}