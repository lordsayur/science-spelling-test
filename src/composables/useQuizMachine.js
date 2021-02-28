import { Machine, assign, interpret } from "xstate";
import { useService } from "@xstate/vue";

import QuizMachineEnum from '@enums/quizMachine';
import AudioMachineEnum from '@/enums/audioMachine';

const quizMachine = Machine({
  id: "quiz",
  type: "parallel",
  states: {
    quizState: {
      initial: QuizMachineEnum.state.STARTING,
      states: {
        starting: {
          on: {
            START: { target: QuizMachineEnum.state.ANSWERING }
          }
        },
        answering: {
          on: {
            CORRECT: QuizMachineEnum.state.QUESTION_FINISH,
            TIMEOUT: QuizMachineEnum.state.QUESTION_FINISH,
          },
        },
        questionFinish: {
          on: {
            NEXT_QUESTION: QuizMachineEnum.state.STARTING,
            COMPLETE: QuizMachineEnum.state.QUIZ_FINISH,
          },
        },
        quizFinish: {
          type: "final",
        },
      },
    },
    audioState: {
      initial: AudioMachineEnum.state.STOP,
      states: {
        [AudioMachineEnum.state.PLAYING]: {
          on: {
            [AudioMachineEnum.transition.END]: AudioMachineEnum.state.STOP,
          },
        },
        [AudioMachineEnum.state.STOP]: {
          on: {
            [AudioMachineEnum.transition.PLAY]: AudioMachineEnum.state.PLAYING,
          },
        },
      },
    },
  },
  actions: {
    startTimer: (context, event) => {
      let count = 20;
      let timer = setInterval(() => {
        count--;
        if (count < 1) {
          clearInterval(timer);
        }
      }, 1000);
    },
  },
});

const service = interpret(quizMachine);

export const useQuizMachine = () => {
  return {
    ...useService(service.start()),
    service
  }
}