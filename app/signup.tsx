import { AuthContext } from "@/contexts/auth-context";
import { Stack, useRouter } from "expo-router";;
import React, { useContext, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Button,
  Card,
  Text,
  TextInput,
  Checkbox,
} from "react-native-paper";

export default function Signup() {
  const { signUp } = useContext(AuthContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [agreeTerms, setAgreeTerms] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const onSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        "Error",
        "Please fill in all fields"
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Passwords do not match."
      );
      return;
    }

    if (!agreeTerms) {
      Alert.alert(
        "Terms Required",
        "Please accept the Terms & Conditions."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await signUp(
        trimmedEmail,
        password,
        trimmedName
      );

      if (res.ok) {
        Alert.alert(
          "Success",
          "Account created successfully!"
        );

        router.replace("/");
      } else {
        Alert.alert(
          "Signup Failed",
          res.message ||
            "Registration failed"
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
  showsVerticalScrollIndicator={false}
>
  <View style={styles.heroContainer}>
    <Image
      source={require("../assets/images/login-hero.png")}
      style={styles.heroImage}
      resizeMode="cover"
    />
  </View>


        <Card style={styles.card}>
  <Card.Content>

    <Text style={styles.title}>
      Create Account 👋
    </Text>

    <Text style={styles.subtitle}>
      Fill in the details to get started
    </Text>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              left={
                <TextInput.Icon icon="account-outline" />
              }
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              left={
                <TextInput.Icon icon="email-outline" />
              }
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
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
                    setShowPassword(
                      !showPassword
                    )
                  }
                />
              }
            />
<Text style={styles.passwordHint}>
  Password must be at least 6 characters
</Text>
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
              mode="outlined"
              secureTextEntry={
                !showConfirmPassword
              }
              style={styles.input}
              left={
                <TextInput.Icon icon="lock-check-outline" />
              }
              right={
                <TextInput.Icon
                  icon={
                    showConfirmPassword
                      ? "eye-off"
                      : "eye"
                  }
                  onPress={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                />
              }
            />

            <TouchableOpacity
              style={styles.termsRow}
              onPress={() =>
                setAgreeTerms(
                  !agreeTerms
                )
              }
            >
              <Checkbox
                status={
                  agreeTerms
                    ? "checked"
                    : "unchecked"
                }
              />

              <Text>
                I agree to the Terms &
                Conditions
              </Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={onSignup}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {loading
                ? "Creating Account..."
                : "Sign Up"}
            </Button>


<View style={styles.loginRow}>
  <Text style={styles.loginText}>
    Already have an account?
  </Text>

  <TouchableOpacity
    onPress={() => router.back()}
  >
    <Text style={styles.loginLink}>
      {" "}Login
    </Text>
  </TouchableOpacity> 
</View>
          </Card.Content>
        </Card>
        </ScrollView>
  </>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },

content: {
  paddingHorizontal: 16,
  paddingTop: -10,
},

heroContainer: {
  width: "100%",
  height: 190,
  marginTop: 15,
  marginBottom: 20,
},

heroImage: {
  width: "100%",
  height: "100%",
},

  title: {
  fontSize: 30,
  fontWeight: "900",
  color: "#0f172a",
  marginBottom: 4,
},

subtitle: {
  color: "#6b7280",
  fontSize: 15,
  marginBottom: 20,
},
card: {
  backgroundColor: "#fff",
  marginHorizontal: 12,
  marginTop: 0,
  borderRadius: 28,

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 4,
},

  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  passwordHint: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  button: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 14,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  orText: {
    marginHorizontal: 10,
    color: "#6b7280",
    fontSize: 14,
  },

  socialBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  socialText: {
    fontSize: 15,
    fontWeight: "600",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  loginText: {
    color: "#374151",
    fontSize: 15,
  },

  loginLink: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "700",
  },
});