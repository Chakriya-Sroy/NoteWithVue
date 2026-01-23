<script setup lang="ts">
import Button from "@/components/Button.vue";
import { useAuthStore } from "@/stores/auth";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { _ } from "vue-router/dist/router-CWoNjPRp.mjs";
import * as yup from "yup";

// Form Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email Format"),
  password: yup.string().min(8).required("Password is required"),
});

const {
  handleSubmit,
  errors,
  validate,
  values: state,
} = useForm({
  validationSchema: schema,
  initialValues: {
    email: "yaya@gmail.com",
    password: "12345678",
  },
});

const { value: email } = useField("email");
const { value: password } = useField("password");

const store = useAuthStore();

const router = useRouter();

const onSubmit = handleSubmit(async (value) => {
  store.login();
  router.push({ path: "/" });
});
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
        @submit.prevent="onSubmit"
        class="form flex flex-col gap-4"
        ref="form"
      >
        <div class="formfield flex flex-col gap-2">
          <label for="email" class="text-xs font-semibold">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            v-model="email"
            class="flex-1 border border-gray-100 rounded-md p-2"
          />
          <p class="text-red-500 text-xs" v-if="errors?.email">
            {{ errors?.email }}
          </p>
        </div>
        <div class="formfield flex flex-col gap-2">
          <label for="password" class="text-xs font-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
            class="flex-1 border border-gray-100 rounded-md p-2"
          />
          <p class="text-red-500 text-xs" v-if="errors?.password">
            {{ errors?.password }}
          </p>
        </div>
        <Button label="Signin"></Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
