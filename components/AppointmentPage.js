import React, { Component } from "react";
import { observer } from "mobx-react";

import {
  Container,
  Header,
  Content,
  Button,
  Text,
  Row,
  View
} from "native-base";

import { StyleSheet, ScrollView } from "react-native";
import Store from "../stores/store";
import { withNamespaces } from "react-i18next";
import authStore from "../stores/authStore";

class AppointmentPage extends Component {
  state = {
    authenticated: false
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: screenProps.t("appointment:title"),
    headerStyle: {
      backgroundColor: "#00bfff"
    }
  });

  render() {
    const { t, i18n, navigation } = this.props;
    if (!Store.doctorList) return <View style={styles.thumbnailStyle} />;

    if (!authStore.isAuthenticated) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white"
          }}
        >
          <Text>{t("other:pleaselogin")}</Text>
        </View>
      );
    }
    let list = Store.findScheduleGoing(authStore.user.username);
    
    return (
      <View style={styles.container}>
        <ScrollView style={{ marginTop: 2, backgroundColor: "white" }}>
          {list.map(item => (
            <View style={styles.itemView} key={item.id}>
              {/* {authStore.user.username == item.patient.username ? ( */}
              <View
                style={{
                  width: "97%",
                  margin: 5,
                  marginVertical: 20,
                  backgroundColor: "white"
                }}
              >
                <View style={styles.item}>
                  <Text>{t("book:patientname")}</Text>
                  <Text note>
                    {item.patient ? item.patient.username : "No patient"}
                  </Text>
                </View>

                <View style={styles.item}>
                  <Text>{t("book:date")}</Text>
                  <Text note>{item.date}</Text>
                </View>

                <View style={styles.item}>
                  <Text>{t("book:reservationtime")}</Text>
                  <Text note>{item.available_time}</Text>
                </View>
              </View>

              {/* ) :null} */}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export default withNamespaces(["book", "appointment", "other", "edit"], {
  wait: true
})(observer(AppointmentPage));

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  item: {
    backgroundColor: "white",
    borderColor: "#ddd",
    borderRadius: 10,
    borderWidth: 1,
    margin: 5,
    padding: 4
  },
  thumbnailStyle: {
    alignContent: "center",
    justifyContent: "center"
  },
  itemView: {
    backgroundColor: "white",
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    flexDirection: "row"
  }
});
