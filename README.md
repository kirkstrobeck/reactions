#Reactions for Facebook

An extension in response to [this article](https://medium.com/@kirkstrobeck/facebook-reactions-d-202e1e4523d4#.lgiywnxl8)

php -S localhost:8000
watchify -t [ babelify --presets [ react ] ] src/index.js -o dist/index.js
less-watch-compiler src dist
