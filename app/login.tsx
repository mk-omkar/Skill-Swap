import { AuthContext } from "@/contexts/auth-context";
import {
  Stack,
  useRouter,
} from "expo-router";
import React, {
  useState,
  useContext,
} from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Checkbox,
} from "react-native-paper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
const { signIn } = useContext(AuthContext);

const onLogin = async () => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password) {
    Alert.alert(
      "Error",
      "Please enter email and password"
    );
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    Alert.alert(
      "Invalid Email",
      "Please enter a valid email address"
    );
    return;
  }

  if (password.length < 6) {
    Alert.alert(
      "Invalid Password",
      "Your password must contain at least 6 characters."
    );
    return;
  }

  setLoading(true);

  try {
    const res = await signIn(
      trimmedEmail,
      password
    );

    if (res.ok) {
      router.replace("/");
    } else {
      Alert.alert(
        "Login Failed",
        res.message ||
          "Invalid credentials"
      );
    }
  } catch {
    Alert.alert(
      "Error",
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO IMAGE */}

        <View style={styles.heroContainer}>
          <Image
            source={require("../assets/images/login-hero.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* LOGIN CARD */}

        <View style={styles.card}>
          <Text style={styles.welcome}>
            Welcome Back! 👋
          </Text>

          <Text style={styles.subtitle}>
            Login to continue your journey
          </Text>

          <TextInput
  mode="outlined"
  label="Email"
  value={email}
  onChangeText={setEmail}
  autoCapitalize="none"
  keyboardType="email-address"
  autoCorrect={false}
  textContentType="emailAddress"
  left={
    <TextInput.Icon icon="email-outline" />
  }
  style={styles.input}
/>

          <TextInput
  mode="outlined"
  label="Password"
  value={password}
  textContentType="password"
  onChangeText={setPassword}
  secureTextEntry={!showPassword}
  autoCorrect={false}
  left={
    <TextInput.Icon icon="lock-outline" />
  }
  right={
    <TextInput.Icon
      icon={
        showPassword
          ? "eye-off"
          : "eye"
      }
      onPress={() =>
        setShowPassword(!showPassword)
      }
    />
  }
  style={styles.input}
/>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() =>
                setRememberMe(
                  !rememberMe
                )
              }
            >
              <Checkbox
                status={
                  rememberMe
                    ? "checked"
                    : "unchecked"
                }
              />
              <Text>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity
  onPress={() =>
    Alert.alert(
      "Coming Soon",
      "Forgot password is not implemented yet."
    )
  }
>
  <Text style={styles.forgot}>
    Forgot Password?
  </Text>
</TouchableOpacity>
          </View>

          <Button
  mode="contained"
  onPress={onLogin}
  loading={loading}
  disabled={loading}
  style={styles.loginBtn}
  contentStyle={{
    height: 52,
  }}
>
  {loading ? "Signing In..." : "Login"}
</Button>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>
              OR
            </Text>
            <View style={styles.line} />
          </View>

     <TouchableOpacity
  style={styles.socialBtn}
  onPress={() =>
    Alert.alert(
      "Coming Soon",
      "Google Sign In is not implemented yet."
    )
  }
>
  <Text style={styles.socialText}>
    Continue with Google
  </Text>
</TouchableOpacity>
          <TouchableOpacity
  style={styles.socialBtn}
  onPress={() =>
    Alert.alert(
      "Coming Soon",
      "Apple Sign In is not implemented yet."
    )
  }
>
  <Text style={styles.socialText}>
    Continue with Apple
  </Text>
</TouchableOpacity>
          <View style={styles.signupRow}>
  <Text>
    Don't have an account?
  </Text>

  <TouchableOpacity
    onPress={() => router.push("/signup")}
  >
    <Text style={styles.signup}>
      {" "}Sign Up
    </Text>
  </TouchableOpacity>
</View>
        </View>

        <Text style={styles.footer}>
          🔒 Your data is safe and secure
          with us.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },

  heroContainer: {
    width: "100%",
    height: 190,
    marginTop: 15,
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

card: {
  backgroundColor: "#fff",
  marginHorizontal: 16,
  marginTop: 20,
  borderRadius: 28,
  padding: 20,

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 6,
},

  welcome: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f172a",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: 15,
    marginBottom: 15,
  },

  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  forgot: {
    color: "#2563eb",
    fontWeight: "600",
  },

  loginBtn: {
    borderRadius: 16,
    backgroundColor: "#2563eb",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  orText: {
    marginHorizontal: 10,
    color: "#6b7280",
  },

  socialBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  socialText: {
    fontWeight: "600",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },

  signup: {
    color: "#2563eb",
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 15,
    marginBottom: 15,
    fontSize: 12,
  },
});