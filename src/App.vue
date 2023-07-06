<template>
	<div class="speed-test">
		<div class="container">
			<div class="speed-test-wrapper">
				<a href="https://vadimjkeee.github.io/artSpace/">artspace</a>
				<h1 class="speed-test__title">Тест скорости набора текста</h1>
				<p>
					Как только вы начнете писать в поле ввода пойдет время. Задача написать
					текст ниже как можно быстрее для того, чтобы узнать свою скорость
					печати.
				</p>
				<button class="replace-text-button" @click="replaceText">Заменить текст</button>
				<div class="typing-area">
					<p>{{ apiText }}</p>
					<textarea
						:class="{ error: hasError, 'error-animation': showErrorAnimation }"
						v-model="typedText"
						@input="checkTypedText"
					></textarea>
					<div class="typing-area__timer">{{ timer }}</div>
				</div>
				<div class="results">
					<p class="results__speed">
						Скорость набора текста: {{ typingSpeed }} символов в минуту
					</p>
					<p class="results__symbols">Всего символов: {{ symbolsNum }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			typedText: '',
			startTime: null,
			endTime: null,
			timer: '00:00',
			typingSpeed: 0,
			symbolsNum: 0,
			apiText: '',
			showErrorAnimation: false,
			hasError: false,
		};
	},
	methods: {
		updateTimer() { // обновление таймера
			const currentTime = new Date();
			const elapsedTime = currentTime - this.startTime;
			this.timer = this.formatTime(elapsedTime);
		},
		formatTime(time) { // преобразует миллисекунды в формат "мм:сс" (минуты:секунды).
			const minutes = Math.floor(time / 60000)
				.toString()
				.padStart(2, '0');
			const seconds = Math.floor((time % 60000) / 1000)
				.toString()
				.padStart(2, '0');
			return `${minutes}:${seconds}`;
		},
		calculateTypingSpeed() { // рассчитывает скорость набора текста в символах в минуту
			const words = this.typedText.trim().split(/\s+/);
			const totalCharacters = words.join('').length;
			const elapsedTime = (new Date() - this.startTime) / 60000;
			this.typingSpeed = Math.round(totalCharacters / elapsedTime);
			this.symbolsNum = this.getSymbolsNum();
		},
		getSymbolsNum() { //подсчет символов
			const originalText = this.apiText;
			const typedText = this.typedText;
			let count = 0;
			let i = 0;
			while (i < typedText.length && i < originalText.length) {
				if (typedText[i] === originalText[i]) {
					count++;
				} else {
					break;
				}
				i++;
			}
			return count;
		},
		checkTypedText() { //проверяет текст на ошибки и в случае ошибки вызывает анимацию
			if (!this.startTime) {
				this.startTime = new Date();
				this.timerInterval = setInterval(this.updateTimer, 1000);
			}
			const originalText = this.apiText;
			const typedText = this.typedText;
			let incorrectIndex = -1;
			for (let i = 0; i < typedText.length; i++) {
				if (typedText[i] !== originalText[i]) {
					incorrectIndex = i;
					break;
				}
			}
			if (incorrectIndex !== -1) {
				const preservedText = typedText.slice(0, incorrectIndex);
				const remainingText = typedText.slice(incorrectIndex + 1);
				this.typedText = preservedText + remainingText;
				// Добавляем класс `.error` к textarea
				this.addErrorClass();
				// Устанавливаем флаг showErrorAnimation в true
				this.showErrorAnimation = true;
				// Удаляем класс `.error` и сбрасываем флаг showErrorAnimation через 1 секунду
				setTimeout(() => {
					this.removeErrorClass();
					this.showErrorAnimation = false;
				}, 1000);
			}
			this.calculateTypingSpeed();
		},
		addErrorClass() { //добавляет класс ошибки
			this.hasError = true;
		},
		removeErrorClass() { //удаляет класс ошибки
			this.hasError = false;
		},
		replaceText() {
			axios
			.get('https://fish-text.ru/get')
			.then((response) => {
				this.apiText = response.data.text;
				this.typedText = ''; // Сброс введенного текста
				this.startTime = null; // Сброс времени
				this.timer = '00:00'; // Сброс таймера
				this.typingSpeed = 0; // Сброс скорости
				this.symbolsNum = 0; // Сброс количества символов
			})
			.catch((error) => {
				console.error(error);
			});
		},
	},
	mounted() {

		axios
			.get('https://fish-text.ru/get')  // при обращении к forismatic.com возникает ограничение по cors
			.then((response) => {
				this.apiText = response.data.text;
			})
			.catch((error) => {
				console.error(error);
			});

	}
};
</script>

<style lang="scss">
body {
	margin: 0;
	background: #8a8a8a;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
}

.typing-area {
	margin-bottom: 20px;
}

.typing-area::before {
	width: 100%;
	height: 2px;
	background: #111;
	content: "";
}


.replace-text-button {
	background-color: #4f4f4f;
	color: white;
	padding: 10px 20px;
	font-size: 16px;
	border: none;
	cursor: pointer;
	margin-bottom: 10px;
	transition: background-color 0.3s ease;
	width: 200px;
	margin: 0 auto;
	&:hover {
		background-color: #5f5f5f;
	}
}


.speed-test {
	padding: 20px;
	color: #fff;
	text-align: center;
	&-wrapper {
		display: flex;
		flex-direction: column;
		row-gap: 10px;
	}
	&__title {
		color: #111;
	}
}

.typing-area {
	display: flex;
	flex-direction: column;
	row-gap: 10px;
	align-items: center;
	&-timer {
		text-align: center;
		font-size: 20px;
		margin-top: 10px;
	}
}

textarea {
	width: 90%;
	height: 200px;
	font-size: 16px;
	resize: none;
	padding: 10px;
}

.results {
	text-align: center;
}

.error-animation {
	animation: shake 0.5s;
}

@keyframes shake {
	0% {
		transform: translate(1px, 1px) rotate(0deg);
	}
	10% {
		transform: translate(-1px, -2px) rotate(-1deg);
	}
	20% {
		transform: translate(-3px, 0px) rotate(1deg);
	}
	30% {
		transform: translate(3px, 2px) rotate(0deg);
	}
	40% {
		transform: translate(1px, -1px) rotate(1deg);
	}
	50% {
		transform: translate(-1px, 2px) rotate(-1deg);
	}
	60% {
		transform: translate(-3px, 1px) rotate(0deg);
	}
	70% {
		transform: translate(3px, 1px) rotate(-1deg);
	}
	80% {
		transform: translate(-1px, -1px) rotate(1deg);
	}
	90% {
		transform: translate(1px, 2px) rotate(0deg);
	}
	100% {
		transform: translate(1px, -2px) rotate(-1deg);
	}
}
</style>




