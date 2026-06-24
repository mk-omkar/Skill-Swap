import { AuthContext } from '@/contexts/auth-context';
import { API_URL } from '@/constants/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Card,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';

export default function BookSession() {
  const { user } = useContext(AuthContext);

  const router = useRouter();
  const { offerId } = useLocalSearchParams();

  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] =
    useState('');

  const [selectedTime, setSelectedTime] =
    useState('');

  const [notes, setNotes] =
    useState('');

  const [offeredSkill, setOfferedSkill] =
    useState('');

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

  const handleBookSession = async () => {
    if (
      !selectedDate ||
      !selectedTime ||
      !offeredSkill.trim()
    ) {
      Alert.alert(
        'Error',
        'Please select date, time and offer a skill in return'
      );
      return;
    }

    if (!user) {
      Alert.alert(
        'Error',
        'You must be logged in'
      );
      return;
    }

    try {
      const scheduledAt = new Date(
        `${selectedDate}T${selectedTime}`
      ).toISOString();

      const response = await fetch(
        `${API_URL}/api/bookings/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            offerId: offer._id,

            tutorId: offer.tutorId,
            tutorName: offer.tutorName,

            learnerId: user.id,
            learnerName: user.name,

            scheduledAt,

            offeredSkill:
              offeredSkill.trim(),

            notes,

            status: 'requested',
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      Alert.alert(
        'Success',
        'Booking request sent'
      );

      router.back();
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create booking'
      );
    }
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>
          Book Session
        </Title>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.offerTitle}>
              {offer.title}
            </Text>

            <Text
              style={styles.offerDescription}
            >
              {offer.description}
            </Text>

            <View
              style={styles.offerDetails}
            >
              <Text
                style={styles.detailText}
              >
                Category:{' '}
                {offer.category}
              </Text>

              <Text
                style={styles.detailText}
              >
                Rating: ⭐{' '}
                {offer.rating}
              </Text>

              <Text
                style={styles.detailText}
              >
                Available Sessions:{' '}
                {
                  offer.sessionsAvailable
                }
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.bookingCard}>
          <Card.Content>
            <Title
              style={
                styles.sectionTitle
              }
            >
              Session Details
            </Title>

            <TextInput
              label="Date"
              value={selectedDate}
              onChangeText={
                setSelectedDate
              }
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
            />

            <TextInput
              label="Time"
              value={selectedTime}
              onChangeText={
                setSelectedTime
              }
              style={styles.input}
              mode="outlined"
              placeholder="HH:MM"
            />

            <TextInput
              label="Skill You Offer In Return"
              value={offeredSkill}
              onChangeText={
                setOfferedSkill
              }
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />

            <Button
              mode="contained"
              onPress={
                handleBookSession
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2563eb',
  },

  card: {
    marginBottom: 16,
  },

  bookingCard: {},

  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  offerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },

  offerDetails: {
    marginTop: 8,
  },

  detailText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  input: {
    marginBottom: 16,
  },

  button: {
    marginTop: 16,
  },
});