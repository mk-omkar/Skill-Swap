import { AuthContext } from "@/contexts/auth-context";
import { API_URL } from "@/constants/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  Chip,
  Text,
  TextInput,
  Title,
} from "react-native-paper";

export default function BookSession() {
  const { user } = useContext(AuthContext);

  const router = useRouter();
  const { offerId } = useLocalSearchParams();

  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [offeredSkill, setOfferedSkill] =
    useState("");

  const [notes, setNotes] =
    useState("");

  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const fetchOffer = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/skills/${offerId}`
      );

      const data =
        await response.json();

      setOffer(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      Alert.alert(
        "Error",
        "Please login first"
      );
      return;
    }

    if (
      String(offer.tutorId) ===
      String(user.id)
    ) {
      Alert.alert(
        "Not Allowed",
        "You cannot book your own skill."
      );
      return;
    }

    if (!offeredSkill.trim()) {
      Alert.alert(
        "Error",
        "Please enter a skill to offer in return."
      );
      return;
    }

    try {
      setSubmitting(true);

      const bookingsResponse =
        await fetch(
          `${API_URL}/api/bookings`
        );

      const bookings =
        await bookingsResponse.json();

      const alreadyRequested =
  bookings.find(
    (booking: any) =>
      String(
        booking.offerId
      ) === String(offer._id) &&
      String(
        booking.learnerId
      ) === String(user.id) &&
      booking.status !==
        "rejected"
  );

      if (alreadyRequested) {
        Alert.alert(
          "Already Requested",
          "You already sent a request for this skill."
        );

        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/bookings/create`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              offerId: offer._id,
              offerTitle:
                offer.title,

              tutorId:
                offer.tutorId,

              tutorName:
                offer.tutorName,

              learnerId:
                user.id,

              learnerName:
                user.name,

              offeredSkill:
                offeredSkill.trim(),

              notes,

              scheduledAt:
                new Date(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        Alert.alert(
          "Error",
          data.error ||
            "Failed to create booking"
        );

        return;
      }

      Alert.alert(
        "Success",
        "Booking request sent successfully"
      );

      router.back();
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Cannot connect to server"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.center}>
        <Text>Offer not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Title style={styles.title}>
          Book Session
        </Title>

        <Text style={styles.subtitle}>
          Request a skill exchange
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text
              style={styles.offerTitle}
            >
              {offer.title}
            </Text>

            <Text
              style={
                styles.description
              }
            >
              {offer.description}
            </Text>

            <Chip
              style={
                styles.categoryChip
              }
            >
              {offer.category}
            </Chip>

            <Text style={styles.info}>
              Tutor:{" "}
              {offer.tutorName}
            </Text>

            <Text style={styles.info}>
              Level:{" "}
              {offer.level}
            </Text>

            <Text style={styles.info}>
              Duration:{" "}
              {
                offer.durationType
              }
            </Text>

            <Text style={styles.info}>
              Time:{" "}
              {offer.startTime}
              {" - "}
              {offer.endTime}
            </Text>

            <Text
              style={
                styles.sectionTitle
              }
            >
              Available Days
            </Text>

            <View
              style={
                styles.chipContainer
              }
            >
              {offer.availableSlots?.map(
                (
                  day: string,
                  index: number
                ) => (
                  <Chip
                    key={index}
                    style={
                      styles.activeChip
                    }
                  >
                    {day}
                  </Chip>
                )
              )}
            </View>

            <Text style={styles.sectionTitle}>
  Choose A Skill To Exchange
</Text>

<View style={styles.chipContainer}>
  {offer.skillsWanted?.length > 0 ? (
    offer.skillsWanted.map(
      (
        skill: string,
        index: number
      ) => (
        <Chip
          key={index}
          selected={
            offeredSkill === skill
          }
          onPress={() =>
            setOfferedSkill(skill)
          }
          style={
            offeredSkill === skill
              ? styles.selectedChip
              : styles.activeChip
          }
          textStyle={
            offeredSkill === skill
              ? { color: "#fff" }
              : undefined
          }
        >
          {skill}
        </Chip>
      )
    )
  ) : (
    <Text>
      Tutor did not specify
      skills wanted
    </Text>
  )}
</View>

<View style={styles.selectedSkillBox}>
  <Text style={styles.selectedSkillLabel}>
    Selected Exchange Skill
  </Text>

  <Text style={styles.selectedSkillValue}>
    {offeredSkill || "Tap a skill above"}
  </Text>
</View>

            <TextInput
              mode="outlined"
              label="Message To Tutor"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={
                handleBooking
              }
              loading={
                submitting
              }
              disabled={
                submitting
              }
              style={styles.button}
            >
              Send Request
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#f8fafc",
    },

    content: {
      padding: 20,
    },

    center: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#2563eb",
    },

    subtitle: {
      color: "#64748b",
      marginBottom: 20,
    },

    card: {
      borderRadius: 24,
    },

    offerTitle: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 10,
    },

    description: {
      color: "#64748b",
      marginBottom: 10,
    },

    categoryChip: {
      alignSelf: "flex-start",
      marginBottom: 12,
    },

    info: {
      marginBottom: 6,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginTop: 15,
      marginBottom: 10,
    },

    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 10,
    },

    activeChip: {
      backgroundColor:
        "#dbeafe",
    },

    input: {
      marginTop: 10,
      backgroundColor:
        "#fff",
    },

    button: {
      marginTop: 20,
      borderRadius: 14,
      backgroundColor:
        "#2563eb",
    },
selectedChip: {
  backgroundColor: "#2563eb",
  borderColor: "#2563eb",
},

selectedText: {
  marginTop: 10,
  marginBottom: 10,
  fontWeight: "600",
},
selectedSkillBox: {
  marginTop: 12,
  marginBottom: 15,
  padding: 14,
  borderRadius: 14,
  backgroundColor: "#eff6ff",
  borderWidth: 1,
  borderColor: "#bfdbfe",
},

selectedSkillLabel: {
  fontSize: 12,
  color: "#64748b",
  marginBottom: 4,
},

selectedSkillValue: {
  fontSize: 16,
  fontWeight: "700",
  color: "#2563eb",
},
  }); 