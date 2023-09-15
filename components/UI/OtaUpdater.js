import { useInaccurateTimestamp } from "react-native-use-timestamp";
import * as Updates from "expo-updates";
import React, { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { MyText } from "./MyText";
import { CustomButton } from "./CustomButton";

// How often do we want to render?
const INTERVAL_RENDER = 1000 * (__DEV__ ? 10 : 60);
// How often should it actually check for an update?
const INTERVAL_OTA_CHECK = 1000 * 60 * 15;
// const INTERVAL_OTA_CHECK = 1000 * 20

async function checkForUpdates() {
  const update = await Updates.checkForUpdateAsync();
  if (!update.isAvailable) {
    throw new Error("No updates available");
  }

  const result = await Updates.fetchUpdateAsync();
  if (!result.isNew) {
    throw new Error("Fetched update is not new");
  }

  return true;
}

export function OtaUpdater() {
  const now = useInaccurateTimestamp({ every: INTERVAL_RENDER });
  const isMounted = useRef(true);
  const [updateIsAvailable, setUpdateAvailable] = useState(false);

  // Setting this to initially zero means there will _always_ be a check on
  // mount, which is nice, because that means a check when the app starts.
  const lastUpdate = useRef(0);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (updateIsAvailable) {
      return;
    }

    if (now - lastUpdate.current < INTERVAL_OTA_CHECK) {
      return;
    }

    lastUpdate.current = now;

    checkForUpdates()
      .then(() => {
        isMounted.current && setUpdateAvailable(true);
        if (isMounted.current) {
          Updates.reloadAsync();
        }
      })
      .catch((_reason) => {
        /* you can inspect _reason */
      });
  }, [now]);

  const ModalComponent = () => {
    return updateIsAvailable ? (
      <Modal
        statusBarTranslucent={true}
        animationType='slide'
        transparent={true}
        presentationStyle='overFullScreen'
      >
        <View style={styles.container}>
          <View style={styles.updateContainer}>
            <MyText title="Hey there! We've got an update for you 🎉" h6 />
            <CustomButton
              style={styles.promoBtn}
              title='Apply Update'
              textStyle={styles.promoBtnText}
              onPress={() => {
                Updates.reloadAsync();
              }}
            />
          </View>
        </View>
      </Modal>
    ) : null;
  };

  return <ModalComponent />;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
  },
  updateContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E7E7E9",
    borderRadius: 5,
    width: "85%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  promoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
  },
  promoBtnText: {
    fontSize: 11,
  },
});
