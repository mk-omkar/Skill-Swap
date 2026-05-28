import { AuthContext } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useContext, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';

export default function SessionDetails() {
  const { sessionId } = useLocalSearchParams();
  const { sessions } = useData();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const session = useMemo(() => {
    return sessions.find(s => s.id === sessionId);
  }, [sessionId, sessions]);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Session not found</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  const isTeacher = user?.id === session.tutorId;
  const canStartCall = session.status === 'confirmed' || session.status === 'requested';

  const handleStartVideoCall = async () => {
    if (!canStartCall) {
      Alert.alert('Cannot Start Call', 'Session must be confirmed to start a video call.');
      return;
    }

    const roomName = `skillswap-${session.id}`.replace(/[^a-zA-Z0-9-]/g, '');
    const jitsiUrl = `https://meet.jit.si/${roomName}`;

    try {
      await WebBrowser.openBrowserAsync(jitsiUrl);
    } catch (error) {
      Alert.alert('Error', 'Could not open video call. Please try again.');
    }
  };

  const handleCopyCallLink = async () => {
    const roomName = `skillswap-${session.id}`.replace(/[^a-zA-Z0-9-]/g, '');
    const jitsiUrl = `https://meet.jit.si/${roomName}`;
    
    Alert.alert(
      'Video Call Link',
      jitsiUrl,
      [
        {
          text: 'Copy',
          onPress: () => {
            // Simple copy to clipboard approach
            Alert.alert('Link', 'Share this with your session contact:\n\n' + jitsiUrl);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Session Details</Title>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Session ID:</Text>
              <Text style={styles.value}>{session.id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={[styles.value, styles.statusBadge]}>
                {session.status.toUpperCase()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Scheduled Date:</Text>
              <Text style={styles.value}>
                {new Date(session.scheduledAt).toLocaleString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Teacher ID:</Text>
              <Text style={styles.value}>{session.tutorId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Learner ID:</Text>
              <Text style={styles.value}>{session.learnerId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Offer ID:</Text>
              <Text style={styles.value}>{session.offerId}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.videoCallCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Start Video Teaching Session</Title>
            <Text style={styles.description}>
              {isTeacher
                ? 'Start a video call to teach this session. Share the link with the learner.'
                : 'Request a video call from your teacher or wait for them to start.'}
            </Text>

            {isTeacher && canStartCall && (
              <View>
                <Button
                  mode="contained"
                  onPress={handleStartVideoCall}
                  style={styles.videoButton}
                  icon="video"
                >
                  Start Video Call
                </Button>

                <Button
                  mode="outlined"
                  onPress={handleCopyCallLink}
                  style={styles.linkButton}
                  icon="link"
                >
                  Copy Call Link
                </Button>
              </View>
            )}

            {!isTeacher && (
              <View>
                <Button
                  mode="contained"
                  onPress={() => {
                    Alert.alert(
                      'Call Request Sent',
                      'Your teacher will see your call request. They will accept and start the video call.',
                      [{ text: 'OK' }]
                    );
                  }}
                  style={styles.requestCallButton}
                  icon="phone"
                >
                  Request Video Call
                </Button>
                <Text style={styles.waitingText}>
                  Waiting for teacher to start the video call...
                </Text>
              </View>
            )}

            {!canStartCall && (
              <Text style={styles.infoText}>
                Video calls can only be started when the session is confirmed or requested.
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>How It Works</Title>
            <Text style={styles.infoText}>
              • Click "Start Video Call" to open Jitsi Meet{'\n'}
              • Share the call link with the learner{'\n'}
              • Both can join from any browser or device{'\n'}
              • No account or app installation needed
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Back to Profile
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#2563eb' },
  detailsCard: { marginBottom: 16, elevation: 2 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  value: { fontSize: 14, color: '#666', maxWidth: '60%' },
  statusBadge: { backgroundColor: '#e3f2fd', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, color: '#1976d2' },
  videoCallCard: { marginBottom: 16, elevation: 2, backgroundColor: '#f0f7ff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#2563eb' },
  description: { fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 },
  videoButton: { marginBottom: 12, paddingVertical: 8 },
  linkButton: { marginBottom: 12 },
  requestCallButton: { marginBottom: 12, paddingVertical: 8 },
  waitingText: { fontSize: 14, color: '#ff9800', fontStyle: 'italic', marginTop: 12 },
  infoText: { fontSize: 13, color: '#666', lineHeight: 20 },
  infoCard: { marginBottom: 16, elevation: 1, backgroundColor: '#fff9c4' },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#f57f17' },
  errorText: { fontSize: 16, color: '#d32f2f', marginTop: 20, textAlign: 'center' },
  backButton: { marginTop: 8 },
});
