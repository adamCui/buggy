var response = require('../slack/response');
var Message = require('../slack/message');
var Command = require('../slack/command');

var watch = new Command('watch', function(slack, jira, config) {
  var tokenized = /watch\s+([^\s]+)/.exec(slack.text.trim());
  var issue = tokenized[1];
  var hasIssue = /(\w+)-(\d+)/.test(issue);

  if (hasIssue) {
    jira.issue.addWatcher({'issueKey':issue, 'watcher':slack.user_name}, function(err, confirm) {
      if (err) {
        console.log(err);
        var errMessage = new Message('oops. i was unable to add you as a watcher.');
        response.send(slack.response_url, errMessage);
      } else {
        var text = slack.command + ' ' + slack.text;
        var message = new Message(text);
        message.setResponseType(true);
        message.addAttachment({
          title: slack.user_name + ' is now watching ' + issue,
          title_link: 'https://' + jira.host + '/browse/' + issue,
          fallback: slack.user_name + ' is now watching ' + issue,
          color: 'good'
        });
        response.sendFrom(slack.user_id, slack.channel_id, message, config.slack);
      }
    });
  } else if (user) {
    return new Message('i need a valid issue to watch.');
  } else {
    return new Message('you forgot to tell me which issue to watch.');
  }
});

watch.setHelp('watch issueKey', 'adds you as a watcher to a bug');

module.exports = watch;
