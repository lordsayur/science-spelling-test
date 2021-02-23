import { reactive } from 'vue';

const configuration = reactive({
  timerInitialValue: process.env.NODE_ENV === "test" ? 2 : 20,
  hiddenCharacter: 0
});

export const useConfiguration = () => {
  return {
    configuration
  }
}