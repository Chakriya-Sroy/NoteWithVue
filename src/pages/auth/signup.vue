<script setup lang="ts">
import Button from "@/components/Button.vue";
import { customToastPlugin } from "@/plugins/useToast";
import { useAuthStore } from "@/stores/auth";
import type { CustomResponse, User } from "@/types";
import { getToken, setToken } from "@/utils/useCookie";
import { Eye, EyeClosed, EyeOff } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useField, useFieldError, useForm } from "vee-validate";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";

// Form Schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required").min(1),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email Format"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .min(8, "Confirm Password must be at least 8 characters")
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),
});
const {
  handleSubmit,
  errors,
  validate,
  values: state,
  setFieldError,
  resetField,
  meta,
} = useForm({
  validationSchema: schema,
  initialValues: {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  },
});

const { value: username, errorMessage: usernameError } = useField("username");
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: confirm_password } = useField("confirm_password");

const store = useAuthStore();

const router = useRouter();

const { success, error } = customToastPlugin();

const loading = ref(false);

const { user } = storeToRefs(store);

const { signin, getProfile } = store;

const fetchUserProfile = async () => {
  const token = getToken();
  if (!token) return;
  const res = (await getProfile()) as CustomResponse<User>;
  if (res?.status?.success) {
    user.value = res?.data;
  }
};

const onSubmit = handleSubmit(async (value) => {
  try {
    loading.value = true;
    const res = (await signin(value)) as any;
    if (res?.status?.success) {
      setToken(res?.data?.accessToken);
      await fetchUserProfile();
      setTimeout(() => {
        router.push({ path: "/" });
        success(res?.status?.message);
      }, 100);
    }
    loading.value = false;
  } catch (err: any) {
    loading.value = false;
    error(err?.message || "Login Failed");
  }
});
const togglePassword = ref(true);
const toggleConfirmPassword = ref(true);
</script>
<template>
  <div
    class="w-screen h-screen sm:bg-[url('/images/background.png')] bg-[#F7F3EB] bg-cover bg-center flex items-center justify-center"
  >
    <div
      class="bg-white p-4 rounded-xl shadow-lg w-full mx-4 sm:min-w-sm sm:max-w-sm min-h-[300px] flex flex-col gap-4"
    >
      <h1 class="font-semibold text-lg text-center">My Note Signup</h1>
      <p class="text-xs text-center text-gray-500">
        Welcome! Enter your details to sign up <br />
        and start using your account
      </p>
      <form
        @submit.prevent="onSubmit"
        class="form flex flex-col gap-4"
        ref="form"
      >
        <div class="formfield flex flex-col gap-2">
          <label for="email" class="text-xs font-semibold">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            v-model="username"
            class="flex-1 border border-gray-100 rounded-md p-2"
            @blur="setFieldError('username', undefined)"
          />
          <p class="text-red-500 text-xs" v-if="errors?.username">
            {{ errors?.username }}
          </p>
        </div>
        <div class="formfield flex flex-col gap-2">
          <label for="email" class="text-xs font-semibold">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            v-model="email"
            @blur="setFieldError('email', undefined)"
            class="flex-1 border border-gray-100 rounded-md p-2"
          />
          <p class="text-red-500 text-xs" v-if="errors?.email">
            {{ errors?.email }}
          </p>
        </div>
        <div class="formfield flex flex-col gap-2">
          <label for="password" class="text-xs font-semibold">Password</label>
          <div class="relative flex-1 h-auto">
            <input
              :type="togglePassword ? 'password' : 'text'"
              name="password"
              placeholder="Password"
              v-model="password"
              class="w-full border border-gray-100 rounded-md p-2"
              @blur="setFieldError('password', undefined)"
            />
            <EyeOff
              :size="20"
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              @click="togglePassword = !togglePassword"
              v-if="togglePassword === true"
            />
            <Eye
              :size="20"
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              @click="togglePassword = !togglePassword"
              v-else
            />
          </div>
          <p class="text-red-500 text-xs" v-if="errors?.password">
            {{ errors?.password }}
          </p>
        </div>
        <div class="formfield flex flex-col gap-2">
          <label for="password" class="text-xs font-semibold"
            >Confirm Password</label
          >
          <div class="relative flex-1 h-auto">
            <input
              :type="toggleConfirmPassword ? 'password' : 'text'"
              name="confirm_password"
              placeholder="Confirm Password"
              v-model="confirm_password"
              class="w-full border border-gray-100 rounded-md p-2"
              @blur="setFieldError('confirm_password', undefined)"
            />
            <EyeOff
              :size="20"
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              @click="toggleConfirmPassword = !toggleConfirmPassword"
              v-if="toggleConfirmPassword === true"
            />
            <Eye
              :size="20"
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              @click="toggleConfirmPassword = !toggleConfirmPassword"
              v-else
            />
          </div>
          <p class="text-red-500 text-xs" v-if="errors?.confirm_password">
            {{ errors?.confirm_password }}
          </p>
        </div>
        <Button :label="loading ? 'Signup...' : 'Signup'"></Button>
      </form>
      <div class="flex items-center gap-4">
        <div class="flex-1 border-t border-gray-300"></div>
        <p class="text-center">or</p>
        <div class="flex-1 border-t border-gray-300"></div>
      </div>
      <div class="flex flex-row justify-center items-center">
        <p class="font-normal text-gray-500 text-sm">Already have an account</p>
        <Button
          label="Signin"
          variant="link"
          color="primary"
          @click="router.replace('/auth/login')"
        ></Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
