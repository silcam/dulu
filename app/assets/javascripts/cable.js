// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the rails generate channel command.
//
// actioncable, not action_cable: the old filename logs a deprecation saying it
// is removed in Rails 8, which Phase 6 targets. The two assets are the same UMD
// build and both define the ActionCable global.
//= require actioncable
//= require_self
//= require_tree ./channels

(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();
}.call(this));
