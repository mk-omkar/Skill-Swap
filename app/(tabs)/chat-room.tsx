import { API_URL } from "@/constants/api";
import { useData } from "@/contexts/data-context";
import { AuthContext } from "@/contexts/auth-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Linking,
} from "react-native";
import {
  Button,
  Card,
  Text,
  TextInput,
  Title,
  Portal,
  Dialog,
  Menu,
} from "react-native-paper";

export default function ChatRoom() {
  const { user } = useContext(AuthContext);
  const { updateSession } = useData();
  const router = useRouter();

  const { receiverId, receiverName, sessionId } = useLocalSearchParams();
  console.log("SESSION ID:", sessionId);

  const [sessionEnded, setSessionEnded] =
  useState(false);

const [endedToday, setEndedToday] =
  useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [meetVisible, setMeetVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const [reportVisible, setReportVisible] =
  useState(false);

const [complaint, setComplaint] =
  useState("");

  const [sessionStatus, setSessionStatus] =
  useState("Session currently ongoing");

  const senderId = user?.id;

  const loadMessages = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/chat/${senderId}/${receiverId}`,
      );

      const data = await response.json();

      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (sessionEnded) {
  Alert.alert(
    "Course Completed",
    "This chat has been permanently closed."
  );
  return;
}

if (endedToday) {
  Alert.alert(
    "Session Ended",
    "Continue the session tomorrow."
  );
  return;
}
    if (!newMessage.trim()) return;

    try {
      setLoading(true);

      await fetch(`${API_URL}/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          message: newMessage,
        }),
      });

      setNewMessage("");

      loadMessages();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const shareMeetLink = async () => {
    if (!meetLink.trim()) {
      Alert.alert("Enter a Google Meet link");
      return;
    }

    try {
      await fetch(`${API_URL}/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          message: `MEET_LINK:${meetLink}`,
        }),
      });

      setMeetLink("");
      setMeetVisible(false);

      loadMessages();
    } catch (error) {
      console.log(error);
    }
  };
  const endSession = async () => {
    console.log("sessionId =", sessionId);

    if (!sessionId) {
      Alert.alert("Error", "Session ID missing");
      return;
    }

    try {
      await updateSession(String(sessionId), {
        status: "completed",
      });

      Alert.alert("Success", "Session completed");

      router.replace("/chat");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not complete session");
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topBar}>
        <View
          style={{
            width: 45,
            height: 45,
            borderRadius: 22,
            backgroundColor: "#2563eb",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            {String(receiverName).charAt(0).toUpperCase()}
          </Text>
        </View>
        <View>
          <Title>{receiverName}</Title>

          <Text
            style={{
              color: "#22c55e",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            ● Active Session
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Button mode="contained-tonal" onPress={() => setMeetVisible(true)}>
           Google Meet
          </Button>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setMenuVisible(true)}>
                ⋮
              </Button>
            }
          >
           <Menu.Item
  title="End For Today"
  onPress={async () => {
    setMenuVisible(false);

   setEndedToday(true);

setSessionStatus(
  "Session paused for today. Continue tomorrow."
);

    const systemMessage = {
      _id: Date.now().toString(),
      senderId: "system",
      message:
        "📌 Session ended for today. Continue tomorrow.",
    };

    setMessages((prev) => [
      ...prev,
      systemMessage,
    ]);
  }}
/>

           <Menu.Item
  title="Complete Course"
  onPress={async () => {
    setMenuVisible(false);

   setSessionEnded(true);

setSessionStatus(
  "Course completed."
);

const systemMessage = {
      _id: Date.now().toString(),
      senderId: "system",
      message:
        "✅ This course has been completed. Chat is now closed.",
    };

    setMessages((prev) => [
      ...prev,
      systemMessage,
    ]);
  }}
/>

<Menu.Item
  title="Report User"
  onPress={() => {
    setMenuVisible(false);
    setReportVisible(true);
  }}
/>
          </Menu>
        </View>
      </View>
      <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
        <Card
          style={{
            margin: 10,
            borderRadius: 18,
          }}
        >
          <Card.Content>
            <Text variant="titleMedium">
  Session Status
</Text>

<Text
  style={{
    color:
  sessionEnded
    ? "red"
    : endedToday
    ? "#f59e0b"
    : "#22c55e",

    marginTop: 5,
    fontWeight: "600",
  }}
>
  {sessionStatus}
</Text>
          </Card.Content>
        </Card>
      </View>

      <Portal>
        <Dialog visible={meetVisible} onDismiss={() => setMeetVisible(false)}>
          <Dialog.Title>Share Google Meet Link</Dialog.Title>

          <Dialog.Content>
            <TextInput
              mode="outlined"
              placeholder="https://meet.google.com/..."
              value={meetLink}
              onChangeText={setMeetLink}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setMeetVisible(false)}>Cancel</Button>

            <Button onPress={shareMeetLink}>Send</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
  visible={reportVisible}
  onDismiss={() =>
    setReportVisible(false)
  }
>
  <Dialog.Title>
    Report User
  </Dialog.Title>

  <Dialog.Content>
    <Text
      style={{
        marginBottom: 10,
      }}
    >
      Your name and email will be
      automatically included.
    </Text>

    <TextInput
      mode="outlined"
      label="Complaint"
      multiline
      numberOfLines={4}
      value={complaint}
      onChangeText={setComplaint}
    />
  </Dialog.Content>

  <Dialog.Actions>
    <Button
      onPress={() =>
        setReportVisible(false)
      }
    >
      Cancel
    </Button>

    <Button
      onPress={() => {
        if (!complaint.trim()) {
          Alert.alert(
            "Please enter your complaint"
          );
          return;
        }

        console.log({
          reporterName: user?.name,
          reporterEmail: user?.email,
          complaint,
        });

        Alert.alert(
          "Report Submitted",
          "Your complaint has been sent."
        );

        setComplaint("");
        setReportVisible(false);
      }}
    >
      Submit
    </Button>
  </Dialog.Actions>
</Dialog>
      </Portal>
      <Dialog
  visible={reportVisible}
  onDismiss={() =>
    setReportVisible(false)
  }
>
  <Dialog.Title>
    Report User
  </Dialog.Title>

  <Dialog.Content>
    <TextInput
      mode="outlined"
      label="Your Name"
      value={user?.name || ""}
      disabled
      style={{ marginBottom: 10 }}
    />

    <TextInput
      mode="outlined"
      label="Your Email"
      value={user?.email || ""}
      disabled
      style={{ marginBottom: 10 }}
    />

    <TextInput
      mode="outlined"
      label="Complaint"
      multiline
      numberOfLines={4}
      value={complaint}
      onChangeText={setComplaint}
    />
  </Dialog.Content>

  <Dialog.Actions>
    <Button
      onPress={() =>
        setReportVisible(false)
      }
    >
      Cancel
    </Button>

    <Button
      onPress={() => {
        Alert.alert(
          "Report Submitted"
        );

        setComplaint("");
        setReportVisible(false);
      }}
    >
      Submit
    </Button>
  </Dialog.Actions>
</Dialog>
      <FlatList
        style={{ flex: 1 }}
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          padding: 10,
        }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.senderId === senderId
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            {item.message?.startsWith("MEET_LINK:") ? (
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: 5,
                    color: "#000000",
                  }}
                >
                  Google Meet Invitation
                </Text>

                <Text
                  style={{
                    color: "#000000",
                    textDecorationLine: "underline",
                    fontWeight: "bold",
                  }}
                  onPress={() =>
                    Linking.openURL(item.message.replace("MEET_LINK:", ""))
                  }
                >
                  🎥 Click Here To Join Meeting
                </Text>
              </View>
            ) : (
              <Text
                style={
                  item.senderId === senderId ? styles.myText : styles.otherText
                }
              >
                {item.message}
              </Text>
            )}
          </View>
        )}
      />

      <Card style={styles.inputCard}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          }}
        >
         <TextInput
  mode="outlined"
  value={newMessage}
  onChangeText={setNewMessage}
  placeholder={
    sessionEnded
      ? "Course completed"
      : endedToday
      ? "Session ended for today"
      : "Type a message..."
  }
  editable={
    !sessionEnded &&
    !endedToday
  }
  style={{
    flex: 1,
    marginRight: 10,
  }}
/>

          <Button
  mode="contained"
  onPress={sendMessage}
  disabled={
    sessionEnded ||
    endedToday
  }
>
            Send
          </Button>
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: "#f5f5f5",
  paddingTop: 30,
},

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  header: {
    marginVertical: 15,
  },

  message: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: "80%",
    elevation: 2,
  },

  myMessage: {
    backgroundColor: "#e9d5ff",
    alignSelf: "flex-end",
  },

  otherMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },

  myText: {
    color: "#000",
  },
  otherText: {
    color: "#000",
  },

  inputCard: {
    margin: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
