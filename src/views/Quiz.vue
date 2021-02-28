<template>
  <div class="flex flex-col items-center">
    <!-- Debug Section -->
    <Debug>state: {{ state.value.quizState }}</Debug>
    <h1 class="text-2xl mt-10">⭐{{ quizDetails.title }}</h1>

    <!-- Finish Quiz Message -->
    <div
      v-if="state.matches(`quizState.${QuizMachineEnum.state.QUIZ_FINISH}`)"
      class="flex flex-col items-center"
    >
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
    <!-- Quiz Question Content -->
    <div v-else class="flex flex-col items-center justify-center">
      <!-- Question Number -->
      <p id="question-number">
        Question {{ questionNumber.current }} / {{ questions.total }}
      </p>
      <!-- Letters -->
      <transition-group
        tag="fieldset"
        :disabled="
          state.matches(`quizState.${QuizMachineEnum.state.QUESTION_FINISH}`)
        "
        class="flex justify-center flex-wrap items-center text-xl my-5"
        mode="out-in"
        appear
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <template v-for="(letter, index) in getLetters(questionNumber.index)">
          <span
            v-if="isCurrentLetterHidden(index)"
            :data-index="index"
            :key="`${questionNumber.index}.${index}`"
          >
            <input
              :class="`${
                questions.getIsCorrect(questionNumber.index)[index]
                  ? 'border-gray-900'
                  : 'border-red-500 animate__animated  animate__shakeX'
              } h-10 w-10 text-center m-1 border-4 rounded-lg`"
              type="text"
              maxlength="1"
              v-model="questions.data[questionNumber.index].answers[index]"
              @focus="questions.data[questionNumber.index].answers[index] = ''"
            />
          </span>
          <span
            v-else
            class="m-1"
            :data-index="index"
            :key="`${questionNumber.index}.${index}`"
          >
            {{ letter }}</span
          >
        </template>
      </transition-group>
      <!-- Ansering Actions -->
      <div
        v-if="
          [
            QuizMachineEnum.state.STARTING,
            QuizMachineEnum.state.ANSWERING,
          ].includes(state.value.quizState)
        "
      >
        <!-- Check button -->
        <button
          id="checkBtn"
          @click="check"
          class="mx-2 p-2 border-2 border-yellow-300 rounded-lg"
        >
          Check
        </button>
        <!-- Speak button -->
        <button
          @click="
            speakSynthetic(send, questions.data[questionNumber.index].letters)
          "
          :disabled="
            state.matches(`audioState.${AudioMachineEnum.state.PLAYING}`)
          "
          class="m-3"
        >
          🔊
          {{
            state.matches(`audioState.${AudioMachineEnum.state.PLAYING}`)
              ? "..."
              : ""
          }}
        </button>
      </div>
      <!-- Next button -->
      <button
        id="nextBtn"
        @click="nextWord"
        :disabled="
          state.matches(`audioState.${AudioMachineEnum.state.PLAYING}`)
        "
        v-if="
          state.matches(`quizState.${QuizMachineEnum.state.QUESTION_FINISH}`)
        "
        class="mx-2 p-2 border-2 border-yellow-300 rounded-lg bg-yellow-300"
      >
        {{ questionNumber.isLast ? "Check Score" : "Next Word" }}
      </button>
      <!-- Timer -->
      <p class="mt-2">{{ timer.display() }}</p>
      <!-- Message -->
      <transition
        enter-active-class="animate__animated animate__heartBeat"
        leave-active-class="animate__animated animate__heartBeat"
      >
        <p v-show="message.isEmpty()" id="message" class="m-5">
          {{ message.display() }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, reactive } from "vue";

import { useConfiguration } from "@composables/useConfiguration";
import { getQuizDetails } from "@composables/getQuizDetails";
import { useQuizMachine } from "@composables/useQuizMachine";
import { useSpeak } from "@composables/useSpeak";

import QuizMachineEnum from "@enums/quizMachine";
import AudioMachineEnum from "@enums/audioMachine";

import Debug from "@/components/Debug";

export default {
  name: "Quiz",

  components: { Debug },

  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },

  setup(props) {
    const { quizDetails, questions, getLetters } = getQuizDetails(props.id);
    const { state, send, service } = useQuizMachine();
    const { configuration } = useConfiguration();
    const { speakSynthetic } = useSpeak();

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
      value: configuration.timerInitialValue,
      display() {
        if (
          state.value.matches(`quizState.${QuizMachineEnum.state.STARTING}`)
        ) {
          return "Ready...";
        }
        return `${this.value} second${this.value < 2 ? "" : "s"} left`;
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
            number = configuration.hiddenCharacter[i];
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

    const startTimer = () => {
      timer.reset();
      timer.timerFn = setInterval(() => {
        timer.decrease();
        if (timer.timesup()) {
          timer.stopTimer();
          message.update("Sorry... ☹");
          send(QuizMachineEnum.transition.TIMEOUT);
          score.deduct();
        }
      }, 1000);
    };

    const beforeEnter = (el) => {
      el.classList.add("invisible");
    };

    const enter = (el, done) => {
      questions
        .getLetters(questionNumber.index)
        .split("")
        .forEach((letter, index) => {
          setTimeout(() => {
            el.classList.remove("invisible");
            el.classList.add("animate__animated", "animate__bounceInRight");
          }, el.dataset.index * configuration.letterAnimationDelay);
          if (index == questions.getTotalLetters(questionNumber.index) - 1)
            el.addEventListener("animationend", done);
        });
    };

    const afterEnter = (el) => {
      el.classList.remove("animate__animated", "animate__bounceInRight");

      if (
        el.dataset.index !=
        questions.getTotalLetters(questionNumber.index) - 1
      ) {
        return;
      }
      send(QuizMachineEnum.transition.START);
      startTimer();
    };

    randomizeHiddenLetters();
    generateMetaData();

    onBeforeUnmount(() => {
      timer.stopTimer();
      service.stop();
    });

    return {
      quizDetails,
      questions,
      getLetters,
      state,
      send,
      speakSynthetic,

      questionNumber,
      timer,
      message,
      score,

      isCurrentLetterHidden,
      nextWord,
      check,

      QuizMachineEnum,
      AudioMachineEnum,

      beforeEnter,
      enter,
      afterEnter,
    };
  },
};
</script>

<style>
</style>
