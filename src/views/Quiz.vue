<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl mt-10">⭐{{ quizDetials.title }}</h1>
    <div v-if="isFinished" class="flex flex-col items-center">
      <h1 class="text-4xl mt-10">
        Your Score is {{ score.actual }} / {{ score.total }}
      </h1>
      <button
        @click="$router.push('/')"
        class="m-20 p-4 border-2 border-yellow-300 rounded-lg bg-yellow-300"
      >
        Back to Main Menu
      </button>
    </div>
    <div v-else class="flex flex-col items-center justify-center">
      <p>Question {{ wordIndex + 1 }} / {{ questions.length }}</p>
      <p class="mt-2" v-show="showCounter">
        {{ counter }} second{{ counter < 2 ? "" : "s" }} left
      </p>
      <fieldset
        :disabled="canClickNext"
        class="flex justify-center flex-wrap items-center text-xl my-5"
      >
        <template v-for="(letter, index) in getLetters(wordIndex)" :key="index">
          <span v-if="isHidden(index)">
            <input
              :class="`${
                questions[wordIndex].isCorrect[index]
                  ? 'border-gray-900'
                  : 'border-red-500 animate__animated  animate__shakeX'
              } h-10 w-10 text-center m-1 border-4 rounded-lg`"
              type="text"
              maxlength="1"
              v-model="questions[wordIndex].answers[index]"
              @focus="questions[wordIndex].answers[index] = ''"
            />
          </span>
          <span v-else class="m-1">{{ letter }}</span>
        </template>
      </fieldset>
      <button v-show="!canClickNext" @click="speak" class="m-3">🔊</button>
      <div class="flex justify-center">
        <button
          @click="canClickNext = check()"
          v-show="checkCounter < 3 && !canClickNext"
          class="mx-2 p-2 border-2 border-yellow-300 rounded-lg"
        >
          Check
        </button>
        <button
          @click="nextWord"
          v-show="canClickNext"
          class="mx-2 p-4 border-2 border-yellow-300 rounded-lg bg-yellow-300"
        >
          {{ wordIndex == questions.length - 1 ? "Check Score" : "Next Word" }}
        </button>
      </div>
      <transition
        enter-active-class="animate__animated animate__heartBeat"
        leave-active-class="animate__animated animate__heartBeat"
      >
        <p v-show="message" id="message" class="m-5">
          {{ message }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from "vue";

import { useConfiguration } from "@composables/useConfiguration";
import { getQuizDetails } from "@composables/getQuizDetails";
import { useQuizMachine } from "@composables/useQuizMachine";
import { useSpeak } from "@composables/useSpeak";

import QuizMachineEnum from "@enums/quizMachine";
import AudioMachineEnum from "@enums/audioMachine";

export default {
  name: "Quiz",

  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },

  setup(props) {
    const { quizDetails, questions, getLetters } = getQuizDetails(props.id);
    const { state, send } = useQuizMachine();
    const { configuration } = useConfiguration();
    const { speakHuman } = useSpeak();

    const questionNumber = reactive({
      value: 0,
      get current() {
        return this.value + 1;
      },
      get index() {
        return this.value;
      },
      get isLast() {
        return this.value == questions.total - 1;
      },
      next() {
        this.value++;
      },
    });
    const timer = reactive({
      value: 0,
      display() {
        return `${this.value} second${this.value < 2 ? "" : "s"}`;
      },
      decrease() {
        this.value--;
      },
      reset() {
        this.value = configuration.timerInitialValue;
      },
      timesup() {
        return this.value <= 0;
      },
      timerFn: null,
      stopTimer() {
        clearInterval(this.timerFn);
      },
    });
    const message = reactive({
      value: "",
      reset() {
        this.value = "";
      },
      update(value) {
        this.value = value;
      },
      display() {
        return this.value;
      },
      isEmpty() {
        return this.value;
      },
    });
    const score = reactive({
      total: questions.total,
      actual: questions.total,
      deduct() {
        this.actual--;
      },
    });

    const isCurrentLetterHidden = computed(() => {
      return (currentLetter) => {
        let hiddenLetters = questions.getHiddenLetters(questionNumber.index);
        return hiddenLetters.some((letter) => letter == currentLetter);
      };
    });

    const nextWord = () => {
      message.reset();
      if (questionNumber.isLast) {
        send(QuizMachineEnum.transition.COMPLETE);
        return;
      }

      send(QuizMachineEnum.transition.NEXT_QUESTION);
      questionNumber.next();
      startTimer();
    };

    const check = () => {
      if (questions.isSomeAnswersMissing(questionNumber.index)) {
        message.update("Make sure fill all missing letters.. 😄");
        return;
      }

      questions
        .getCorrectAnswers(questionNumber.index)
        .forEach((answer, index) => {
          let question = questions.data[questionNumber.index];
          questions.getIsCorrect(questionNumber.index)[question.hidden[index]] =
            answer == question.answers[question.hidden[index]];
        });

      if (questions.isAllAnswersCorrect(questionNumber.index)) {
        message.value = "Yayy!! 🎉";
        timer.stopTimer();
        send(QuizMachineEnum.transition.CORRECT);
        return;
      }

      message.update("Please try again.. 😃");
    };

    const randomizeHiddenLetters = () => {
      questions.data.forEach((question, index) => {
        const length = question.letters.length;
        const hiddenCount = Math.round(length / 3);
        let hiddenNumbers = [];
        for (let i = 0; i < hiddenCount; i++) {
          let number = Math.floor(Math.random() * length);
          if (process.env.NODE_ENV === "test") {
            number = configuration.hiddenCharacter;
          }
          hiddenNumbers.push(number);
        }
        questions.data[index].hidden = hiddenNumbers;
      });
    };

    const generateMetaData = () => {
      /**
       * question skeleton
       * const question = {
       *   id: 1,
       *   letters: "Head",
       *   hidden: [1],
       *   correctAnswers: ["e"],
       *   answers: { 1: "" },
       *   isCorrect: { 1: false },
       * };
       */

      questions.data.forEach((question, index) => {
        let hiddenLetters = question.hidden;
        let obj = {
          correctAnswers: [],
          answers: {},
          isCorrect: {},
        };
        hiddenLetters.forEach((hiddenLetter) => {
          obj.correctAnswers.push(question.letters[hiddenLetter]);
          obj.answers[hiddenLetter] = "";
          obj.isCorrect[hiddenLetter] = true;
        });
        questions.data[index] = { ...question, ...obj };
      });
    };

    const timer = () => {
      counter.value = 20;
      counterFn.value = setInterval(() => {
        counter.value--;
        if (counter.value <= 0) {
          clearInterval(counterFn.value);
          message.value = "Sorry... ☹";
          score.value.actual--;
          canClickNext.value = true;
        }
      }, 1000);
    };

    const speak = () => {
      if (!("speechSynthesis" in window)) {
        message.value = "Sorry, your device do not know how to talk";
        return;
      }
      let text = new SpeechSynthesisUtterance();
      let voices = window.speechSynthesis.getVoices();
      text.voice = voices[3]; // Note: some voices don't support altering params
      text.voiceURI = "native";
      text.volume = 1; // 0 to 1
      text.rate = 0.7; // 0.1 to 10
      text.pitch = 1; //0 to 2
      text.text = questions.value[wordIndex.value].letters;
      text.lang = "en-US";
      window.speechSynthesis.speak(text);
    };

    onMounted(() => {
      timer();
    });

    randomizeHiddenLetters();
    generateMetaData();

    return {
      quizDetails,
      questions,
      getLetters,
      state,
      send,
      speakHuman,

      questionNumber,
      timer,
      message,
      score,

      isCurrentLetterHidden,
      nextWord,
      check,

      QuizMachineEnum,
      AudioMachineEnum,
    };
  },
};
</script>

<style>
</style>
