import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import * as Updates from "expo-updates";

export default function App() {
  const [isUpdaing, setIsUpdaing] = useState(false);
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setIsUpdaing(true);
        await Updates.fetchUpdateAsync();
        setTimeout(async () => {
          setIsUpdaing(false);
          await Updates.reloadAsync();
        }, 1000);
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    !__DEV__ && onFetchUpdateAsync();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text>Open up App.tsx to start working on your app! test 8</Text>
        <StatusBar style="auto" translucent={false} backgroundColor="white" />
      </View>
      {isUpdaing && (
        <Text style={{ backgroundColor: "lightcoral", textAlign: "center" }}>
          {"App is updating !!"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
