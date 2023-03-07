<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";

const num1 = ref("");
const num2 = ref("");
const op = ref("");
const result = ref("");
const calcState = ref("success");
const history = ref([]);

let errorTimeout;

onMounted(async () => {
  try {
    const { data } = await axios.get("/history/10", {
      baseURL: import.meta.env.VITE_API_BASE,
    });
    history.value = data;
  } catch (error) {
    console.log("failed to get history");
  }
});

async function handleCalculate() {
  calcState.value = "loading";

  const firstNumber = getNumber(num1.value);
  const secondNumber = getNumber(num2.value);
  const operator = getOperator(op.value);

  console.log("values", firstNumber, secondNumber, operator);

  if (Number.isNaN(firstNumber) || Number.isNaN(secondNumber) || !operator) {
    result.value = "";
    alertError();
    return;
  }

  try {
    const { data } = await axios.post(
      "/calculate",
      { firstNumber, secondNumber, operator },
      { baseURL: import.meta.env.VITE_API_BASE }
    );
    result.value = data.result;
    history.value.length === 10 && history.value.shift();
    history.value.push(data);
    num1.value = "";
    num2.value = "";
    op.value = "";
    calcState.value = "success";
  } catch (error) {
    result.value = "";
    alertError();
  }
}

function getNumber(str) {
  console.log("before", str);
  let number = str.trim();
  if (number === "") return NaN;
  number = Number(number);
  console.log("after", number);
  if (!Number.isFinite(number)) return NaN;
  return number;
}

function getOperator(str) {
  let operator = str.trim().toLowerCase();
  if (["+", "-", "x", "/"].includes(operator)) return operator;
  return null;
}

function alertError() {
  clearTimeout(errorTimeout);
  calcState.value = "error";
  errorTimeout = setTimeout(() => {
    calcState.value = "success";
  }, 3000);
}
</script>

<template>
  <div
    class="w-100 max-w-lg bg-white mx-auto min-h-screen max-h-screen pb-3 overflow-y-auto"
  >
    <h1
      class="h-10 flex justify-center items-center border-b border-b-gray-300 py-0.5 text-sm font-semibold"
    >
      <span class="text-lg">Group 4 CalcApp </span>
      <span
        v-if="calcState === 'error'"
        class="uppercase text-red-500 font-bold"
      >
         - An error occured</span
      >
    </h1>
    <div
      class="h-24 bg-gray-100 text-3xl font-light flex justify-end items-end text-right p-1 overflow-y-auto"
    >
      {{ result }}
    </div>
    <div class="flex flex-col p-4 gap-5">
      <input
        type="text"
        placeholder="First Number"
        v-model="num1"
        :disabled="calcState === 'loading'"
        class="border border-gray-600 p-2 text-center placeholder:font-light text-lg focus:outline-blue-500"
      />
      <input
        type="text"
        placeholder="Operator"
        v-model="op"
        :disabled="calcState === 'loading'"
        class="border border-gray-600 p-2 text-center placeholder:font-light text-lg focus:outline-blue-500"
      />
      <input
        type="text"
        placeholder="Second Number"
        v-model="num2"
        :disabled="calcState === 'loading'"
        class="border border-gray-600 p-2 text-center placeholder:font-light text-lg focus:outline-blue-500"
      />
    </div>

    <button
      type="button"
      @click="handleCalculate"
      :disabled="calcState === 'loading'"
      class="w-full max-w-xs mx-auto mb-3 flex justify-center items-center py-1 bg-purple-600 text-white font-semibold text-lg disabled:bg-blue-300"
    >
      {{ calcState === "loading" ? "Calculating" : "Calculate" }}
    </button>

    <h1
      class="text-center border-b border-b-gray-300 py-0.5 text-sm font-semibold"
    >
      History
    </h1>
    <div class="p-4 flex flex-col-reverse gap-5 overflow-y-auto">
      <div v-for="operation in history" class="flex flex-col">
        <div class="flex border border-gray-300">
          <div class="p-2 bg-gray-300 flex items-center">
            {{ operation.firstNumber }} {{ operation.operator }}
            {{ operation.secondNumber }} =
          </div>
          <div class="p-2 text-lg flex-1 flex justify-end items-center">
            {{ operation.result }}
          </div>
        </div>
        <div class="text-xs ml-auto bg-gray-300  p-0.5">
          {{ dayjs(operation.date).format("D MMM YYYY - h:mma") }}
        </div>
      </div>
    </div>
  </div>
</template>
