import { AuthContext } from '@/contexts/auth-context';
import React, { useContext, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput, Title } from 'react-native-paper';

const initialMessages = [
  { id: 'msg_1', sender: 'Support', text: 'Welcome to conversations! Tap below to send a message.', fromUser: false },
];

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);

    const message = {
      id: `msg_${Date.now()}`,
      sender: user?.name ?? 'You',
      text: newMessage.trim(),
      fromUser: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    await new Promise(resolve => setTimeout(resolve, 300));
    setMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now() + 1}`,
        sender: 'Support',
        text: 'Thanks for your message. This chat view is a mock conversation feature.',
        fromUser: false,
      },
    ]);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Title style={styles.title}>Conversations</Title>
        <Text style={styles.subtitle}>Chat with support or your own session contacts.</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.fromUser ? styles.userBubble : styles.supportBubble]}>
            <Text style={[styles.messageSender, item.fromUser && styles.userText]}>{item.sender}</Text>
            <Text style={[styles.messageText, item.fromUser && styles.userText]}>{item.text}</Text>
          </View>
        )}
      />

      <Card style={styles.inputCard}>
        <Card.Content>
          <TextInput
            label="Type a message"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            mode="outlined"
            style={styles.messageInput}
          />
          <Button mode="contained" onPress={handleSend} loading={loading} disabled={!newMessage.trim() || loading}>
            Send Message
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2563eb' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  messagesList: { paddingHorizontal: 16, paddingBottom: 16 },
  messageBubble: { marginBottom: 12, padding: 12, borderRadius: 14, maxWidth: '85%', },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2563eb', color: '#fff' },
  supportBubble: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  messageSender: { fontSize: 12, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  messageText: { fontSize: 14, color: '#111' },
  userText: { color: '#fff' },
  inputCard: { margin: 16, elevation: 4 },
  messageInput: { marginBottom: 12 },
});
