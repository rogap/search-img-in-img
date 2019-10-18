# search-img-in-img

search-img-in-img позволяет искать изображение в другом изображении, применяя дополнительные функции обрезки на искомом изображении, а так же устанавливать погрешность и точность поиска.

## Installation

```bash

$ npm install https://github.com/rogap/search-img-in-img
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
* [cutCenter](#cutCenter)
* [getContext](#getContext)
* [compareArr](#compareArr)

### searchImgData

```js
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
 * 	[timeSearchData] - время в мс, за которое был произведен поиск и [status] - успешность поиска {Boolean}
 **/

// Пример:
const mainImg = canvasMain.getImageData(0, 0, mainWidth, mainHeight)
const desiredImg = canvasDesired.getImageData(0, 0, desiredWidth, desiredHeight)

const { searchImgData } = require('search-img-in-img')
const result = searchImgData(mainImg, desiredImg, {accuracy: 80, deviation: 30, from: [120, 50]})
console.log(result) // Object {status: true, x: 130, y: 70, timeSearchData: 438}
```

### searchImg

```js
/**
 * Проверяет наличие изображения в изображении
 * @params {String} [mainPath] - пусть к изображению на котором будем проверять
 * @params {Object or String} [desired] - содержит информацию для искомого изображеня или строку-путь
 * @params {String} [desired.path] - путь к искомому изображению
 * @params {String} [desired.func] - функция принимающая [ctx] и обычно используется для урезки изображения
 * @params {Object} [params] - содержит параметры для функции поиска [searchImgData]
 * @return {Promise} - результат функции [searchImgData]
 **/
```
Пример смотрите с [cutQuarter](#cutQuarter) ниже.

### cutCenter

```js
/**
 * Вырезает центр фото по заданным параметрам
 * @params {Object} [params] - содержит параметры урезки фото:
 * @params {Number} [params.width] - ширина получаеммого изображения
 * @params {Number} [params.height] - высота получаеммого изображения
 * @params {Number} [params.centerX] - смещение по оси Х
 * @params {Number} [params.centerY] - смещение по оси Y
 * @params {Object} [ctx] - контекст изображения
 **/
```
Пример анологичен [cutQuarter](#cutQuarter), см. ниже.

### cutQuarter

```js
/**
 * Вырезает один из 4-х частей фото (если мысленно разделить на 4 равные части)
 * @params {Array} [params] - содержит 2 строки указывающие направление вырезания (какую часть вырезать)
 * @params {Object} [ctx] - контекст изображения
 **/

// Пример:
const mainPath = 'img/picture.png'
// обрежит изображение "mainPath" так, что оставит правый верхний угол
// и поиск будет вестись на обрезанном изображении
const func = cutQuarter.bind(null, ["top", "right"])

searchImg(mainPath, {path: "img/desired.jpg", func})
.then(console.log)
```

### getContext

```js
/**
 * Рисует изображение, создав новый канвас и возвращает контекст 2d
 * @params {Object-image} [img] - загруженная картинка, обьект картинки
 **/
```

### compareArr

```js
/**
 * Cравнивает 2 массива
 * @params {Array} [arr1] - первый массив
 * @params {Array} [arr2] - второй массив
 * @params {Number} [deviation] - погрешность сравнения
 * @return {Boolean} - результат сравнения
 **/
```

## Original Authors

  - Владислав Алексеев ([rogup](https://github.com/rogap))

## Contacts

  - [Discord](https://discord.gg/RG9WQtP)

## License

### search-img-in-img

(The MIT License)

Copyright (c) [2019] [rogap]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

### node-canvas

See [license](https://github.com/Automattic/node-canvas/blob/master/Readme.md#license)
