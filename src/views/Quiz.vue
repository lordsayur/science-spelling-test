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
import { ref, computed, onMounted } from "vue";

import { useConfiguration } from "@composables/useConfiguration";
import { getQuizDetails } from "@composables/getQuizDetails";
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
    const { configuration } = useConfiguration();

    const wordIndex = ref(0);
    const counter = ref(0);
    const showCounter = ref(true);
    const counterFn = ref(null);
    const canClickNext = ref(false);
    const isFinished = ref(false);
    const checkCounter = ref(0);
    const score = ref({
      total: questions.value.length,
      actual: questions.value.length,
    });
    const message = ref("");

    const isHidden = computed(() => {
      return (index) => {
        let hidden = questions.value[wordIndex.value].hidden;
        return hidden.some((num) => num == index);
      };
    });

    const nextWord = () => {
      if (wordIndex.value == questions.value.length - 1) {
        isFinished.value = true;
      }
      if (!isFinished.value) timer();
      wordIndex.value++;
      checkCounter.value = 0;
      message.value = "";
      canClickNext.value = false;
    };

    const check = () => {
      if (
        Object.values(questions.value[wordIndex.value].answers).some(
          (answer) => answer == ""
        )
      ) {
        message.value = "Make sure fill all missing letters.. 😄";
        return false;
      }

      checkCounter.value++;

      questions.value[wordIndex.value].correctAnswers.forEach(
        (answer, index) => {
          let word = questions.value[wordIndex.value];
          questions.value[wordIndex.value].isCorrect[word.hidden[index]] =
            answer == word.answers[word.hidden[index]];
        }
      );

      let result = Object.values(
        questions.value[wordIndex.value].isCorrect
      ).every((correct) => correct);

      if (result) {
        message.value = "Yayy!! 🎉";
        clearInterval(counterFn.value);
        return result;
      }

      message.value = "Please try again.. 😃";
    };

    const randomizeHiddenLetters = () => {
      questions.value.forEach((question, index) => {
        const length = question.letters.length;
        const hiddenCount = Math.round(length / 3);
        let hiddenNumbers = [];
        for (let i = 0; i < hiddenCount; i++) {
          let number = Math.floor(Math.random() * length);
          hiddenNumbers.push(number);
        }
        questions.value[index].hidden = hiddenNumbers;
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

      questions.value.forEach((question, index) => {
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
        questions.value[index] = { ...question, ...obj };
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
      isHidden,
      nextWord,
      check,
      checkCounter,
      score,
      message,
      speak,
    };
  },
};
</script>

<style>
</style>
