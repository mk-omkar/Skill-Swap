import { AuthContext } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput, Title } from 'react-native-paper';

export default function BookSession() {
  const { offers, bookSession } = useData();
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { offerId } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
const [offeredSkill, setOfferedSkill] = useState('');
const [loading, setLoading] = useState(false);

  const offer = offers.find(o => o.id === offerId);

  if (!offer) {
    return (
      <View style={styles.container}>
        <Text>Offer not found</Text>
      </View>
    );
  }

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
      Alert.alert('Error', 'You must be logged in to book a session');
      return;
    }

    setLoading(true);
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();
      
      await bookSession({
  offerId: offer.id,

  tutorId: offer.tutorId,
  tutorName: offer.tutorId,

  learnerId: user.id,
  learnerName: user.name,

  scheduledAt,
  status: 'requested',

  offeredSkill: offeredSkill.trim(),
  notes,
});

      Alert.alert('Success', 'Session booking request sent!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to book session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Book Session</Title>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerDescription}>{offer.description}</Text>
            <View style={styles.offerDetails}>
              <Text style={styles.detailText}>Category: {offer.category}</Text>
              <Text style={styles.detailText}>Duration: {offer.duration} minutes</Text>
              <Text style={styles.detailText}>Rating: ⭐ {offer.rating.toFixed(1)}</Text>
              <Text style={styles.detailText}>Available Sessions: {offer.availableSessions}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.bookingCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Session Details</Title>
            
            <TextInput
              label="Date"
              value={selectedDate}
              onChangeText={setSelectedDate}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
            />
            
            <TextInput
              label="Time"
              value={selectedTime}
              onChangeText={setSelectedTime}
              style={styles.input}
              mode="outlined"
              placeholder="HH:MM"
            />
            <TextInput
  label="Skill You Offer In Return *"
  value={offeredSkill}
  onChangeText={setOfferedSkill}
  style={styles.input}
  mode="outlined"
  placeholder="e.g. React, Guitar, UI Design, Java"
/>
            <TextInput
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Any specific topics you'd like to focus on..."
            />

            <Button
              mode="contained"
              onPress={handleBookSession}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Booking...' : 'Book Session'}
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#2563eb' },
  card: { marginBottom: 16, elevation: 2 },
  bookingCard: { elevation: 2 },
  offerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  offerDescription: { fontSize: 14, color: '#666', marginBottom: 12 },
  offerDetails: { marginTop: 8 },
  detailText: { fontSize: 12, color: '#888', marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  input: { marginBottom: 16 },
  button: { marginTop: 16 },
});
