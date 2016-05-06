/* global $, React, ReactDOM */
(function () {
  'use strict';

  var ReactionBarSegment = React.createClass({
    propTypes: {
      reaction: React.PropTypes.object.isRequired,
      total: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
      return {
        percent: 0
      };
    },
    componentWillMount: function () {
      this.state.style = {
        flex: '1 1 ' +
          this.props.reaction.count / this.props.total * 100 + 'px'
      };
      this.state.class = 'segment ' + this.props.reaction.type;
    },
    render: function () {
      return (
        <span
          className={this.state.class}
          htmlTitle={this.props.reaction.type}
          style={this.state.style} />
      );
    }
  });

  var ReactionBar = React.createClass({
    propTypes: {
      data: React.PropTypes.object.isRequired
    },
    render: function () {
      var self = this;
      function createSegment (reaction) {
        return (
          <ReactionBarSegment
            key={reaction.type}
            reaction={reaction}
            total={self.props.data.total} />
        );
      }
      return (
        <div className='reaction-bar'>
          {this.props.data.reactions.map(createSegment)}
        </div>
      );
    }
  });

  // - - -

  findReactionNodes()
    .then(function ($elements) {
      $elements.each(function () {
        var $this = $(this);
        getReactions($this).then(function (data) {
          ReactDOM.render(
            <ReactionBar data={data} />,
            $('<div>').insertBefore($this)[0]
          );
        });
      });
    })
    .catch(console.log);

  // - - -

  function getReactions ($this) {
    return new Promise(function (resolve, reject) {
      var reactions = [];
      var total = 0;
      $('[rel="ignore"]', $this).each(function () {
        try {
          var reaction = $(this).attr('aria-label');
          if (reaction) {
            reaction = reaction.split(' ');
            if (reaction[0].indexOf('K') > -1) {
              reaction[0] = Number(reaction[0].split('K').join('')) * 1000;
            }
            reactions.push({
              count: reaction[0],
              type: reaction[1]
            });
            total += Number(reaction[0]);
          }
        } catch (e) { reject(e); }
      });
      resolve({
        total: total,
        reactions: reactions
      });
    });
  }

  function findReactionNodes () {
    return new Promise(function (resolve, reject) {
      var interval = setInterval(function () {
        try {
          var $elements = $(
            '.UFILikeSentence'
            // '[data-testid="feedback_form"]'
          );
          if ($elements.length) {
            clearInterval(interval);
            resolve($elements);
          }
        } catch (e) { reject(e); }
      }, 1000);
    });
  }
})();
