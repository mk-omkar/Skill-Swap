import { AuthContext } from '@/contexts/auth-context';
import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import React, { useContext } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, IconButton, Text } from 'react-native-paper';
import { Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '@/constants/api';
import { useEffect, useState } from 'react';

export default function OfferDetails() {
  const { user } = useContext(AuthContext);
  const { offerId } = useLocalSearchParams();
  useEffect(() => {
  fetchOffer();
}, [offerId]);

const fetchOffer = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/skills/${offerId}`
    );

    const data = await response.json();

    setOffer(data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
  const router = useRouter();
  const [offer, setOffer] = useState<any>(null);
const [loading, setLoading] = useState(true);


if (loading) {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

if (!offer) {
  return (
    <View style={styles.container}>
      <Text>Offer not found</Text>
    </View>
  );
}
const isOwner =
  user &&
  user.id === offer.tutorId;

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

    <View style={styles.content}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>
          {offer.title}
        </Text>

        <Chip style={styles.categoryChip}>
          {offer.category}
        </Chip>

        <Text style={styles.tutor}>
          By {offer.tutorName}
        </Text>
        <Text style={styles.levelText}>
  {offer.level} Level
</Text>
      </View>
            <View style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>
          About this Skill
        </Text>

        <Text style={styles.description}>
          {offer.description}
        </Text>
      </View>

<View style={styles.detailCard}>

  <Text style={styles.detailsHeading}>
    Offer Details
  </Text>

  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>
      Duration
    </Text>

    <Text style={styles.detailValue}>
      {offer.durationType}
    </Text>
  </View>

  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>
      Timing
    </Text>

    <Text style={styles.detailValue}>
      {offer.startTime} - {offer.endTime}
    </Text>
  </View>

  <Text style={styles.smallSection}>
    Available Days
  </Text>

  <View style={styles.chipContainer}>
    {offer.availableSlots?.map(
      (day: string, index: number) => (
        <Chip
          compact
          key={index}
          style={styles.dayChip}
        >
          {day}
        </Chip>
      )
    )}
  </View>

  <Text style={styles.smallSection}>
    Skills Wanted
  </Text>

  <View style={styles.chipContainer}>
    {offer.skillsWanted?.map(
      (skill: string, index: number) => (
        <Chip
          compact
          key={index}
          style={styles.skillChip}
        >
          {skill}
        </Chip>
      )
    )}
  </View>

</View>

      <View style={styles.exchangeCard}>
        <MaterialCommunityIcons
          name="swap-horizontal"
          size={26}
          color="#f59e0b"
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.exchangeTitle}>
            Skill Exchange
          </Text>

          <Text style={styles.exchangeText}>
            You will need to offer one skill
            in return when booking this session.
          </Text>
        </View>
      </View>

      {!isOwner && (
  <Button
    mode="contained"
    style={styles.bookButton}
    contentStyle={{ height: 56 }}
    onPress={() =>
      router.push({
        pathname: '/book-session',
        params: {
          offerId: offer._id,
        },
      })
    }
  >
    Book Session
  </Button>
)}

    </View>
  </ScrollView>
  </>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  shareButton: {
    position: "absolute",
    top: 40,
    right: 12,
    backgroundColor: "#fff",
  },

  content: {
    marginTop: -24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

smallSection: {
  fontSize: 14,
  fontWeight: "700",
  color: "#334155",
  marginTop: 16,
  marginBottom: 10,
},
  titleSection: {
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 12,
    marginTop: 30,
  },

  categoryChip: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f5f9",
    marginBottom: 12,
  },

  tutor: {
    fontSize: 15,
    color: "#64748b",
  },

  levelText: {
    marginTop: 4,
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },

  detailCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  detailLabel: {
    fontSize: 14,
    color: "#64748b",
  },

  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },

  subSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
    marginTop: 6,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skillChip: {
    marginRight: 8, 
    marginBottom: 8,
    backgroundColor: "#dbeafe",
  },

  dayChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f1f5f9",
  },

  emptyText: {
    color: "#94a3b8",
    fontStyle: "italic",
    marginBottom: 20,
  },

  aboutCard: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#475569",
  },

  exchangeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fffbeb",
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },

  exchangeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginLeft: 12,
    marginBottom: 6,
  },

  exchangeText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginLeft: 12,
  },

  bookButton: {
    borderRadius: 16,
    backgroundColor: "#2563eb",
    marginBottom: 16,
  },

  actionRow: {
    marginTop: 4,
  },

  actionButton: {
    borderRadius: 14,
    borderColor: "#ef4444",
  },
});