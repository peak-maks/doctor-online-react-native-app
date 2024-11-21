import React, { Component, Fragment } from "react";
import { observer } from "mobx-react";
import Store from "../stores/store";
import { Theme } from "./Theme";
import { withNamespaces } from "react-i18next";

import {
  Container,
  Header,
  Content,
  Button,
  Text,
  List,
  View,
  Icon,
  ListItem,
  Card,
  CardItem,
  Body,
  Thumbnail,
  Right,
  Left
} from "native-base";

import { Col, Row, Grid } from "react-native-easy-grid";

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Picker,
  PickerIOS,
  Modal
} from "react-native";

import DateTimePicker from "react-native-modal-datetime-picker";
import Overlay from "react-native-modal-overlay";

import CollapsingToolbar from "react-native-collapse-view";
import authStore from "../stores/authStore";

class AppointmentManage extends Component {
  constructor(props) {
    super(props);
    let today = new Date();
    this.state = {
      language: this.props.i18n.language,
      modalVisible: false,
      chosenDate: "",
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      chosenTime: "",
      showOverlay: false,
      patient: "",
      clickedScheduleId: "",
      selectDate:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate(),
      isSelectDatePickerVisible: false,
      scheduledata: [],
      Appointment: [],
      update: 0
    };
  }
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Appointments Manage",
    headerStyle: {
      backgroundColor: "#00bfff"
    }
  });

  addApponitment(visible) {
    this.setState({ chosenDate: "" });
    this.setState({ chosenTime: "" });
    this.setState({ patient: "" });
    this.setState({ modalVisible: visible });
  }

  saveAppointment() {
    let d = Store.findDoctorByUsername(authStore.user.username);
    Store.AppointmentsList.push({
      "id": new Date().getTime(),
      "doctor": d.id,
      "patient": this.state.patient,
      "date": this.state.chosenDate,
      "available_time": this.state.chosenTime
    });
    Store.postBook(
      this.state.chosenDate,
      this.state.chosenTime,
      d.id,
      this.state.patient
    );
    if (this.state.update > 0) {
      Store.deleteAppointment(this.state.update);
      this.setState({update: 0});
    }
    this.setState({ modalVisible: false });
  }

  _showDatePicker = () => this.setState({ isDatePickerVisible: true });

  _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = date => {
    let dateObj = new Date(date);
    let dateval =
      dateObj.getFullYear() +
      "-" +
      (dateObj.getMonth() + 1) +
      "-" +
      dateObj.getDate();
    console.log(dateval);
    this.setState({ chosenDate: dateval });
    this._hideDatePicker();
  };

  _showSelectDatePicker = () =>
    this.setState({ isSelectDatePickerVisible: true });

  _hideSelectDatePicker = () =>
    this.setState({ isSelectDatePickerVisible: false });

  _handleSelectDatePicked = date => {
    let dateObj = new Date(date);
    let dateval =
      dateObj.getFullYear() +
      "-" +
      (dateObj.getMonth() + 1) +
      "-" +
      dateObj.getDate();
    this.setState({ selectDate: dateval });
    this._hideSelectDatePicker();
  };

  _showTimePicker = () => this.setState({ isTimePickerVisible: true });

  _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  _handleTimePicked = time => {
    let dateObj = new Date(time);
    let timeval = dateObj.getHours() + ":" + dateObj.getMinutes();
    this.setState({ chosenTime: timeval });
    this._hideTimePicker();
  };

  onOverlayClose = () => this.setState({ showOverlay: false });
  showOverlay = id => {
    this.setState({ showOverlay: true });
    this.setState({ clickedScheduleId: id });
  };

  editApponitment = () => {
    this.setState({ showOverlay: false });
    let schdule = Store.findScheduleById(this.state.clickedScheduleId)[0];
    this.setState({ chosenDate: schdule.date });
    this.setState({ chosenTime: schdule.available_time });
    if(schdule.patient) {
      let userinfo = Store.findUser(schdule.patient.username);
      this.setState({ patient: userinfo.id });
    }
    this.setState({ modalVisible: true });
    this.setState({ update: schdule.id });
  };

  deleteApponitment = () => {
    this.setState({ showOverlay: false });
    Store.deleteAppointment(this.state.clickedScheduleId);
  };

  showMe(itemValue) {
    this.setState({ language: itemValue });

    if (this.state.language == "en-US" || this.state.language == "en") {
      this.props.i18n.changeLanguage("ar");
    } else {
      this.props.i18n.changeLanguage("en");
    }
  }

  // Edit() {
  //   if (authStore.isAuthenticated) {
  //     <ListItem onPress={() => this.props.navigation.navigate("FirstPage")}>
  //       <Left>
  //         <Icon name="md-person" large style={{ color: "#00bfff" }} />
  //         <Text>{t("settings:editprofile")}</Text>
  //       </Left>
  //       <Right>
  //         <Icon name="arrow-forward" large style={{ color: "#00bfff" }} />
  //       </Right>
  //     </ListItem>;
  //   }
  // }

  render() {
    const { t, i18n, navigation } = this.props;

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
          <Text>{t("edit:pleaselogin")}</Text>
        </View>
      );
    }
    let doctoruser = Store.findDoctorInUsers(authStore.user.user_id);
    if (!doctoruser || authStore.user.username != "admin") {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white"
          }}
        >
          <Text>{t("other:onlydoctor")}</Text>
        </View>
      );
    }
    let d = Store.findDoctorByUsername(authStore.user.username);
    this.state.Appointment = Store.findScheduleByLastDoctorId(d.id);
    // this.state.Appointment = Store.findScheduleGoing(authStore.user.username);
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: 100, flex: 0.4, height: 50 }} />
          <View style={{ flex: 0.5, height: 50 }}>
            <Button
              title="Learn More"
              color="teal"
              accessibilityLabel="New Appointment"
              style={{ width: 170, marginLeft: 40 }}
              onPress={() => this.addApponitment(!this.state.modalVisible)}
            >
              <Text>{t("other:newappointment")}</Text>
            </Button>
          </View>
        </View>
        <Overlay
          visible={this.state.showOverlay}
          onClose={this.onOverlayClose}
          closeOnTouchOutside
          animationType="zoomIn"
          containerStyle={{ backgroundColor: "rgba(5, 153, 249, 0.78)" }}
          childrenWrapperStyle={{ backgroundColor: "#000" }}
          animationDuration={500}
        >
          {(hideModal, overlayState) => (
            <Fragment>
              <Button
                title="Learn More"
                accessibilityLabel="New Appointment"
                style={{ width: "99%", backgroundColor: "rgba(0,0,0,0)" }}
                onPress={() => this.editApponitment(!this.state.modalVisible)}
              >
                <Text style={{ textAlign: "center" }}>{t("other:editappointment")}</Text>
              </Button>
              <Button
                title="Learn More"
                accessibilityLabel={t("other:newappointment")}
                style={{
                  marginTop: 30,
                  width: "99%",
                  backgroundColor: "rgba(0,0,0,0)"
                }}
                onPress={() => this.deleteApponitment()}
              >
                <Text style={{ textAlign: "center" }}>{t("other:deleteappointment")}</Text>
              </Button>
            </Fragment>
          )}
        </Overlay>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{ marginTop: 30 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "stretch",
                padding: 30
              }}
            >
              <View style={{ height: 50 }}>
                <Text style={{ fontSize: 20 }}>{t("other:newappointment")}</Text>
              </View>
              <View
                style={
                  Platform.OS == "android" ? { height: 50 } : { height: 300 }
                }
              >
                <Text style={{ fontSize: 20 }}>Patient Name: </Text>
                {Platform.OS === "ios" ? (
                  <PickerIOS
                    selectedValue={this.state.patient}
                    style={{ height: 300 }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ patient: itemValue })
                    }
                  >
                    <PickerIOS.Item label="----------" value="0" key="0" />
                    {Store.fullusers.map((item, i) => (
                      <PickerIOS.Item
                        label={item.user.username}
                        value={item.id}
                        key={i}
                      />
                    ))}
                  </PickerIOS>
                ) : (
                  <Picker
                    selectedValue={this.state.patient}
                    style={{ height: 50 }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ patient: itemValue })
                    }
                  >
                    <Picker.Item label="----------" value="0" key="0" />
                    {Store.fullusers.map((item, i) => (
                      <Picker.Item
                        label={item.user.username}
                        value={item.id}
                        key={i}
                      />
                    ))}
                  </Picker>
                )}
              </View>
              <View style={{ height: 50, marginTop: 30 }}>
                <Text style={{ fontSize: 20 }}>{t("book:date")}: </Text>
                <TextInput
                  style={{
                    fontFamily: "GTWalsheim-Medium",
                    fontSize: 20,
                    color: "grey",
                    height: 40
                  }}
                  placeholder={t("book:date")}
                  autoCapitalize="none"
                  onFocus={this._showDatePicker}
                  value={this.state.chosenDate}
                />
                <DateTimePicker
                  isVisible={this.state.isDatePickerVisible}
                  onConfirm={this._handleDatePicked}
                  onCancel={this._hideDatePicker}
                  datePickerModeAndroid="spinner"
                />
              </View>
              <View style={{ height: 50, marginTop: 30 }}>
                <Text style={{ fontSize: 20 }}>{t("book:reservationtime")}: </Text>
                <TextInput
                  style={{
                    fontFamily: "GTWalsheim-Medium",
                    fontSize: 20,
                    color: "grey",
                    height: 40
                  }}
                  placeholder={t("book:reservationtime")}
                  autoCapitalize="none"
                  onFocus={this._showTimePicker}
                  value={this.state.chosenTime}
                />
                <DateTimePicker
                  isVisible={this.state.isTimePickerVisible}
                  onConfirm={this._handleTimePicked}
                  onCancel={this._hideTimePicker}
                  mode="time"
                  datePickerModeAndroid="spinner"
                />
              </View>
              <View
                style={{
                  height: 50,
                  marginTop: 30,
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Button
                  title={t("other:save")}
                  color="teal"
                  accessibilityLabel={t("other:save")}
                  style={{ marginLeft: 60 }}
                  onPress={() => this.saveAppointment(!this.state.modalVisible)}
                >
                  <Text>Save</Text>
                </Button>
                <Button
                  title="cancel"
                  color="teal"
                  accessibilityLabel={t("other:cancel")}
                  style={{ marginLeft: 30 }}
                  onPress={() => this.addApponitment(!this.state.modalVisible)}
                >
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView style={{ marginTop: 2, backgroundColor: "white" }}>
          {this.state.Appointment.map(item => (
            <View style={styles.itemView} key={item.id}>
              <TouchableOpacity
                onPress={() => this.showOverlay(item.id)}
                style={{
                  width: "97%",
                  margin: 5,
                  marginVertical: 20,
                  backgroundColor: "white"
                }}
              >
                <View>
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
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

// export default observer(Settings);
export default withNamespaces(["book", "edit", "other"], {
  wait: true
})(AppointmentManage);

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
    padding: 4,
    width: "100%"
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

const pickerSelectStyles = StyleSheet.create({
  // inputIOS: {
  //   fontSize: 16,
  //   paddingTop: 13,
  //   paddingHorizontal: 10,
  //   paddingBottom: 12,
  //   borderWidth: 1,
  //   borderColor: "gray",
  //   borderRadius: 4,
  //   backgroundColor: "white",
  //   color: "black"
  // }
});
