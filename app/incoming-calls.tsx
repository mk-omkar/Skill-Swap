import { AuthContext } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { useRouter } from 'expo-router';
import React, { useContext, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, Title } from 'react-native-paper';

export default function IncomingCalls() {
  const { user } = useContext(AuthContext);
  const { sessions } = useData();
  const router = useRouter();
  const [acceptedCalls, setAcceptedCalls] = useState<Set<string>>(new Set());

  // Get all sessions where this user is the teacher and status is 'requested'
  const incomingCalls = useMemo(() => {
    return sessions.filter(
      session => session.tutorId === user?.id && session.status === 'requested'
    );
  }, [sessions, user?.id]);

  const handleAcceptCall = (sessionId: string) => {
    setAcceptedCalls(prev => {
      const newSet = new Set(prev);
      newSet.add(sessionId);
      return newSet;
    });
    
    Alert.alert(
      'Call Accepted! ✅',
      'You have accepted this call. Click "Join Video Call" to start teaching.',
      [
        {
          text: 'Join Now',
          onPress: () => {
            router.push({
              pathname: '/session-details',
              params: { sessionId }
            });
          },
        },
        { text: 'Later', style: 'cancel' },
      ]
    );
  };

  const handleRejectCall = (sessionId: string) => {
    Alert.alert(
      'Reject Call?',
      'The learner will be notified. Are you sure?',
      [
        {
          text: 'Reject',
          onPress: () => {
            Alert.alert('Call Rejected', 'You have rejected this call.');
          },
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Incoming Video Calls</Title>
        <Text style={styles.subtitle}>
          {incomingCalls.length} {incomingCalls.length === 1 ? 'call' : 'calls'} waiting for acceptance
        </Text>

        {incomingCalls.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                No incoming calls at the moment.
              </Text>
              <Text style={styles.emptySubtext}>
                You'll see incoming call requests here when learners book your sessions.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          incomingCalls.map((call) => (
            <Card key={call.id} style={styles.callCard}>
              <Card.Content>
                <View style={styles.callHeader}>
                  <View style={styles.callInfo}>
                    <Title style={styles.learnerLabel}>Call from Learner</Title>
                    <Text style={styles.learnerId}>ID: {call.learnerId}</Text>
                  </View>
                  <Chip
                    label={acceptedCalls.has(call.id) ? 'Accepted ✓' : 'Pending'}
                    style={[
                      styles.statusChip,
                      acceptedCalls.has(call.id) && styles.acceptedChip,
                    ]}
                    textStyle={{
                      color: acceptedCalls.has(call.id) ? '#2e7d32' : '#ff6f00',
                    }}
                  />
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailLabel}>Session Details:</Text>
                  <Text style={styles.detailText}>
                    • Session ID: {call.id}
                  </Text>
                  <Text style={styles.detailText}>
                    • Scheduled: {new Date(call.scheduledAt).toLocaleString()}
                  </Text>
                  <Text style={styles.detailText}>
                    • Offer: {call.offerId}
                  </Text>
                </View>

                <View style={styles.actionsSection}>
                  {!acceptedCalls.has(call.id) ? (
                    <>
                      <Button
                        mode="contained"
                        onPress={() => handleAcceptCall(call.id)}
                        style={styles.acceptButton}
                        icon="phone"
                      >
                        Accept Call
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={() => handleRejectCall(call.id)}
                        style={styles.rejectButton}
                        textColor="#d32f2f"
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      mode="contained"
                      onPress={() => {
                        router.push({
                          pathname: '/session-details',
                          params: { sessionId: call.id }
                        });
                      }}
                      style={styles.joinButton}
                      icon="video"
                    >
                      Join Video Call
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>How It Works</Title>
            <Text style={styles.infoText}>
              1. Learners book your sessions{'\n'}
              2. You see incoming calls here{'\n'}
              3. Accept the call to start teaching{'\n'}
              4. Click "Join Video Call" to open the meeting{'\n'}
              5. Share the call link with the learner
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 4, color: '#2563eb' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  emptyCard: { marginTop: 32, elevation: 1, backgroundColor: '#e3f2fd' },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: '#1976d2', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666', lineHeight: 20 },
  callCard: { marginBottom: 16, elevation: 3, backgroundColor: '#fff' },
  callHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  callInfo: { flex: 1 },
  learnerLabel: { fontSize: 16, fontWeight: 'bold', color: '#2563eb', marginBottom: 4 },
  learnerId: { fontSize: 13, color: '#666' },
  statusChip: { backgroundColor: '#fff3e0' },
  acceptedChip: { backgroundColor: '#e8f5e9' },
  detailsSection: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  detailLabel: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  detailText: { fontSize: 12, color: '#666', marginBottom: 4 },
  actionsSection: { marginTop: 12 },
  acceptButton: { marginBottom: 8, paddingVertical: 6 },
  rejectButton: { marginBottom: 8 },
  joinButton: { paddingVertical: 6 },
  infoCard: { marginTop: 16, elevation: 1, backgroundColor: '#fff9c4' },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#f57f17' },
  infoText: { fontSize: 13, color: '#666', lineHeight: 20 },
});
