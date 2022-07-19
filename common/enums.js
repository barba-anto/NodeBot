const ChannelTypes = {
  WELCOME: "welcome",
  APPLICATIONS_RESULT: "members-applications-result",
  APPLICATIONS_REQUEST: "members-applications-request",
};

const ModalCustomTypes = {
  MEMBER_APPLICATION_SURVEY: "member-application-survey",
};

const ButtonTypes = {
  APPLICATIONS_REQUEST: ChannelTypes.APPLICATIONS_REQUEST,
  NUKE_CHANNEL: "nuke-channel",
  ABORT_NUKE_CHANNEL: "abort-nuke-channel",
};

module.exports = {
  ChannelTypes,
  ModalCustomTypes,
  ButtonTypes,
};
