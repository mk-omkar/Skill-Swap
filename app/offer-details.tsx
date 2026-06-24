import { AuthContext } from '@/contexts/auth-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

const handleReport = () => {
  Alert.alert(
    'Report',
    'Report feature coming soon'
  );
};

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
  <ScrollView
    style={styles.container}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.heroContainer}>
      <Image
        source={require('../assets/images/home-banner.png')}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <IconButton
        icon="share-variant"
        size={22}
        style={styles.shareButton}
        onPress={() => {}}
      />
    </View>

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
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={22}
            color="#2563eb"
          />
          <Text style={styles.infoLabel}>
            Duration
          </Text>
          <Text style={styles.infoValue}>
            {offer.duration} min
          </Text>
        </View>

        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={22}
            color="#2563eb"
          />
          <Text style={styles.infoLabel}>
            Sessions Left
          </Text>
          <Text style={styles.infoValue}>
            {offer.sessionsAvailable}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name="star-outline"
            size={22}
            color="#2563eb"
          />
          <Text style={styles.infoLabel}>
            Rating
          </Text>
          <Text style={styles.infoValue}>
            {offer.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>
          About this Skill
        </Text>

        <Text style={styles.description}>
          {offer.description}
        </Text>
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

      <View style={styles.actionRow}>
        <Button
          mode="outlined"
          style={styles.actionButton}
          onPress={() =>
            router.push({
              pathname: '/chat',
              params: {
                receiverId: offer.tutorId,
                receiverName: offer.tutorName,
              },
            })
          }
        >
          Chat Tutor
        </Button>

        <Button
          mode="outlined"
          textColor="#ef4444"
          style={styles.actionButton}
          onPress={handleReport}
        >
          Report
        </Button>
      </View>

    </View>
  </ScrollView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  heroContainer: {
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: 240,
  },

  shareButton: {
    position: "absolute",
    top: 40,
    right: 12,
    backgroundColor: "#ffffff",
  },

  content: {
    marginTop: -24,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  titleSection: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 12,
  },

  categoryChip: {
    alignSelf: "flex-start",
    marginBottom: 12,
    backgroundColor: "#eff6ff",
  },

  tutor: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },

  infoCard: {
    flexDirection: "row",
    justifyContent: "space-between",

    backgroundColor: "#f8fafc",

    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,

    marginBottom: 20,
  },

  infoItem: {
    flex: 1,
    alignItems: "center",
  },

  infoLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748b",
  },

  infoValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },

  aboutCard: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 22,
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
    alignItems: "center",

    backgroundColor: "#fffbeb",

    borderRadius: 18,

    padding: 16,

    marginBottom: 24,
  },

  exchangeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginLeft: 12,
    marginBottom: 4,
  },

  exchangeText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b",
    marginLeft: 12,
  },

  bookButton: {
    borderRadius: 16,
    backgroundColor: "#2563eb",
    marginBottom: 16,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  actionButton: {
    flex: 1,
    borderRadius: 14,
  },
});

