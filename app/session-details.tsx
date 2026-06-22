import { AuthContext } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useMemo } from 'react';
import { Alert } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';

export default function SessionDetails() {
  const { sessionId } = useLocalSearchParams();
  const { sessions, updateSession } = useData();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const session = useMemo(() => {
    return sessions.find((s) => s.id === sessionId);
  }, [sessionId, sessions]);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Session not found</Text>
        <Button onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  const canChat = session.status === 'confirmed';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>
          Session Details
        </Title>

        <Card style={styles.detailsCard}>
          <Card.Content>

            <View style={styles.detailRow}>
              <Text style={styles.label}>
                Session ID:
              </Text>
              <Text style={styles.value}>
                {session.id}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>
                Status:
              </Text>
              <Text style={styles.value}>
                {session.status.toUpperCase()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>
                Scheduled Date:
              </Text>
              <Text style={styles.value}>
                {new Date(
                  session.scheduledAt
                ).toLocaleString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>
                Tutor ID:
              </Text>
              <Text style={styles.value}>
                {session.tutorId}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>
                Learner ID:
              </Text>
              <Text style={styles.value}>
                {session.learnerId}
              </Text>
            </View>

          </Card.Content>
        </Card>

        {canChat && (
          <Card style={styles.chatCard}>
            <Card.Content>
              <Title style={styles.chatTitle}>
                Chat Available
              </Title>

              <Text style={styles.chatText}>
                This session has been accepted.
                You can now chat with the other user.
              </Text>

              <Button
                mode="contained"
                onPress={() =>
                  router.push('/users')
                }
                style={styles.chatButton}
              >
                Open Chat
              </Button>
            </Card.Content>
          </Card>
        )}

        {!canChat && (
          <Card style={styles.pendingCard}>
            <Card.Content>
              <Title style={styles.pendingTitle}>
                Waiting For Approval
              </Title>

              <Text>
                Chat will become available once
                the tutor accepts the booking.
              </Text>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Back
        </Button>
        <Button
  mode="contained"
  buttonColor="red"
  onPress={async () => {
    await updateSession(session.id, {
      status: "completed",
    });

    Alert.alert(
      "Success",
      "Session ended successfully."
    );

    router.back();
  }}
>
  End Session
</Button>
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

  detailsCard: {
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    fontWeight: 'bold',
  },

  value: {
    color: '#666',
  },

  chatCard: {
    marginBottom: 16,
  },

  chatTitle: {
    color: '#2563eb',
  },

  chatText: {
    marginBottom: 15,
  },

  chatButton: {
    marginTop: 10,
  },

  pendingCard: {
    marginBottom: 16,
  },

  pendingTitle: {
    color: '#ff9800',
  },

  backButton: {
    marginTop: 10,
  },

  errorText: {
    textAlign: 'center',
    marginTop: 30,
  },
});