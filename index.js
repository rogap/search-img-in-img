const { createCanvas, loadImage, createImageData } = require('canvas')



/**
 * Осуществляет поиск изображения в изображении и возвращает первое найденное сходство
 * @param {Object-image} [mainImg] - обьект картинки с [data] содержащим массив цветов изображения
 * 	на котором будет искаться другое изображение
 * @param {Object-image} [desiredImg] - обьект картинки с [data] содержащим массив цветов изображения
 * 	которое будет искаться
 * @param {Object} - параметры обьекта:
 * @params {Number} [accuracy] - точность поиска, указывается в %
 * @params {Number} [deviation] - погрешность поиска, указывается число отклонения цвета
 * @params {Array} [from] - содержит координаты начала поиска [x, y]
 * @return {Object} - содержит [x], [y] координаты верхней левой точки найденного изображения
 * 	[time] - время в мс, за которое был произведен поиск и [status] - успешность поиска {Boolean}
 **/
function searchImgData(mainImg, desiredImg, {accuracy=100, deviation=0, from}={}) {
	const startTime = new Date()

	const mainWidth = mainImg.width
	const mainHeight = mainImg.height

	const desiredWidth = desiredImg.width
	const desiredHeight = desiredImg.height

	const mainData = mainImg.data
	const desiredData = desiredImg.data

	const mainLength = mainData.length
	const desiredLength = desiredData.length

	//console.log(mainLength, desiredLength)

	let globalLine = 0 // линия поиска смещающая начальную линию поиска
	let fromJ = 0
	if (from) {
		globalLine = from[1] // устанавливаем нужную линию
		fromJ = mainWidth * 4 * globalLine + from[0] * 4
	}
	const desiredPixel = desiredLength / 4
	// перебираем все позиции основного изображения (на котором ищим - меняем позиции поиска)
	for(let j = 0 + fromJ; j < mainLength - desiredLength; j += 4) {
		//console.log(`\r\n\r\n\r\nj: ${j} из ${mainLength - desiredLength}`)

		let goodPixel = 0 // для определения точности
		let badPixel = 0 // для определения точности
		let line = 0 // линия поиска смещающая малую линию

		// перебор искомого изображения с целью его нахождения
		for(let i = 0; i < desiredLength; i += 4) { // шаг 4 так как пиксель содержит 4 цвета
			if (i / 4 % desiredWidth == 0 && i != 0) { // когда достигли конца линии искомого изображения
				//console.log(`\r\nНовая линия, desiredWidth: ${desiredWidth}`)
				line++ // на новую строку поиска
				// это нужно что бы указать для глобального изображения новую линию
			}

			//console.log(`globalLine: ${globalLine}, line: ${line}, mainWidth: ${mainWidth}`)
			// мнимое j, относительно искомого изображения, вычитаем правое что бы скомпенсировать i
			const mnimeJ = line * mainWidth * 4 + i + j - (desiredWidth * 4 * line)
			//console.log(`mnimeJ: ${mnimeJ}, i: ${i} из ${desiredLength}`)

			// сравниваем цвета
			const cm1 = mainData[mnimeJ], 
				cm2 = mainData[mnimeJ + 1], 
				cm3 = mainData[mnimeJ + 2], 
				cd1 = desiredData[i], 
				cd2 = desiredData[i + 1], 
				cd3 = desiredData[i + 2]
			const compare = compareArr([cm1, cm2, cm3], [cd1, cd2, cd3], deviation)
			compare ? goodPixel++ : badPixel++
			//console.log(cm1,cm2,cm3," = ",cd1,cd2,cd3,compare,deviation)
		}


		// если мы достигли правого смещения учитывая искомое изображение
		if ( (j / 4 + desiredWidth) % mainWidth == 0 && j != 0 && j != 4 ) {
			globalLine ++ // делаем переход на нвую строку
			j = globalLine * mainWidth * 4 - 4 // смещаем на новую строку
		}

		// если % соотношение хороших пикселей больше либо равно тому что указано
		if (goodPixel / desiredPixel * 100 >= accuracy) return { // изображене найдено
			status: true,
			x: (j - (mainWidth * 4 * globalLine) ) / 4,
			y: --globalLine,
			timeSearchData: new Date() - startTime
		}

		// определяем предел смещения глобального поиска вниз
		if (globalLine > mainHeight - desiredHeight) break // выходим из цикла и заканчиваем поиск

	}
	return {status: false, timeSearchData: new Date() - startTime}
}


function compareArr(arr1, arr2, deviation=0) { // сравнивает 2 массива
	const len = arr1.length
	if (len != arr2.length) return false
	for (let i = 0; i < len; i++) {
		const res = arr1[i] >= arr2[i] - deviation && arr1[i] <= arr2[i] + deviation
		if (!res) return false
	}
	return true
}


/**
 * Проверяет наличие изображения в изображении
 * @params {String} [mainPath] - пусть к изображению на котором будем проверять
 * @params {Object or String} [desired] - содержит информацию для искомого изображеня или строку-путь
 * @params {String} [desired.path] - путь к искомому изображению
 * @params {String} [desired.func] - функция принимающая [ctx] и обычно используется для урезки изображения
 * @params {Object} [params] - содержит параметры для функции поиска [searchImgData]
 * @return {Promise} - результат функции [searchImgData]
 **/
function searchImg(mainPath, desired, params={}) {
	const desiredPath = typeof desired === "string" ? desired : desired.path
	params.accuracy === undefined ? params.accuracy = 90 : null
	params.deviation === undefined ? params.deviation = 20 : null

	const startTime = new Date()
	let mainImgData,
		defaultWidth,
		defaultHeight,
		modifiedWidth,
		modifiedHeight

	return loadImage(mainPath)
	.then(loadMainImg)

	function loadMainImg(mainImg) {
		const ctx = getContext(mainImg)
		// запоминаем изначальные размеры изображения
		defaultWidth = ctx.canvas.width
		defaultHeight = ctx.canvas.height

		if (desired.func) desired.func(ctx)
		// запоминаем измененные размеры изображения
		modifiedWidth = ctx.canvas.width
		modifiedHeight = ctx.canvas.height

		mainImgData = ctx.getImageData(0, 0, modifiedWidth, modifiedHeight)
		return loadImage(desiredPath)
		.then(loadDesiredImg)
	}

	function loadDesiredImg(desiredImg) {
		const ctx = getContext(desiredImg)

		const desiredImgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
		const res = searchImgData(mainImgData, desiredImgData, params)
		res.timeSearch = new Date() - startTime
		return {...res, defaultWidth, defaultHeight, modifiedWidth, modifiedHeight}
	}
}


/**
 * Вырезает центр фото по заданным параметрам
 * @params {Object} [params] - содержит параметры урезки фото:
 * @params {Number} [params.width] - ширина получаеммого изображения
 * @params {Number} [params.height] - высота получаеммого изображения
 * @params {Number} [params.centerX] - смещение по оси Х
 * @params {Number} [params.centerY] - смещение по оси Y
 * @params {Object} [ctx] - контекст изображения
 **/
function cutCenter(params, ctx) {
	const width = params.width
	const height = params.height
	const centerX = (ctx.canvas.width - width) / 2 + params.centerX
	const centerY = (ctx.canvas.height - height) / 2 + params.centerY

	const imgData = ctx.getImageData(centerX, centerY, width, height)

	ctx.canvas.width = width
	ctx.canvas.height = height
	ctx.putImageData(imgData, 0, 0)
}


/**
 * Вырезает один из 4-х частей фото (если мысленно разделить на 4 равные части)
 * @params {Array} [params] - содержит 2 строки указывающие направление вырезания (какую часть вырезать)
 * @params {Object} [ctx] - контекст изображения
 **/
function cutQuarter(params=["top", "left"], ctx) {
	const width = ctx.canvas.width
	const height = ctx.canvas.height
	const halfWidth = width / 2
	const halfHeight = height / 2

	const fromX = params.indexOf("right") === -1 ? 0 : halfWidth
	const fromY = params.indexOf("top") === -1 ? halfHeight : 0
	const toX = params.indexOf("right") === -1 ? halfWidth : width
	const toY = params.indexOf("top") === -1 ? height : halfHeight

	const imgData = ctx.getImageData(fromX, fromY, toX, toY)

	ctx.canvas.width = halfWidth
	ctx.canvas.height = halfHeight
	ctx.putImageData(imgData, 0, 0)
}


/**
 * Рисует изображение, создав новый канвас и возвращает контекст 2d
 * @params {Object-image} [img] - загруженная картинка, обьект картинки
 **/
function getContext(img) {
	const width = img.width,
		height = img.height,
		canvas = createCanvas(width, height),
		ctx = canvas.getContext("2d")

	ctx.drawImage(img, 0, 0, width, height)
	return ctx
}



module.exports = {
	searchImgData,
	searchImg,

	cutCenter,
	cutQuarter,
	getContext,
	compareArr
}
