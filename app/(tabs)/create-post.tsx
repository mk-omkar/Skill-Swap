// app/(tabs)/create.tsx

import { AuthContext } from "@/contexts/auth-context";
import { API_URL } from "@/constants/api";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text, TextInput, Title } from "react-native-paper";

const CATEGORIES = [
  "Programming",
  "Music",
  "Art",
  "Fitness",
  "Language",
  "Business",
  "Other",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const DURATIONS = ["3 Days", "7 Days", "15 Days", "1 Month", "Custom"];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CreatePost() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [skillWantedInput, setSkillWantedInput] = useState("");

  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);

  const [category, setCategory] = useState("Programming");

  const [level, setLevel] = useState("Beginner");

  const [durationType, setDurationType] = useState("7 Days");

  const [customDays, setCustomDays] = useState("");

  const [startTime, setStartTime] = useState("06:00 PM");

  const [endTime, setEndTime] = useState("07:00 PM");

  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Wed",
    "Fri",
  ]);

  const [loading, setLoading] = useState(false);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const addSkillWanted = () => {
    if (!skillWantedInput.trim()) return;

    if (skillsWanted.length >= 5) {
      Alert.alert("Limit Reached", "You can add maximum 5 skills.");
      return;
    }

    if (skillsWanted.includes(skillWantedInput.trim())) {
      Alert.alert("Duplicate Skill", "Skill already added.");
      return;
    }

    setSkillsWanted([...skillsWanted, skillWantedInput.trim()]);

    setSkillWantedInput("");
  };

  const removeSkillWanted = (index: number) => {
    setSkillsWanted(skillsWanted.filter((_, i) => i !== index));
  };

  const onPost = async () => {
    console.log({
    skillsWanted,
    startTime,
    endTime,
  });
    if (!title.trim() || !description.trim() || skillsWanted.length === 0) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert("Error", "Select at least one day");
      return;
    }

    if (durationType === "Custom" && !customDays) {
      Alert.alert("Error", "Enter custom duration");
      return;
    }

    if (!user) {
      Alert.alert("Error", "Login required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/skills/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  title: title.trim(),
  description: description.trim(),

  category,

  tutorId: user.id,
  tutorName: user.name,

  skillsWanted,

  level,

  durationType,

  customDays:
    durationType === "Custom"
      ? Number(customDays)
      : null,

  startTime,
  endTime,

  availableSlots: selectedDays,
}),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to create skill");
        return;
      }

      Alert.alert("Success", "Skill offer created successfully");

      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to create offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Title style={styles.title}>Create Skill Offer</Title>

        <Text style={styles.subtitle}>
          Share your expertise with the community
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Skill Title *"
              mode="outlined"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              outlineColor="#d1d5db"
              activeOutlineColor="#2563eb"
            />

            <TextInput
              label="Description *"
              mode="outlined"
              multiline
              numberOfLines={5}
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              outlineColor="#d1d5db"
              activeOutlineColor="#2563eb"
            />

            {/* SKILLS WANTED */}

            <Text style={styles.section}>Skills Wanted *</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <TextInput
                label="Add Skill"
                mode="outlined"
                value={skillWantedInput}
                onChangeText={setSkillWantedInput}
                style={{
                  flex: 1,
                }}
              />

              <Button
                mode="contained"
                onPress={addSkillWanted}
                style={{
                  marginLeft: 8,
                }}
              >
                Add
              </Button>
            </View>

            <View style={styles.chipContainer}>
              {skillsWanted.map((skill, index) => (
                <Chip
                  key={index}
                  onClose={() => removeSkillWanted(index)}
                  style={styles.activeChip}
                >
                  {skill}
                </Chip>
              ))}
            </View>
            {/* CATEGORY */}

            <Text style={styles.section}>Category</Text>

            <View style={styles.chipContainer}>
              {CATEGORIES.map((item) => (
                <Chip
                  key={item}
                  selected={category === item}
                  onPress={() => setCategory(item)}
                  style={category === item ? styles.activeChip : styles.chip}
                >
                  {item}
                </Chip>
              ))}
            </View>

            {/* LEVEL */}

            <Text style={styles.section}>Skill Level</Text>

            <View style={styles.chipContainer}>
              {LEVELS.map((item) => (
                <Chip
                  key={item}
                  selected={level === item}
                  onPress={() => setLevel(item)}
                  style={level === item ? styles.activeChip : styles.chip}
                >
                  {item}
                </Chip>
              ))}
            </View>

            {/* DURATION */}

            <Text style={styles.section}>Program Duration</Text>

            <View style={styles.chipContainer}>
              {DURATIONS.map((item) => (
                <Chip
                  key={item}
                  selected={durationType === item}
                  onPress={() => setDurationType(item)}
                  style={
                    durationType === item ? styles.activeChip : styles.chip
                  }
                >
                  {item}
                </Chip>
              ))}
            </View>

            {durationType === "Custom" && (
              <TextInput
                label="Custom Days"
                mode="outlined"
                keyboardType="numeric"
                value={customDays}
                onChangeText={setCustomDays}
                style={styles.input}
                outlineColor="#d1d5db"
                activeOutlineColor="#2563eb"
              />
            )}

            {/* DAILY TIMING */}

            <Text style={styles.section}>Daily Timing</Text>

            <View style={styles.row}>
              <TextInput
                label="Start Time"
                mode="outlined"
                value={startTime}
                onChangeText={setStartTime}
                style={styles.halfInput}
              />

              <TextInput
                label="End Time"
                mode="outlined"
                value={endTime}
                onChangeText={setEndTime}
                style={styles.halfInput}
              />
            </View>

            {/* AVAILABLE DAYS */}

            <Text style={styles.section}>Available Days</Text>

            <View style={styles.chipContainer}>
              {DAYS.map((day) => (
                <Chip
                  key={day}
                  selected={selectedDays.includes(day)}
                  onPress={() => toggleDay(day)}
                  style={
                    selectedDays.includes(day) ? styles.activeChip : styles.chip
                  }
                >
                  {day}
                </Chip>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={onPost}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor="#2563eb"
            >
              Create Offer
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  content: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2563eb",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: 20,
    fontSize: 15,
  },

  card: {
    borderRadius: 24,
    backgroundColor: "#ffffff",
    elevation: 3,
  },

  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  section: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 8,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },

  chip: {
    backgroundColor: "#f1f5f9",
  },

  activeChip: {
    backgroundColor: "#dbeafe",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  halfInput: {
    width: "48%",
    backgroundColor: "#fff",
  },

  button: {
    marginTop: 20,
    borderRadius: 30,
    paddingVertical: 6,
  },
});
