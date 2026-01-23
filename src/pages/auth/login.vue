<script setup lang="ts">
import Button from "@/components/Button.vue";
import { ref } from "vue";
import * as yup from "yup";

// Form state
const state = ref({
  email: "",
  password: "",
});

const error = ref({
  email: "",
  password: "",
});

// Form Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email Format"),
  password: yup.string().min(8).required("Password is required"),
});

const handleSubmitForm = () => {};
</script>
<template>
  <div
    class="w-screen h-screen sm:bg-[url('/images/background.png')] bg-[#F7F3EB] bg-cover bg-center flex items-center justify-center"
  >
    <div
      class="bg-white p-4 rounded-xl shadow-lg w-full mx-4 sm:min-w-sm sm:max-w-sm min-h-[300px] flex flex-col gap-4"
    >
      <h1 class="font-semibold text-lg text-center">My Note Login</h1>
      <p class="text-xs text-center text-gray-500">
        Hey,Enter your credentials to sign in <br />
        into your account
      </p>
      <form
        @submit.prevent="handleSubmitForm"
        class="form flex flex-col gap-4"
        ref="form"
      >
        <div class="formfield flex flex-col gap-2">
          <label for="email" class="text-xs font-semibold">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            v-model="state.email"
            @input="
              (val: any) => {
                schema
                  .validateAt('email', { email: val.target?.value })
                  .then(() => {
                    error.email = '';
                  })
                  .catch((err) => {
                    error.email = err.message;
                  });
              }
            "
            class="flex-1 border border-gray-100 rounded-md p-2"
          />
          <p class="text-red-500 text-xs" v-if="error.email">
            {{ error.email }}
          </p>
        </div>
        <div class="formfield flex flex-col gap-2">
          <label for="password" class="text-xs font-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            v-model="state.password"
            @input="
              (val: any) => {
                schema
                  .validateAt('password', { password: val.target?.value })
                  .then(() => {
                    error.password = '';
                  })
                  .catch((err) => {
                    error.password = err.message;
                  });
              }
            "
            class="flex-1 border border-gray-100 rounded-md p-2"
          />
           <p class="text-red-500 text-xs" v-if="error.password">
            {{ error.password }}
          </p>
        </div>
        <Button label="Signin"></Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
