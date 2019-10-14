# search-img-in-img

search-img-in-img позволяет искать изображение в другом изображении, применяя дополнительные функции обрезки на искомом изображении, а так же устанавливать погрешность и точность поиска.

## Installation

```bash

$ npm install https://github.com/daniiltest/search-img-in-img
```

## Quick Example

```javascript
const { searchImg } = require('search-img-in-img')

const pathInImg = "inImg.png" // в каком изображении будем искать
const searchedImg = "search.png" // изображение которое будем искать

searchImg(pathInImg, searchedImg)
.then(res => {
	console.log(res)
	// res.status - содержит результат поиска: true/false (найдено или не найденно)
})
```
## Documentation

Описание функций модуля

* [searchImgData](#searchImgData)
* [searchImg](#searchImg)
* [cutCenter](#cutCenter)
* [cutQuarter](#cutQuarter)
* [getContext](#getContext)
* [compareArr](#compareArr)

### searchImgData

```js
/** searchImgData:
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
 * 	[timeSearchData] - время в мс, за которое был произведен поиск и [status] - успешность поиска {Boolean}
 **/

// Пример:
const mainImg = canvasMain.getImageData(0, 0, mainWidth, mainHeight)
const desiredImg = canvasDesired.getImageData(0, 0, desiredWidth, desiredHeight)

const { searchImgData } = require('search-img-in-img')
const result = searchImgData(mainImg, desiredImg, {accuracy: 80, deviation: 30, from: [120, 50]})
console.log(result) // Object {status: true, x: 130, y: 70, timeSearchData: 438}
```
