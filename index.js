const Sequelize = require('sequelize');
const config = require('./config.json')
const sequelize = new Sequelize('features','root','5591', config);

let actor = require('./models/actor')(Sequelize,sequelize);
let film = require('./models/film')(Sequelize,sequelize);
let filmsAndActors = require('./models/actorsAndFilms')(Sequelize,sequelize, actor, film);

const films = require('./films.json');
const actors = require('./actors');

actor.belongsToMany(film, {as: 'Films', through: 'ActorFilms'});
film.belongsToMany(actor, {as: 'Actors', through: 'ActorFilms'});

(async () => {
	await sequelize.sync({force: true});

	console.log('1. Валидация полей budget, year и rating фильма');
	try{
		await film.create({
			title: 'Побег из Шоушенка | The Shawshank Redemption',
			rating: 9.191,
			year: 1894,
			budget: 25000000,
			gross: 59000000,
			poster: 'https://st.kp.yandex.net/images/film_iphone/iphone360_46019.jpg',
			position: 100
		});
	}
	catch (e){
		e.errors.forEach((err) => {
			console.log(`${err.message}`);
		});
	}

	console.log('2. Пакетная вставка 3 фильмов');
	await film.bulkCreate(films.slice(0,3));

	console.log('3. Пакетное обновление поля liked у актеров с 3 фильмами');
	await actor.update({
			liked: 999
		},{
			where:{
				films: 3
			}
		});

	console.log('4. Пакетное удаление актеров с liked равным 0');
	await actor.destroy({
		where: {
			liked: 0
		}
	});

	console.log('5. Получение за один запрос фильм со всеми его актерами (include)');
	(await film.findByPk(2, {
		include: [{
			model: actor,
			as: 'Actors'
		}]
	})).Actors.forEach((e) => {
		console.log(`>> ${e.name}`);
	});

	console.log('6. Создание и применение scope для фильмов вышедших с 2007 года');
	(await film.scope('new')
		.findAll()).forEach((film) => {
		console.log(`>> ${film.title}`);
	});

	console.log('7. Создание и вызов хуков beforeCreate, afterCreate');
	sequelize.addHook('beforeBulkCreate', () => {
		console.log('beforeBulkCreate');
	});

	sequelize.addHook('afterBulkCreate', () => {
		console.log('afterBulkCreate');
	});

	await actor.bulkCreate(actors.slice(1,4));

	await filmsAndActors.bulkCreate([
		{actorId: 2, filmId: 2}
	]);

	console.log('8. Транзакция: считываем всех актеров, пакетно обновляем им liked на 0, ждем 10 секунд, откатываем транзакцию');
	await sequelize.transaction().then(transa => {
		return actor.update({
				liked: 0
			},{
                where: {},
				transaction: transa
			}).then(() => {
			console.log('sleep(10000)');
			setTimeout(function () {
				console.log("rollback");
				return transa.rollback();     // transa.commit();
			}, 10000);
		}).catch(error => {
            console.log(error);
        });
	});

	console.log('End');

})();